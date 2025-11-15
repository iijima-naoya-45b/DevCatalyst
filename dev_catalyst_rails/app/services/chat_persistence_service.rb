class ChatPersistenceService
  def initialize(user:)
    @user = user
  end

  def ensureSession(sessionId:, requestMetadata:)
    existingSession = findSession(sessionId)
    return existingSession if existingSession.present?

    buildNewSession(requestMetadata)
  end

  def recordUserMessage(session:, messagePayload:, fullRequestPayload:)
    return unless messagePayload.present?

    session.chat_messages.create!(
      sender_role: 'user',
      content: messagePayload[:content],
      metadata: buildUserMetadata(messagePayload, fullRequestPayload)
    )
    session.touchLastInteracted!
  end

  def recordAiMessage(session:, responsePayload:, cacheHit:)
    aiContent = responsePayload.fetch('message', nil) || responsePayload[:message]

    if aiContent.blank?
      raise AiChatService::RequestError.new(
        'ChatPersistenceService#recordAiMessage: AI response payload does not include message content.',
        httpStatus: :bad_gateway,
        details: responsePayload
      )
    end

    session.chat_messages.create!(
      sender_role: 'aria',
      content: aiContent,
      metadata: buildAiMetadata(responsePayload, cacheHit),
      token_count: extractTokenCount(responsePayload),
      cached_response: cacheHit,
      responded_at: Time.current
    )
    session.touchLastInteracted!
  end

  private

  def findSession(sessionId)
    return nil if sessionId.blank?

    @user.chat_sessions.find_by(id: sessionId)
  end

  def buildNewSession(requestMetadata)
    initialTitle = deriveSessionTitle(requestMetadata)

    @user.chat_sessions.create!(
      title: initialTitle,
      metadata: {
        provider: requestMetadata[:provider],
        model: requestMetadata[:model],
        temperature: requestMetadata[:temperature],
        max_tokens: requestMetadata[:max_tokens],
        created_via: 'chat_endpoint'
      }.compact,
      last_interacted_at: Time.current
    )
  end

  def deriveSessionTitle(requestMetadata)
    metadataTitle = requestMetadata[:metadata].is_a?(Hash) ? requestMetadata[:metadata][:title] : nil
    return metadataTitle if metadataTitle.present?

    fallbackTitle = requestMetadata[:messages]&.last&.dig(:content)
    if fallbackTitle.present?
      return fallbackTitle.to_s.truncate(80)
    end

    '新しいチャット'
  end

  def buildUserMetadata(messagePayload, fullRequestPayload)
    {
      role: messagePayload[:role],
      submitted_at: Time.current,
      request_context: fullRequestPayload.except(:messages),
      original_message: messagePayload
    }
  end

  def buildAiMetadata(responsePayload, cacheHit)
    {
      provider: responsePayload.fetch('provider', nil) || responsePayload[:provider],
      model: responsePayload.fetch('model', nil) || responsePayload[:model],
      usage: responsePayload.fetch('usage', nil) || responsePayload[:usage],
      cache_hit: cacheHit,
      received_at: Time.current
    }.compact
  end

  def extractTokenCount(responsePayload)
    usage = responsePayload.fetch('usage', nil) || responsePayload[:usage]
    return nil unless usage.is_a?(Hash)

    usage['total_tokens'] || usage[:total_tokens]
  end
end

