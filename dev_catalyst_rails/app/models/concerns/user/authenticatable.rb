# frozen_string_literal: true

module User::Authenticatable
  extend ActiveSupport::Concern
  
  included do
    # Devise設定
    devise :database_authenticatable, :registerable,
           :recoverable, :rememberable, :validatable,
           :omniauthable, omniauth_providers: [:google_oauth2, :github]
  end
  
  class_methods do
    # OAuth認証
    def from_omniauth(auth)
      where(email: auth.info.email).first_or_create do |user|
        user.email = auth.info.email
        user.name = auth.info.name || auth.info.email.split('@').first
        user.provider = auth.provider
        user.uid = auth.uid
        user.avatar_url = auth.info.image if auth.info.respond_to?(:image)
        user.plan = :free
        user.password = Devise.friendly_token[0, 20]
      end
    end
    
    # JWTトークンからユーザーを取得
    def from_jwt_token(token, token_type: 'access')
      payload = JwtService.decode(token, token_type: token_type)
      return nil unless payload
      
      find_by(id: payload['user_id'])
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "User not found: #{e.message}"
      nil
    end
    
    # リフレッシュトークンからアクセストークンを再生成
    def refresh_access_token(refresh_token)
      user = from_jwt_token(refresh_token, token_type: 'refresh')
      return [nil, nil, nil] unless user
      
      tokens = user.generate_jwt_tokens
      remaining_seconds = token_remaining_seconds(refresh_token)
      
      [tokens, user, remaining_seconds]
    end
    
    private
    
    def token_remaining_seconds(token)
      payload = JWT.decode(token, jwt_secret_key).first
      expiration = payload['exp'].to_i
      [expiration - Time.current.to_i, 0].max
    rescue JWT::DecodeError, JWT::ExpiredSignature
      0
    end
    
    def jwt_secret_key
      ENV['JWT_SECRET_KEY'] || Rails.application.secret_key_base
    end
  end
  
  # JWTトークン生成
  def generate_jwt_tokens
    JwtService.generate_tokens(self)
  end
  
  # 後方互換性のため
  def generate_jwt_token
    generate_jwt_tokens[:access_token]
  end
  
  # パスワードリセットメール送信
  def send_reset_password_instructions
    raw_token, encrypted_token = Devise.token_generator.generate(
      self.class,
      :reset_password_token
    )
    
    self.reset_password_token = encrypted_token
    self.reset_password_sent_at = Time.current
    save(validate: false)
    
    UserMailer.reset_password_instructions(self, raw_token).deliver_now
    
    raw_token
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
end
