# frozen_string_literal: true

class ErrorSerializer
  def initialize(error, status: :bad_request, details: nil)
    @error = error
    @status = status
    @details = details
  end

  def as_json
    {
      success: false,
      error: {
        code: error_code,
        message: error_message,
        details: error_details,
        timestamp: Time.current.iso8601
      }
    }.compact
  end

  private

  def error_code
    case @error
    when ActiveRecord::RecordNotFound
      "RECORD_NOT_FOUND"
    when ActiveRecord::RecordInvalid
      "VALIDATION_ERROR"
    when ActionController::ParameterMissing
      "MISSING_PARAMETER"
    when JWT::DecodeError, JWT::ExpiredSignature
      "INVALID_TOKEN"
    else
      error_code_from_status
    end
  end

  def error_code_from_status
    case @status
    when :unauthorized
      "UNAUTHORIZED"
    when :forbidden
      "FORBIDDEN"
    when :not_found
      "NOT_FOUND"
    when :unprocessable_entity
      "UNPROCESSABLE_ENTITY"
    when :too_many_requests
      "RATE_LIMIT_EXCEEDED"
    else
      "INTERNAL_SERVER_ERROR"
    end
  end

  def error_message
    case @error
    when String
      @error
    when ActiveRecord::RecordInvalid
      @error.record.errors.full_messages.join(", ")
    when ActiveRecord::RecordNotFound
      "The requested resource was not found"
    when ActionController::ParameterMissing
      "Missing required parameter: #{@error.param}"
    else
      @error.message
    end
  end

  def error_details
    return @details if @details.present?

    case @error
    when ActiveRecord::RecordInvalid
      format_validation_errors(@error.record.errors)
    when ActionController::ParameterMissing
      { parameter: @error.param }
    end
  end

  def format_validation_errors(errors)
    errors.messages.transform_values do |messages|
      messages.map { |msg| msg.is_a?(String) ? msg : msg.to_s }
    end
  end
end
