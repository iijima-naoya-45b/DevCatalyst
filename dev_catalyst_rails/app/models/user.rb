# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2, :github]

  # Validations
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :provider, presence: true, if: :oauth_user?
  validates :uid, presence: true, uniqueness: { scope: :provider }, if: :oauth_user?
  validates :plan, inclusion: { in: %w[free standard premium] }

  # Enums
  enum :plan, { free: 0, standard: 1, premium: 2 }

  # Scopes
  # Rails enumは自動的に User.free, User.standard, User.premium スコープを生成します
  scope :with_plan, ->(plan_name) { where(plan: plan_name) if plan_name.present? }
  scope :oauth_users, -> { where.not(provider: nil) }
  scope :regular_users, -> { where(provider: nil) }

  # OAuth authentication
  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name || auth.info.email.split('@').first
      user.provider = auth.provider
      user.uid = auth.uid
      
      # 開発用プロバイダーの場合は画像URLがない場合がある
      user.avatar_url = auth.info.image if auth.info.respond_to?(:image)
      user.plan = :free # デフォルトプラン
      
      # パスワードは不要（OAuth認証のため）
      user.password = Devise.friendly_token[0, 20]
    end
  end

  # JWT token generation
  def generate_jwt_tokens
    access_token_payload = {
      user_id: id,
      email: email,
      type: 'access',
      exp: access_token_expiration_time.to_i
    }
    
    refresh_token_payload = {
      user_id: id,
      email: email,
      type: 'refresh',
      exp: refresh_token_expiration_time.to_i
    }
    
    {
      access_token: JWT.encode(access_token_payload, jwt_secret_key),
      refresh_token: JWT.encode(refresh_token_payload, jwt_secret_key),
      expires_in: ENV['JWT_ACCESS_TOKEN_EXPIRATION']&.to_i || 15.minutes.to_i
    }
  end

  # 後方互換性のため
  def generate_jwt_token
    generate_jwt_tokens[:access_token]
  end

  # JWT token verification
  def self.from_jwt_token(token, token_type: 'access')
    begin
      decoded_token = JWT.decode(token, jwt_secret_key)
      payload = decoded_token[0]
      
      # トークンタイプの検証
      if payload['type'] != token_type
        Rails.logger.error "Invalid token type: expected #{token_type}, got #{payload['type']}"
        return nil
      end
      
      user_id = payload['user_id']
      find(user_id)
    rescue JWT::DecodeError, JWT::ExpiredSignature, ActiveRecord::RecordNotFound => e
      Rails.logger.error "JWT decode error: #{e.message}"
      nil
    end
  end

  # リフレッシュトークンからアクセストークンを再生成
  def self.refresh_access_token(refresh_token)
    user = from_jwt_token(refresh_token, token_type: 'refresh')
    return nil unless user
    
    user.generate_jwt_tokens
  end

  # User info for API response
  def as_json(options = {})
    super(options.merge(
      only: [:id, :email, :name, :plan, :created_at, :updated_at],
      methods: [:avatar_url]
    ))
  end

  def avatar_url
    # OAuth認証の場合はプロバイダーのアバター、そうでなければGravatar
    read_attribute(:avatar_url).presence || default_avatar_url
  end

  def default_avatar_url
    # GravatarまたはデフォルトアバターのURL
    "https://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(email.downcase)}?d=identicon&s=200"
  end

  # Plan check methods
  def free_plan?
    plan == 'free'
  end

  def standard_plan?
    plan == 'standard'
  end

  def premium_plan?
    plan == 'premium'
  end

  def can_access_feature?(feature)
    case feature
    when :basic_features
      true # すべてのプランで利用可能
    when :advanced_features
      standard_plan? || premium_plan?
    when :premium_features
      premium_plan?
    else
      false
    end
  end

  private

  def oauth_user?
    provider.present?
  end

  # Devise methods override for OAuth users
  def password_required?
    super && provider.blank?
  end

  def email_required?
    true
  end

  def email_changed?
    false
  end

  def self.jwt_secret_key
    ENV['JWT_SECRET_KEY'] || Rails.application.secret_key_base
  end

  def jwt_secret_key
    self.class.jwt_secret_key
  end

  def jwt_expiration_time
    expiration_hours = ENV['JWT_EXPIRATION_TIME']&.to_i || 24
    expiration_hours.hours.from_now
  end

  def access_token_expiration_time
    expiration_minutes = ENV['JWT_ACCESS_TOKEN_EXPIRATION']&.to_i || 15
    expiration_minutes.minutes.from_now
  end

  def refresh_token_expiration_time
    expiration_days = ENV['JWT_REFRESH_TOKEN_EXPIRATION']&.to_i || 7
    expiration_days.days.from_now
  end
end