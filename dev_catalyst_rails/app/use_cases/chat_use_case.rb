# frozen_string_literal: true

class ChatUseCase
  Result = Struct.new(:success?, :data, :error, :status, keyword_init: true)

  def initialize(user:, params:, session_id: nil, authorization_token: nil)
    @user = user
    @params = params
    @session_id = session_id
    @authorization_token = authorization_token
    @cache = AiResponseCache.new
    @persistence = ChatPersistenceService.new(user: user)
  end

  def execute
    # リクエストペイロードの構築
    request_payload = build_request_payload

    # キャッシュキーの生成
    cache_key = @cache.generateCacheKey(userId: @user.id, payload: request_payload)

    # セッションの確保
    session = @persistence.ensureSession(
      sessionId: @session_id,
      requestMetadata: request_payload
    )

    # ユーザーメッセージの記録
    latest_user_message = extract_latest_user_message(request_payload)
    @persistence.recordUserMessage(
      session: session,
      messagePayload: latest_user_message,
      fullRequestPayload: request_payload
    )

    # キャッシュチェック
    cached_response = @cache.read(cache_key)
    if cached_response.present?
      @persistence.recordAiMessage(
        session: session,
        responsePayload: cached_response,
        cacheHit: true
      )

      return Result.new(
        success?: true,
        data: build_response_data(cached_response, session, cache_hit: true)
      )
    end

    # AI サービスへのリクエスト
    service = AiChatService.new(
      fastApiBaseUrl: fast_api_base_url,
      authorizationToken: authorization_token
    )

    response_data = service.sendChatRequest(request_payload)
    normalized_response = normalize_response_payload(response_data)

    # キャッシュへの保存
    @cache.write(cache_key, normalized_response)

    # AIメッセージの記録
    @persistence.recordAiMessage(
      session: session,
      responsePayload: normalized_response,
      cacheHit: false
    )

    Result.new(
      success?: true,
      data: build_response_data(normalized_response, session, cache_hit: false)
    )
  rescue AiChatService::RequestError => e
    Result.new(
      success?: false,
      error: e.userFacingMessage,
      status: e.httpStatus
    )
  rescue StandardError => e
    Rails.logger.error "ChatUseCase error: #{e.class} - #{e.message}"
    Result.new(
      success?: false,
      error: "An unexpected error occurred",
      status: :internal_server_error
    )
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

  def normalize_response_payload(response_payload)
    JSON.parse(response_payload.to_json)
  end

  def build_response_data(response_payload, session, cache_hit:)
    assistant_message = response_payload["message"] || response_payload[:message]

    {
      assistant_message: assistant_message,
      message: assistant_message,
      provider: response_payload["provider"] || response_payload[:provider],
      model: response_payload["model"] || response_payload[:model],
      usage: response_payload["usage"] || response_payload[:usage],
      session_id: session.id,
      cache_hit: cache_hit,
      raw_response: response_payload
    }.compact
  end

  def fast_api_base_url
    ENV.fetch("FASTAPI_BASE_URL", "http://localhost:8000")
  end

  attr_reader :authorization_token
end
