# frozen_string_literal: true

module Gdpr
  class DataDeletionService
    def initialize(user, deletion_type: :anonymize, reason: nil)
      @user = user
      @deletion_type = deletion_type
      @reason = reason
    end

    def execute
      log = create_deletion_log

      begin
        case @deletion_type.to_sym
        when :soft
          perform_soft_delete
        when :anonymize
          perform_anonymization
        when :hard
          perform_hard_delete
        end

        summary = generate_deletion_summary
        log.mark_completed!(summary)

        { success: true, log: log, summary: summary }
      rescue StandardError => e
        log.mark_failed!(e.message)
        Rails.logger.error "GDPR deletion failed: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")

        { success: false, error: e.message, log: log }
      end
    end

    private

    def create_deletion_log
      DataDeletionLog.create!(
        user_id: @user.id,
        email: @user.email,
        deletion_type: @deletion_type,
        reason: @reason,
        requested_at: Time.current,
        status: :processing
      )
    end

    def perform_soft_delete
      @user.update!(deleted_at: Time.current)
    end

    def perform_anonymization
      @user.transaction do
        # 個人情報の匿名化
        @user.update!(
          email: "deleted_#{@user.id}@example.com",
          name: "Deleted User",
          avatar_url: nil,
          provider: nil,
          uid: nil,
          encrypted_password: "",
          deleted_at: Time.current
        )

        # チャットデータの匿名化
        @user.chat_sessions.update_all(archived: true)
        @user.chat_messages.update_all(
          content: "[Content deleted for privacy]"
        )
      end
    end

    def perform_hard_delete
      @user.transaction do
        # 関連データの完全削除
        @user.chat_sessions.destroy_all
        @user.user_consents.destroy_all

        # ユーザーの完全削除
        @user.destroy!
      end
    end

    def generate_deletion_summary
      {
        user_id: @user.id,
        deletion_type: @deletion_type,
        deleted_at: Time.current.iso8601,
        chat_sessions_count: @user.chat_sessions.count,
        messages_count: @user.chat_messages.count
      }
    end
  end
end
