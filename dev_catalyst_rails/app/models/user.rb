# frozen_string_literal: true

class User < ApplicationRecord
  # Concerns
  include User::Authenticatable
  include User::Plannable
  include User::Avatarizable
  include GdprCompliant
  
  # Associations
  has_many :chat_sessions, dependent: :destroy
  has_many :chat_messages, through: :chat_sessions
  has_many :specs, dependent: :destroy

  # Validations
  validates :email, presence: true, uniqueness: { case_sensitive: false }, email_format: true
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :provider, presence: true, if: :oauth_user?
  validates :uid, presence: true, uniqueness: { scope: :provider }, if: :oauth_user?
  validates :password, password_strength: true, if: :password_required?

  # Scopes
  scope :oauth_users, -> { where.not(provider: nil) }
  scope :regular_users, -> { where(provider: nil) }
  scope :active, -> { where(deleted_at: nil) }



  # User info for API response
  def as_json(options = {})
    super(options.merge(
      only: [:id, :email, :name, :plan, :created_at, :updated_at],
      methods: [:avatar_url]
    ))
  end

  def self.token_remaining_seconds(token)
    payload = JWT.decode(token, jwt_secret_key).first
    expiration = payload['exp'].to_i
    [expiration - Time.current.to_i, 0].max
  rescue JWT::DecodeError, JWT::ExpiredSignature
    0
  end

  def remaining_refresh_lifetime_in_seconds(refresh_token)
    self.class.token_remaining_seconds(refresh_token)
  end

  # 表示用名前
  def display_name
    name.presence || email.split('@').first
  end
  
  # アクティブユーザーかどうか
  def active?
    deleted_at.nil?
  end
  
  private
  
  def oauth_user?
    provider.present?
  end
end