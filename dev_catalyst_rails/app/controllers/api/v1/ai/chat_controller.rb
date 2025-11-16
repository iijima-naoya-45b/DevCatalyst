# frozen_string_literal: true

module Api
  module V1
    module Ai
      class ChatController < BaseController
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
      end
    end
  end
end
