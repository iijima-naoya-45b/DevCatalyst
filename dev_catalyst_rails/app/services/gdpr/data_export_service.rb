# frozen_string_literal: true

module Gdpr
  class DataExportService
    def initialize(user)
      @user = user
    end

    def export_all_data
      {
        metadata: export_metadata,
        profile: export_profile,
        chat_data: export_chat_data,
        consents: export_consents,
        activity_log: export_activity_log
      }
    end

    def generate_export_file
      data = export_all_data
      filename = "user_data_#{@user.id}_#{Time.zone.today}.json"

      {
        filename: filename,
        content: JSON.pretty_generate(data),
        content_type: "application/json"
      }
    end

    private

    def export_metadata
      {
        export_date: Time.current.iso8601,
        user_id: @user.id,
        format_version: "1.0",
        gdpr_compliant: true
      }
    end

    def export_profile
      {
        id: @user.id,
        email: @user.email,
        name: @user.name,
        plan: @user.plan,
        avatar_url: @user.avatar_url,
        provider: @user.provider,
        created_at: @user.created_at.iso8601,
        updated_at: @user.updated_at.iso8601,
        last_sign_in_at: @user.last_sign_in_at&.iso8601
      }
    end

    def export_chat_data
      @user.chat_sessions.includes(:chat_messages).map do |session|
        {
          session_id: session.id,
          created_at: session.created_at.iso8601,
          last_interacted_at: session.last_interacted_at.iso8601,
          archived: session.archived,
          messages: session.chat_messages.map do |msg|
            {
              id: msg.id,
              role: msg.sender_role,
              content: msg.content,
              created_at: msg.created_at.iso8601,
              metadata: msg.metadata
            }
          end
        }
      end
    end

    def export_consents
      @user.user_consents.map do |consent|
        {
          type: consent.consent_type,
          version: consent.version,
          consented_at: consent.consented_at.iso8601,
          revoked_at: consent.revoked_at&.iso8601,
          active: consent.active?
        }
      end
    end

    def export_activity_log
      {
        total_chat_sessions: @user.chat_sessions.count,
        total_messages: @user.chat_messages.count,
        last_activity: @user.chat_sessions.maximum(:last_interacted_at)&.iso8601
      }
    end
  end
end
