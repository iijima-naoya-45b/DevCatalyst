# frozen_string_literal: true

module Api
  module V1
    module Ai
      class SessionsController < BaseController
        DEFAULT_SESSION_LIMIT = 20
        MAX_SESSION_LIMIT = 100

        # GET /api/v1/ai/sessions
        def index
          sessions = current_user.chat_sessions
            .includes(:chat_messages)
            .order(last_interacted_at: :desc)
            .limit(session_limit)

          render json: success_response(
            sessions.map { |session| serialize_session(session) }
          )
        end

        # GET /api/v1/ai/sessions/:id
        def show
          session = current_user.chat_sessions.find(params[:id])

          render json: success_response(
            serialize_session(session, include_messages: true)
          )
        end

        # DELETE /api/v1/ai/sessions/:id
        def destroy
          session = current_user.chat_sessions.find(params[:id])
          session.destroy!

          render json: success_response(message: "Session deleted successfully")
        end

        # PATCH /api/v1/ai/sessions/:id/archive
        def archive
          session = current_user.chat_sessions.find(params[:id])
          session.update!(archived: true)

          render json: success_response(
            serialize_session(session)
          )
        end

        private

        def session_limit
          limit = params[:limit].to_i
          return DEFAULT_SESSION_LIMIT if limit.zero?

          [limit, MAX_SESSION_LIMIT].min
        end

        def serialize_session(session, include_messages: false)
          last_message = session.chat_messages.order(created_at: :desc).first

          data = {
            id: session.id,
            title: session.title.presence || last_message&.content&.truncate(40) || "新しいチャット",
            last_message_preview: last_message&.content&.truncate(80),
            last_interacted_at: session.last_interacted_at&.iso8601,
            created_at: session.created_at.iso8601,
            messages_count: session.chat_messages.size,
            archived: session.archived
          }

          if include_messages
            data[:messages] = session.chat_messages.order(created_at: :asc).map do |message|
              serialize_message(message)
            end
          end

          data
        end

        def serialize_message(message)
          {
            id: message.id,
            sender_role: message.sender_role,
            content: message.content,
            metadata: message.metadata || {},
            token_count: message.token_count,
            cached_response: message.cached_response,
            responded_at: message.responded_at&.iso8601,
            created_at: message.created_at.iso8601
          }
        end
      end
    end
  end
end
