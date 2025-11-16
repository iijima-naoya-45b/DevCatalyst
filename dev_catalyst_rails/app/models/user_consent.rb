# frozen_string_literal: true

class UserConsent < ApplicationRecord
  belongs_to :user

  enum :consent_type, {
    terms_of_service: 0,
    privacy_policy: 1,
    data_processing: 2,
    marketing: 3,
    analytics: 4,
    cookies: 5
  }

  validates :consent_type, presence: true, uniqueness: { scope: :user_id }
  validates :version, presence: true
  validates :consented_at, presence: true
  validates :ip_address, presence: true
  validates :user_agent, presence: true

  scope :active, -> { where(revoked_at: nil) }
  scope :revoked, -> { where.not(revoked_at: nil) }
  scope :by_type, ->(type) { where(consent_type: type) }

  # 同意を取り消す
  def revoke!
    update!(revoked_at: Time.current)
  end

  # 有効な同意かどうか
  def active?
    revoked_at.nil?
  end

  # 同意の有効期限チェック（2年）
  def expired?
    consented_at < 2.years.ago
  end
end
