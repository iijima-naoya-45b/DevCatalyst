# frozen_string_literal: true

class ChatMessage < ApplicationRecord
  belongs_to :chat_session

  SENDER_ROLES = ["user", "aria", "system"].freeze

  validates :sender_role, presence: true, inclusion: { in: SENDER_ROLES }
  validates :content, presence: true, content_length: { minimum: 1, maximum: 10_000, no_whitespace_only: true }
  validates :metadata, presence: true

  after_create :refresh_session_interaction

  scope :recent_first, -> { order(created_at: :desc) }

  def cached_response?
    cached_response
  end

  def metadata_attributes
    metadata || {}
  end

  def refresh_session_interaction
    chat_session.touch_last_interacted!
  end

  def mark_as_cached_response!
    update!(cached_response: true)
  end
end
