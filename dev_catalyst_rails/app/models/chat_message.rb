class ChatMessage < ApplicationRecord
  belongs_to :chat_session

  SENDER_ROLES = %w[user aria system].freeze

  validates :sender_role, presence: true, inclusion: { in: SENDER_ROLES }
  validates :content, presence: true
  validates :metadata, presence: true

  after_create :refreshSessionInteraction

  scope :recentFirst, -> { order(created_at: :desc) }

  def senderRole
    sender_role
  end

  def cachedResponse?
    cached_response
  end

  def metadataAttributes
    metadata || {}
  end

  def refreshSessionInteraction
    chat_session.touchLastInteracted!
  end

  def markAsCachedResponse!
    update!(cached_response: true)
  end
end



