# frozen_string_literal: true

require "json"
require "faraday"
require "faraday/retry"

class AiChatService
  class RequestError < StandardError
    attr_reader :httpStatus, :details

    def initialize(message, httpStatus: :internal_server_error, details: nil)
      super(message)
      @httpStatus = httpStatus
      @details = details
    end

    def userFacingMessage
      message
    end
  end

  def initialize(fastApiBaseUrl:, authorizationToken:)
    @fastApiBaseUrl = fastApiBaseUrl
    @authorizationToken = authorizationToken
  end

  def sendChatRequest(payload)
    requestBody = buildRequestBody(payload)
    response = nil

    response = faradayConnection.post("/api/ai/chat") do |request|
      request.headers["Content-Type"] = "application/json"
      request.headers["Accept"] = "application/json"
      request.headers["Authorization"] = @authorizationToken if authorizationHeaderPresent?
      request.body = requestBody.to_json
    end

    parsedBody = parseJsonResponse(response.body)

    return parsedBody if response.success?

    raise RequestError.new(
      buildFailureMessage(response.status, parsedBody),
      httpStatus: response.status,
      details: {
        endpoint: "#{@fastApiBaseUrl}/api/ai/chat",
        requestBody: requestBody,
        responseStatus: response.status,
        responseBody: parsedBody
      }
    )
  rescue Faraday::TimeoutError => e
    raise RequestError.new(
      buildFaradayErrorMessage("timeout", e, requestBody),
      httpStatus: :gateway_timeout,
      details: buildCommonErrorDetails(e, requestBody)
    )
  rescue Faraday::ConnectionFailed => e
    raise RequestError.new(
      buildFaradayErrorMessage("connection_failed", e, requestBody),
      httpStatus: :service_unavailable,
      details: buildCommonErrorDetails(e, requestBody)
    )
  rescue Faraday::ClientError => e
    raise RequestError.new(
      buildFaradayErrorMessage("client_error", e, requestBody),
      httpStatus: :bad_gateway,
      details: buildCommonErrorDetails(e, requestBody)
    )
  rescue JSON::ParserError => e
    raise RequestError.new(
      buildParserErrorMessage(e, response&.body),
      httpStatus: :bad_gateway,
      details: {
        endpoint: "#{@fastApiBaseUrl}/api/ai/chat",
        rawBody: response&.body
      }
    )
  end

  def streamChatRequest(payload, &chunkHandler)
    requestBody = buildRequestBody(payload)
    response = nil

    response = faradayConnection.post("/api/ai/chat/stream") do |request|
      request.headers["Content-Type"] = "application/json"
      request.headers["Accept"] = "text/plain"
      request.headers["Authorization"] = @authorizationToken if authorizationHeaderPresent?
      request.body = requestBody.to_json
      request.options.timeout = 60
      request.options.on_data = proc do |chunk, _overall_received_bytes|
        yield(chunk) if chunkHandler
      end
    end

    unless response.success?
      parsedBody = safeParseJson(response.body)
      raise RequestError.new(
        buildFailureMessage(response.status, parsedBody, context: "streamChatRequest"),
        httpStatus: response.status,
        details: {
          endpoint: "#{@fastApiBaseUrl}/api/ai/chat/stream",
          requestBody: requestBody,
          responseStatus: response.status,
          responseBody: parsedBody
        }
      )
    end

    response
  rescue Faraday::TimeoutError => e
    raise RequestError.new(
      buildFaradayErrorMessage("timeout", e, requestBody, endpoint: "/api/ai/chat/stream",
                                                          context: "streamChatRequest"),
      httpStatus: :gateway_timeout,
      details: buildCommonErrorDetails(e, requestBody, endpoint: "/api/ai/chat/stream")
    )
  rescue Faraday::ConnectionFailed => e
    raise RequestError.new(
      buildFaradayErrorMessage("connection_failed", e, requestBody, endpoint: "/api/ai/chat/stream",
                                                                    context: "streamChatRequest"),
      httpStatus: :service_unavailable,
      details: buildCommonErrorDetails(e, requestBody, endpoint: "/api/ai/chat/stream")
    )
  rescue Faraday::ClientError => e
    raise RequestError.new(
      buildFaradayErrorMessage("client_error", e, requestBody, endpoint: "/api/ai/chat/stream",
                                                               context: "streamChatRequest"),
      httpStatus: :bad_gateway,
      details: buildCommonErrorDetails(e, requestBody, endpoint: "/api/ai/chat/stream")
    )
  end

  private

  def faradayConnection
    @faradayConnection ||= Faraday.new(url: @fastApiBaseUrl) do |connection|
      connection.request :retry, max: 2, interval: 0.5, backoff_factor: 2
      connection.adapter Faraday.default_adapter
    end
  end

  def authorizationHeaderPresent?
    @authorizationToken.present?
  end

  def buildRequestBody(payload)
    {
      messages: payload[:messages],
      provider: payload[:provider],
      model: payload[:model],
      temperature: payload[:temperature],
      max_tokens: payload[:max_tokens],
      metadata: payload[:metadata]
    }.compact
  end

  def parseJsonResponse(body)
    return {} if body.blank?

    JSON.parse(body)
  end

  def buildFailureMessage(status, parsedBody, context: "sendChatRequest")
    detail = parsedBody.is_a?(Hash) ? parsedBody["message"] || parsedBody["detail"] : parsedBody

    "AiChatService##{context}: FastAPI returned non-success status #{status}. Detail: #{detail}."
  end

  def buildFaradayErrorMessage(category, error, requestBody, endpoint: "/api/ai/chat", context: "sendChatRequest")
    "AiChatService##{context}: Faraday #{category} while requesting #{@fastApiBaseUrl}#{endpoint}. " \
      "Error class: #{error.class}. Message: #{error.message}. Request body: #{requestBody}."
  end

  def buildCommonErrorDetails(error, requestBody, endpoint: "/api/ai/chat")
    {
      endpoint: "#{@fastApiBaseUrl}#{endpoint}",
      requestBody: requestBody,
      errorClass: error.class.name,
      errorMessage: error.message
    }
  end

  def buildParserErrorMessage(error, rawBody)
    "AiChatService#sendChatRequest: JSON::ParserError encountered. Message: #{error.message}. " \
      "Raw response body: #{rawBody}."
  end

  def safeParseJson(body)
    return {} if body.blank?

    JSON.parse(body)
  rescue JSON::ParserError
    body
  end
end
