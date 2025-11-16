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
  has_many :projects, dependent: :destroy
  has_one :psychological_profile, dependent: :destroy
  has_many :refresh_tokens, dependent: :destroy

  # Validations
  validates :email, presence: true, uniqueness: { case_sensitive: false }, email_format: true
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :provider, presence: true, if: :oauth_user?
  validates :uid, presence: true, uniqueness: { scope: :provider }, if: :oauth_user?
  validates :password, password_strength: true, if: :password_required?

  # Callbacks
  after_create :ensure_psychological_profile

  # Scopes
  scope :oauth_users, -> { where.not(provider: nil) }
  scope :regular_users, -> { where(provider: nil) }
  scope :active, -> { where(deleted_at: nil) }
  scope :recent, -> { order(created_at: :desc) }

  # User info for API response
  def as_json(options = {})
    super(options.merge(
      only: [:id, :email, :name, :plan, :created_at, :updated_at],
      methods: [:avatar_url]
    ))
  end

  def self.token_remaining_seconds(token)
    payload = JWT.decode(token, jwt_secret_key).first
    expiration = payload["exp"].to_i
    [expiration - Time.current.to_i, 0].max
  rescue JWT::DecodeError, JWT::ExpiredSignature
    0
  end

  def remaining_refresh_lifetime_in_seconds(refresh_token)
    self.class.token_remaining_seconds(refresh_token)
  end

  # 表示用名前
  def display_name
    name.presence || email.split("@").first
  end

  # アクティブユーザーかどうか
  def active?
    deleted_at.nil?
  end

  # rubocop:disable Naming/PredicateMethod
  # 心理学的状態を更新（テスト用に最小実装）
  def update_psychological_state(cognitive_load_level:, self_efficacy_score:)
    ensure_psychological_profile
    psychological_profile.update!(
      cognitive_load_level: cognitive_load_level,
      self_efficacy_score: self_efficacy_score
    )
    true
  end
  # rubocop:enable Naming/PredicateMethod

  # 経験レベル（プロジェクト数に応じたラベルを返す簡易版）
  def user_level
    project_count = Project.where(user_id: id).count
    return "newcomer" if project_count.zero?
    return "beginner" if project_count <= 2
    return "intermediate" if project_count <= 5

    "advanced"
  end

  # 心理学的配慮のフレンドリーメッセージ（最小の分岐）
  def friendly_error_message(key)
    case key.to_sym
    when :authentication_failed
      "ログイン情報が正しくありません"
    else
      "エラーが発生しました。時間をおいて再度お試しください。"
    end
  end

  private

  def oauth_user?
    provider.present?
  end

  def ensure_psychological_profile
    create_psychological_profile! unless psychological_profile
  end
end
