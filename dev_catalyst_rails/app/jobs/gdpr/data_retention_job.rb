# frozen_string_literal: true

module Gdpr
  class DataRetentionJob < ApplicationJob
    queue_as :default

    def perform
      Rails.logger.info "[GDPR] Starting data retention job"

      delete_old_soft_deleted_users
      archive_old_chat_sessions
      notify_inactive_users
      cleanup_expired_consents

      Rails.logger.info "[GDPR] Data retention job completed"
    end

    private

    # 論理削除後30日で完全削除
    def delete_old_soft_deleted_users
      cutoff_date = 30.days.ago
      users = User.deleted.where(deleted_at: ...cutoff_date)

      Rails.logger.info "[GDPR] Deleting #{users.count} old soft-deleted users"

      users.find_each do |user|
        Gdpr::DataDeletionService.new(user, deletion_type: :hard).execute
        Rails.logger.info "[GDPR] Hard deleted user #{user.id}"
      rescue StandardError => e
        Rails.logger.error "[GDPR] Failed to delete user #{user.id}: #{e.message}"
      end
    end

    # 6ヶ月以上前のチャットセッションをアーカイブ
    def archive_old_chat_sessions
      cutoff_date = 6.months.ago
      count = ChatSession.where(last_interacted_at: ...cutoff_date)
        .where(archived: false)
        .update_all(archived: true)

      Rails.logger.info "[GDPR] Archived #{count} old chat sessions"
    end

    # 1年間ログインしていないユーザーに通知
    def notify_inactive_users
      # 1年以上ログインなし、かつ13ヶ月以内（通知は1回のみ）
      users = User.active
        .where(last_sign_in_at: ...1.year.ago)
        .where("last_sign_in_at > ?", 13.months.ago)

      Rails.logger.info "[GDPR] Notifying #{users.count} inactive users"

      users.find_each do |user|
        GdprMailer.inactive_account_warning(user).deliver_later
        Rails.logger.info "[GDPR] Sent inactive warning to user #{user.id}"
      rescue StandardError => e
        Rails.logger.error "[GDPR] Failed to notify user #{user.id}: #{e.message}"
      end
    end

    # 期限切れの同意を処理
    def cleanup_expired_consents
      expired_consents = UserConsent.active.select(&:expired?)

      Rails.logger.info "[GDPR] Processing #{expired_consents.count} expired consents"

      expired_consents.each do |consent|
        GdprMailer.consent_renewal_required(consent.user, consent).deliver_later
        Rails.logger.info "[GDPR] Sent consent renewal to user #{consent.user_id}"
      rescue StandardError => e
        Rails.logger.error "[GDPR] Failed to notify user #{consent.user_id}: #{e.message}"
      end
    end
  end
end
