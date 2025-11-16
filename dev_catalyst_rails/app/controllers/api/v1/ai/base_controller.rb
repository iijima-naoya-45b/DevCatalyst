# frozen_string_literal: true

module Api
  module V1
    module Ai
      class BaseController < Api::V1::BaseController
        before_action :ensure_user_authenticated!

        rescue_from AiChatService::RequestError, with: :handle_ai_service_error

        private

        def ensure_user_authenticated!
          return if current_user.present?

          render json: error_response("Unauthorized"), status: :unauthorized
        end

        def handle_ai_service_error(error)
          render json: error_response(
            error.userFacingMessage,
            details: error.details
          ), status: error.httpStatus
        end

        def error_response(message, details: nil)
          {
            success: false,
            error: message,
            details: details
          }.compact
        end

        def success_response(data)
          {
            success: true,
            data: data
          }
        end

        def fast_api_base_url
          ENV.fetch("FASTAPI_BASE_URL", "http://localhost:8000")
        end

        def authorization_token
          header_token = request.headers["Authorization"]
          return header_token if header_token.present?

          cookie_token = request.cookies["auth_access_token"] ||
                         request.cookies["auth_token"] ||
                         request.cookies["access_token"]

          "Bearer #{cookie_token}" if cookie_token.present?
        end
      end
    end
  end
end
