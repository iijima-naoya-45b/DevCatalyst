# frozen_string_literal: true

class OauthService
  def initialize(auth_data)
    @auth_data = auth_data
  end

  def find_or_create_user
    User.from_omniauth(@auth_data)
  end

  def generate_tokens(user)
    user.generate_jwt_tokens
  end

  def build_success_response(user, tokens)
    {
      access_token: tokens[:access_token],
      refresh_token: tokens[:refresh_token],
      expires_in: tokens[:expires_in],
      user: user.to_json
    }
  end

  def self.handle_callback(auth_data)
    service = new(auth_data)
    user = service.find_or_create_user

    return nil unless user.persisted?

    tokens = service.generate_tokens(user)
    service.build_success_response(user, tokens)
  end
end
