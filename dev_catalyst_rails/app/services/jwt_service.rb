# frozen_string_literal: true

class JwtService
  class << self
    def encode(payload, expiration = nil)
      payload[:exp] = expiration.to_i if expiration
      JWT.encode(payload, secret_key)
    end

    def decode(token, token_type: 'access')
      decoded_token = JWT.decode(token, secret_key)
      payload = decoded_token[0]
      
      return nil if payload['type'] != token_type
      
      payload
    rescue JWT::DecodeError, JWT::ExpiredSignature => e
      Rails.logger.error "JWT decode error: #{e.message}"
      nil
    end

    def generate_access_token(user)
      payload = {
        user_id: user.id,
        email: user.email,
        type: 'access',
        exp: access_token_expiration.to_i
      }
      encode(payload)
    end

    def generate_refresh_token(user)
      payload = {
        user_id: user.id,
        email: user.email,
        type: 'refresh',
        exp: refresh_token_expiration.to_i
      }
      encode(payload)
    end

    def generate_tokens(user)
      {
        access_token: generate_access_token(user),
        refresh_token: generate_refresh_token(user),
        expires_in: access_token_duration
      }
    end

    private

    def secret_key
      ENV['JWT_SECRET_KEY'] || Rails.application.secret_key_base
    end

    def access_token_duration
      (ENV['JWT_ACCESS_TOKEN_EXPIRATION']&.to_i || 15).minutes.to_i
    end

    def refresh_token_duration
      (ENV['JWT_REFRESH_TOKEN_EXPIRATION']&.to_i || 7).days.to_i
    end

    def access_token_expiration
      access_token_duration.seconds.from_now
    end

    def refresh_token_expiration
      refresh_token_duration.seconds.from_now
    end
  end
end