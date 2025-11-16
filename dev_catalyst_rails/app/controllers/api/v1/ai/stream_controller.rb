# frozen_string_literal: true

module Api
  module V1
    module Ai
      class StreamController < BaseController
        include ActionController::Live

        # POST /api/v1/ai/chat/stream
        def create
          setup_streaming_headers

          StreamChatUseCase.new(
            user: current_user,
            params: chat_params,
            session_id: params[:session_id],
            stream: response.stream,
            authorization_token: authorization_token
          ).execute

          # UseCaseがストリーミング処理を完全に管理するため、
          # ここでは特に何もしない
        ensure
          close_stream_safely
        end

        private

        def setup_streaming_headers
          response.headers["Content-Type"] = "text/event-stream"
          response.headers["Cache-Control"] = "no-cache, no-transform"
          response.headers["X-Accel-Buffering"] = "no"
          response.headers["Connection"] = "keep-alive"
        end

        def close_stream_safely
          response.stream.close
        rescue IOError
          Rails.logger.warn "Stream already closed"
        end

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
