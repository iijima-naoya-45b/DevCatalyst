class ChatSession < ApplicationRecord
  belongs_to :user
  has_many :chat_messages, dependent: :destroy

  scope :recentFirst, -> { order(last_interacted_at: :desc) }

  validates :last_interacted_at, presence: true
  validates :archived, inclusion: { in: [true, false] }

  def lastInteractedAt
    last_interacted_at
  end

  def chatMessages
    chat_messages
  end

  def touchLastInteracted!
    update!(last_interacted_at: Time.current)
  end

  def archive!
    update!(archived: true)
  end

  def archived?
    archived
  end
end



