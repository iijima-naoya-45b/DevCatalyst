# frozen_string_literal: true

module Api
  module V1
    module Ai
      class ChatController < BaseController
        prepend_before_action :assign_current_user_from_header, if: -> { Rails.env.test? }
        # POST /api/v1/ai/chat
        def create
          result = ChatUseCase.new(
            user: current_user,
            params: chat_params,
            session_id: params[:session_id],
            authorization_token: authorization_token
          ).execute

          if result.success?
            render json: success_response(result.data)
          else
            render json: error_response(result.error), status: result.status
          end
        end

        private

        def chat_params
          params.expect(
            chat: [:provider,
                   :model,
                   :temperature,
                   :max_tokens,
                   { messages: [:role, :content],
                     metadata: {} }]
          )
        rescue ActionController::ParameterMissing
          # messagesが直接渡される場合の対応
          {
            messages: params.permit(messages: [:role, :content])[:messages],
            provider: params[:provider],
            model: params[:model],
            temperature: params[:temperature],
            max_tokens: params[:max_tokens],
            metadata: params[:metadata] || {}
          }
        end

        def assign_current_user_from_header
          auth_header = request.headers["Authorization"]
          return if auth_header.blank? || !auth_header.start_with?("Bearer ")

          token = auth_header.split.last
          @current_user = User.from_jwt_token(token)
        end
      end
    end
  end
end
