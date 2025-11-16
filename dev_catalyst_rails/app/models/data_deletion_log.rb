# frozen_string_literal: true

class DataDeletionLog < ApplicationRecord
  enum :deletion_type, {
    soft: 0,      # 論理削除
    anonymize: 1, # 匿名化
    hard: 2       # 物理削除
  }

  enum :status, {
    pending: 0,
    processing: 1,
    completed: 2,
    failed: 3
  }

  validates :user_id, presence: true
  validates :deletion_type, presence: true
  validates :status, presence: true
  validates :requested_at, presence: true

  scope :recent, -> { order(requested_at: :desc) }
  scope :pending_deletions, -> { where(status: :pending) }

  # 削除完了をマーク
  def mark_completed!(summary = {})
    update!(
      status: :completed,
      completed_at: Time.current,
      deleted_data_summary: serialize_summary(summary)
    )
  end

  # 削除失敗をマーク
  def mark_failed!(error_message)
    update!(
      status: :failed,
      deleted_data_summary: serialize_summary({ error: error_message })
    )
  end

  private

  def serialize_summary(value)
    return value if value.is_a?(String)

    value.to_json
  end
end
