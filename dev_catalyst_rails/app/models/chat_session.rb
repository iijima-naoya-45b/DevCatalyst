# frozen_string_literal: true

class ChatSession < ApplicationRecord
  belongs_to :user
  has_many :chat_messages, dependent: :destroy
  has_many :specs, dependent: :destroy

  scope :recent_first, -> { order(last_interacted_at: :desc) }

  validates :last_interacted_at, presence: true
  validates :archived, inclusion: { in: [true, false] }

  def touch_last_interacted!
    update!(last_interacted_at: Time.current)
  end

  def archive!
    update!(archived: true)
  end

  def archived?
    archived
  end
end
