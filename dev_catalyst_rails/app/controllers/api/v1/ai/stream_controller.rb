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
          # 受け取り形式の揺れを吸収してフラット化して返す
          # 許容する入力:
          # - { chat: { ... } }
          # - { stream: { chat: { ... } } }
          # - { messages: [...], provider: "..." } (フラット)
          raw = if params[:stream].is_a?(ActionController::Parameters) && params[:stream][:chat].present?
                  params[:stream][:chat]
                elsif params[:chat].present?
                  params[:chat]
                else
                  params
                end

          permitted = raw.permit(
            :provider, :model, :temperature, :max_tokens,
            messages: [:role, :content],
            metadata: {}
          )

          {
            messages: permitted[:messages],
            provider: permitted[:provider],
            model: permitted[:model],
            temperature: permitted[:temperature],
            max_tokens: permitted[:max_tokens],
            metadata: permitted[:metadata] || {}
          }
        end
      end
    end
  end
end
