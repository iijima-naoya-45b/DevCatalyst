class Api::V1::AiController < Api::V1::BaseController
  include ActionView::Helpers::TextHelper
  include ActionController::Live
  rescue_from AiChatService::RequestError do |error|
    flash.now[:error] = error.userFacingMessage
    render json: buildErrorPayload(error.userFacingMessage, error.details), status: error.httpStatus
  end

  rescue_from StandardError do |error|
    message = buildUnexpectedErrorMessage(error)
    flash.now[:error] = message
    render json: buildErrorPayload(message), status: :internal_server_error
  end

  rescue_from ActiveRecord::RecordNotFound do |error|
    message = "Api::V1::AiController: 指定されたチャットセッション (ID=#{params[:id]}) が見つかりません。エラー詳細: #{error.message}"
    flash.now[:error] = message
    render json: buildErrorPayload(message), status: :not_found
  end

  def chat
    ensureUserAuthenticated!
    return unless current_user.present?

    requestPayload = chatRequestPayload
    cacheManager = AiResponseCache.new
    cacheKey = cacheManager.generateCacheKey(userId: current_user.id, payload: requestPayload)
    persistenceManager = ChatPersistenceService.new(user: current_user)
    session = persistenceManager.ensureSession(
      sessionId: params[:session_id],
      requestMetadata: requestPayload
    )

    latestUserMessage = extractLatestUserMessage(requestPayload)
    persistenceManager.recordUserMessage(
      session: session,
      messagePayload: latestUserMessage,
      fullRequestPayload: requestPayload
    )

    cachedResponse = cacheManager.read(cacheKey)
    if cachedResponse.present?
      persistenceManager.recordAiMessage(
        session: session,
        responsePayload: cachedResponse,
        cacheHit: true
      )

      render json: buildSuccessPayload(cachedResponse, session, cacheHit: true), status: :ok
      return
    end

    service = AiChatService.new(
      fastApiBaseUrl: fastApiBaseUrl,
      authorizationToken: authorizationToken
    )

    responseData = service.sendChatRequest(requestPayload)
    normalizedResponse = normalizeResponsePayload(responseData)

    cacheManager.write(cacheKey, normalizedResponse)
    persistenceManager.recordAiMessage(
      session: session,
      responsePayload: normalizedResponse,
      cacheHit: false
    )

    render json: buildSuccessPayload(normalizedResponse, session, cacheHit: false), status: :ok
  end

  def chatStream
    ensureUserAuthenticated!
    return unless current_user.present?

    response.headers['Content-Type'] = 'text/event-stream'
    response.headers['Cache-Control'] = 'no-cache, no-transform'
    response.headers['X-Accel-Buffering'] = 'no'
    response.headers['Connection'] = 'keep-alive'

    requestPayload = chatRequestPayload

    persistenceManager = ChatPersistenceService.new(user: current_user)
    session = persistenceManager.ensureSession(
      sessionId: params[:session_id],
      requestMetadata: requestPayload
    )

    latestUserMessage = extractLatestUserMessage(requestPayload)
    persistenceManager.recordUserMessage(
      session: session,
      messagePayload: latestUserMessage,
      fullRequestPayload: requestPayload
    ) if latestUserMessage.present?

    chatState = {
      buffer: +'',
      assistant_content: +'',
      stream_completed: false
    }

    service = AiChatService.new(
      fastApiBaseUrl: fastApiBaseUrl,
      authorizationToken: authorizationToken
    )

    begin
      safe_stream_write(response.stream, status: 'started', session_id: session.id)

      service.streamChatRequest(requestPayload) do |chunk|
        safe_stream_write_raw(response.stream, chunk)
        processSseChunk(chatState, chunk)
      end

      finalizeStreamingResponse(persistenceManager, session, requestPayload, chatState, response.stream)
    rescue AiChatService::RequestError => error
      errorPayload = {
        error: true,
        message: error.userFacingMessage,
        details: error.details,
        session_id: session.id
      }
      safe_stream_write(response.stream, errorPayload)
    rescue StandardError => error
      Rails.logger.error "Api::V1::AiController#chatStream: #{error.class} - #{error.message}"
      errorPayload = {
        error: true,
        message: 'ストリーミング中に予期しないエラーが発生しました。',
        session_id: session.id
      }
      safe_stream_write(response.stream, errorPayload)
    ensure
      begin
        safe_stream_write(response.stream, done: true, session_id: session.id) unless chatState[:stream_completed]
      rescue IOError
        Rails.logger.warn 'Api::V1::AiController#chatStream: client disconnected before completion.'
      end

      begin
        response.stream.close
      rescue IOError
        Rails.logger.warn 'Api::V1::AiController#chatStream: stream already closed.'
      end
    end
  end

  def chatSessions
    ensureUserAuthenticated!
    return unless current_user.present?

    limit = params[:limit].presence&.to_i || 20
    sessions = current_user.chat_sessions.includes(:chat_messages)
                       .order(last_interacted_at: :desc)
                       .limit(limit)

    payload = sessions.map do |session|
      last_message = session.chat_messages.order(created_at: :desc).first
      {
        id: session.id,
        title: session.title.presence || last_message&.content&.truncate(40) || '新しいチャット',
        last_message_preview: last_message&.content&.truncate(80),
        last_interacted_at: session.last_interacted_at,
        created_at: session.created_at,
        messages_count: session.chat_messages.size,
        archived: session.archived
      }
    end

    render json: {
      success: true,
      data: payload
    }
  end

  def chatSessionMessages
    ensureUserAuthenticated!
    return unless current_user.present?

    session = current_user.chat_sessions.find(params[:id])
    per_page = [[params[:per_page].presence&.to_i || 50, 1].max, 200].min
    page = [params[:page].presence&.to_i || 1, 1].max

    messages_scope = session.chat_messages.order(created_at: :asc)
    total_messages = messages_scope.count
    paginated_messages = messages_scope.offset((page - 1) * per_page).limit(per_page)

    payload = {
      session: {
        id: session.id,
        title: session.title.presence || '新しいチャット',
        archived: session.archived,
        last_interacted_at: session.last_interacted_at,
        created_at: session.created_at
      },
      messages: paginated_messages.map { |message| serialize_chat_message(message) },
      pagination: {
        page: page,
        per_page: per_page,
        total: total_messages,
        total_pages: (total_messages.to_f / per_page).ceil
      }
    }

    render json: { success: true, data: payload }
  end

  private

  def ensureUserAuthenticated!
    return if current_user.present?

    message = 'Api::V1::AiController#ensureUserAuthenticated!: current_user is nil. Authorization header might be missing or invalid.'
    flash.now[:error] = message
    render json: buildErrorPayload(message), status: :unauthorized
    nil
  end

  def chatRequestPayload
    messages = params.require(:messages)

    unless messages.is_a?(Array) && messages.present?
      raise AiChatService::RequestError.new(
        'Api::V1::AiController#chatRequestPayload: messages must be a non-empty array.',
        httpStatus: :unprocessable_entity,
        details: {
          receivedClass: messages.class.name,
          receivedValue: messages
        }
      )
    end

    sanitizedMessages = messages.map do |message|
      role = message[:role] || message['role']
      content = message[:content] || message['content']

      if role.blank? || content.blank?
        raise AiChatService::RequestError.new(
          'Api::V1::AiController#chatRequestPayload: each message requires role and content.',
          httpStatus: :unprocessable_entity,
          details: {
            invalidMessage: message
          }
        )
      end

      {
        role: role,
        content: content
      }
    end

    metadataPayload = buildMetadataPayload(params[:metadata])

    {
      messages: sanitizedMessages,
      provider: params[:provider] || 'openai',
      model: params[:model] || 'gpt-4o-mini',
      temperature: params[:temperature] || 0.7,
      max_tokens: params[:max_tokens] || 1024,
      metadata: metadataPayload
    }
  end

  def authorizationToken
    headerToken = request.headers['Authorization']
    return headerToken if headerToken.present?

    cookieCandidates = [
      request.cookies['auth_access_token'],
      request.cookies['auth_token'],
      request.cookies['access_token']
    ].compact

    token = cookieCandidates.find(&:present?)
    return nil unless token

    "Bearer #{token}"
  end

  def fastApiBaseUrl
    ENV.fetch('FASTAPI_BASE_URL', 'http://localhost:8000')
  end

  def buildErrorPayload(message, details = nil)
    payload = {
      success: false,
      error: message
    }

    payload[:details] = details if details.present?

    payload
  end

  def buildUnexpectedErrorMessage(error)
    "Api::V1::AiController#chat: Unexpected #{error.class} occurred. Message: #{error.message}. Backtrace: #{Array(error.backtrace).first(3).join(' | ')}"
  end

  def extractLatestUserMessage(requestPayload)
    messages = Array(requestPayload[:messages])
    latest = messages.reverse.find do |message|
      role = message[:role] || message['role']
      role == 'user'
    end

    return nil unless latest

    {
      role: latest[:role] || latest['role'],
      content: latest[:content] || latest['content']
    }
  end

  def normalizeResponsePayload(responsePayload)
    JSON.parse(responsePayload.to_json)
  end

  def buildSuccessPayload(responsePayload, session, cacheHit:)
    assistantMessage = responsePayload['message'] || responsePayload[:message]

    dataPayload = {
      assistant_message: assistantMessage,
      message: assistantMessage,
      provider: responsePayload['provider'] || responsePayload[:provider],
      model: responsePayload['model'] || responsePayload[:model],
      usage: responsePayload['usage'] || responsePayload[:usage],
      session_id: session.id,
      cache_hit: cacheHit,
      raw_response: responsePayload
    }.compact

    {
      success: true,
      data: dataPayload
    }
  end

  def processSseChunk(chatState, chunk)
    chatState[:buffer] << chunk

    while (separator_index = chatState[:buffer].index("\n\n"))
      raw_event = chatState[:buffer].slice!(0, separator_index + 2)
      raw_event.each_line do |line|
        next unless line.start_with?('data:')

        payload = line.sub(/^data:\s*/, '').strip
        begin
          data = JSON.parse(payload)
        rescue JSON::ParserError
          next
        end

        if data['content'].present?
          chatState[:assistant_content] << data['content']
        end

        if data['done']
          chatState[:stream_completed] = true
        end
      end
    end
  end

  def finalizeStreamingResponse(persistenceManager, session, requestPayload, chatState, stream)
    assistantMessage = chatState[:assistant_content].to_s
    return if assistantMessage.blank?

    normalizedResponse = {
      'message' => assistantMessage,
      'provider' => requestPayload[:provider] || 'openai',
      'model' => requestPayload[:model] || 'gpt-4o-mini'
    }

    persistenceManager.recordAiMessage(
      session: session,
      responsePayload: normalizedResponse,
      cacheHit: false
    )

    chatState[:stream_completed] = true

    safe_stream_write(stream, {
      done: true,
      session_id: session.id,
      assistant_message: assistantMessage
    })
  end

  def safe_stream_write(stream, payload)
    stream.write("data: #{payload.to_json}\n\n")
  rescue IOError
    Rails.logger.warn 'Api::V1::AiController#chatStream: failed to write payload to stream.'
  end

  def safe_stream_write_raw(stream, chunk)
    stream.write(chunk)
  rescue IOError
    Rails.logger.warn 'Api::V1::AiController#chatStream: failed to write chunk to stream.'
  end

  def serialize_chat_message(message)
    {
      id: message.id,
      sender_role: message.sender_role,
      content: message.content,
      metadata: message.metadata || {},
      token_count: message.token_count,
      cached_response: message.cached_response,
      responded_at: message.responded_at,
      created_at: message.created_at
    }
  end

  def buildMetadataPayload(rawMetadata)
    return {} if rawMetadata.blank?

    converted =
      if rawMetadata.respond_to?(:to_unsafe_h)
        rawMetadata.to_unsafe_h
      elsif rawMetadata.respond_to?(:to_h)
        rawMetadata.to_h
      else
        rawMetadata
      end

    return {} unless converted.is_a?(Hash)

    converted.deep_symbolize_keys
  rescue StandardError => error
    Rails.logger.warn "Api::V1::AiController#buildMetadataPayload: Failed to normalize metadata. Error=#{error.class} Message=#{error.message}"
    {}
  end
end

