# frozen_string_literal: true

module GdprCompliant
  extend ActiveSupport::Concern
  
  included do
    has_many :user_consents, dependent: :destroy
    
    scope :active, -> { where(deleted_at: nil) }
    scope :deleted, -> { where.not(deleted_at: nil) }
  end
  
  # データ削除（Right to be Forgotten）
  def gdpr_delete!(deletion_type: :anonymize, reason: nil)
    DataDeletionLog.transaction do
      log = create_deletion_log(deletion_type, reason)
      
      case deletion_type.to_sym
      when :soft
        perform_soft_delete
      when :anonymize
        perform_anonymization
      when :hard
        perform_hard_delete
      end
      
      log.mark_completed!(generate_deletion_summary)
      log
    end
  rescue StandardError => e
    Rails.logger.error "GDPR deletion failed: #{e.message}"
    raise
  end
  
  # 個人データの匿名化
  def anonymize_personal_data!
    update!(
      email: "deleted_#{id}@example.com",
      name: "Deleted User",
      avatar_url: nil,
      provider: nil,
      uid: nil,
      encrypted_password: '',
      deleted_at: Time.current
    )
  end
  
  # 関連データの削除
  def delete_associated_data!
    chat_sessions.destroy_all
    user_consents.destroy_all
  end
  
  # データエクスポート（Right to Data Portability）
  def export_personal_data
    Gdpr::DataExportService.new(self).export_all_data
  end
  
  # 同意の確認
  def has_consent?(consent_type)
    user_consents.active.exists?(consent_type: consent_type)
  end
  
  # 同意の記録
  def record_consent(consent_type:, version:, ip_address:, user_agent:)
    user_consents.create!(
      consent_type: consent_type,
      version: version,
      consented_at: Time.current,
      ip_address: ip_address,
      user_agent: user_agent
    )
  end
  
  private
  
  def create_deletion_log(deletion_type, reason)
    DataDeletionLog.create!(
      user_id: id,
      email: email,
      deletion_type: deletion_type,
      reason: reason,
      requested_at: Time.current,
      status: :processing
    )
  end
  
  def perform_soft_delete
    update!(deleted_at: Time.current)
  end
  
  def perform_anonymization
    anonymize_personal_data!
    chat_sessions.update_all(archived: true)
  end
  
  def perform_hard_delete
    delete_associated_data!
    destroy!
  end
  
  def generate_deletion_summary
    {
      user_id: id,
      deleted_at: Time.current.iso8601,
      chat_sessions_count: chat_sessions.count,
      messages_count: chat_messages.count
    }
  end
end
