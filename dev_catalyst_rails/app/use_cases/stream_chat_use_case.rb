# frozen_string_literal: true

class StreamChatUseCase
  Result = Struct.new(:success?, :session, :error, :status, keyword_init: true)

  def initialize(user:, params:, stream:, session_id: nil, authorization_token: nil)
    @user = user
    @params = params
    @session_id = session_id
    @stream = stream
    @authorization_token = authorization_token
    @persistence = ChatPersistenceService.new(user: user)
  end

  def execute
    # リクエストペイロードの構築
    request_payload = build_request_payload

    # セッションの確保
    session = @persistence.ensureSession(
      sessionId: @session_id,
      requestMetadata: request_payload
    )

    # ユーザーメッセージの記録
    latest_user_message = extract_latest_user_message(request_payload)
    if latest_user_message.present?
      @persistence.recordUserMessage(
        session: session,
        messagePayload: latest_user_message,
        fullRequestPayload: request_payload
      )
    end

    # チャット状態の初期化
    chat_state = {
      buffer: +"",
      assistant_content: +"",
      stream_completed: false
    }

    # AI サービスへのストリーミングリクエスト
    service = AiChatService.new(
      fastApiBaseUrl: fast_api_base_url,
      authorizationToken: authorization_token
    )

    # ストリーミング開始通知
    write_to_stream(status: "started", session_id: session.id)

    # ストリーミング処理
    service.streamChatRequest(request_payload) do |chunk|
      write_raw_to_stream(chunk)
      process_sse_chunk(chat_state, chunk)
    end

    # ストリーミング完了処理
    finalize_streaming(session, request_payload, chat_state)

    Result.new(
      success?: true,
      session: session
    )
  rescue AiChatService::RequestError => e
    write_to_stream(
      error: true,
      message: e.userFacingMessage,
      details: e.details,
      session_id: @session_id
    )

    Result.new(
      success?: false,
      error: e.userFacingMessage,
      status: e.httpStatus
    )
  rescue StandardError => e
    Rails.logger.error "StreamChatUseCase error: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")

    write_to_stream(
      error: true,
      message: "An unexpected error occurred during streaming",
      session_id: @session_id
    )

    Result.new(
      success?: false,
      error: "An unexpected error occurred",
      status: :internal_server_error
    )
  ensure
    if defined?(chat_state) && chat_state && !chat_state[:stream_completed]
      write_to_stream(done: true, session_id: @session_id)
    end
  end

  private

  def build_request_payload
    {
      messages: @params[:messages],
      provider: @params[:provider] || "openai",
      model: @params[:model] || "gpt-4o-mini",
      temperature: @params[:temperature] || 0.7,
      max_tokens: @params[:max_tokens] || 1024,
      metadata: @params[:metadata] || {}
    }
  end

  def extract_latest_user_message(request_payload)
    messages = Array(request_payload[:messages])
    latest = messages.reverse.find do |message|
      role = message[:role] || message["role"]
      role == "user"
    end

    return nil unless latest

    {
      role: latest[:role] || latest["role"],
      content: latest[:content] || latest["content"]
    }
  end

  def process_sse_chunk(chat_state, chunk)
    chat_state[:buffer] << chunk

    while (separator_index = chat_state[:buffer].index("\n\n"))
      raw_event = chat_state[:buffer].slice!(0, separator_index + 2)
      raw_event.each_line do |line|
        next unless line.start_with?("data:")

        payload = line.sub(/^data:\s*/, "").strip
        begin
          data = JSON.parse(payload)
        rescue JSON::ParserError
          next
        end

        chat_state[:assistant_content] << data["content"] if data["content"].present?

        chat_state[:stream_completed] = true if data["done"]
      end
    end
  end

  def finalize_streaming(session, request_payload, chat_state)
    assistant_message = chat_state[:assistant_content].to_s
    return if assistant_message.blank?

    normalized_response = {
      "message" => assistant_message,
      "provider" => request_payload[:provider] || "openai",
      "model" => request_payload[:model] || "gpt-4o-mini"
    }

    @persistence.recordAiMessage(
      session: session,
      responsePayload: normalized_response,
      cacheHit: false
    )

    chat_state[:stream_completed] = true

    write_to_stream(
      done: true,
      session_id: session.id,
      assistant_message: assistant_message
    )
  end

  def write_to_stream(payload)
    @stream.write("data: #{payload.to_json}\n\n")
  rescue IOError
    Rails.logger.warn "StreamChatUseCase: failed to write payload to stream"
  end

  def write_raw_to_stream(chunk)
    @stream.write(chunk)
  rescue IOError
    Rails.logger.warn "StreamChatUseCase: failed to write chunk to stream"
  end

  def fast_api_base_url
    ENV.fetch("FASTAPI_BASE_URL", "http://localhost:8000")
  end

  attr_reader :authorization_token
end
