# frozen_string_literal: true

class AuthService
  def initialize(user = nil)
    @user = user
  end

  def authenticate_with_credentials(email, password)
    user = User.find_by(email: email)
    return nil unless user&.valid_password?(password)
    
    @user = user
    generate_auth_response
  end

  def register_user(user_params)
    user = User.new(user_params)
    return nil unless user.save
    
    @user = user
    generate_auth_response
  end

  def verify_token(token)
    payload = JwtService.decode(token, token_type: 'access')
    return nil unless payload
    
    user = User.find_by(id: payload['user_id'])
    return nil unless user
    
    @user = user
    {
      user: user.as_json,
      expires_in: calculate_expires_in(payload['exp'])
    }
  end

  def refresh_access_token(refresh_token)
    payload = JwtService.decode(refresh_token, token_type: 'refresh')
    return nil unless payload
    
    user = User.find_by(id: payload['user_id'])
    return nil unless user
    
    @user = user
    generate_auth_response
  end

  private

  def generate_auth_response
    tokens = JwtService.generate_tokens(@user)
    {
      user: @user.as_json,
      tokens: tokens
    }
  end

  def calculate_expires_in(exp_timestamp)
    return nil unless exp_timestamp
    
    expires_at = Time.at(exp_timestamp)
    (expires_at - Time.current).to_i
  end
end