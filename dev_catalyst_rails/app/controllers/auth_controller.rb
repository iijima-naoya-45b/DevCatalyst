# frozen_string_literal: true

class AuthController < ApplicationController
  # OAuth認証成功時のリダイレクト
  def success
    # access_tokenとtokenの両方をチェック
    token = params[:access_token] || params[:token]
    user_data = params[:user]
    expires_in = params[:expires_in]
    refresh_token = params[:refresh_token]
    
    Rails.logger.info "AuthController#success called with token present: #{token.present?}"
    
    if token.present?
      set_auth_cookies(access_token: token, refresh_token: refresh_token)

      redirect_url = "#{frontend_url}/auth/success?token=#{token}&access_token=#{token}&user=#{CGI.escape(user_data || '{}')}"
      redirect_url += "&expires_in=#{expires_in}" if expires_in.present?
      redirect_url += "&refresh_token=#{refresh_token}" if refresh_token.present?
      
      redirect_to redirect_url, allow_other_host: true
    else
      Rails.logger.error "Missing token in AuthController#success. Params: #{params.inspect}"
      redirect_to "#{frontend_url}/auth/error?error=missing_token", allow_other_host: true
    end
  end

  # OAuth認証失敗時のリダイレクト
  def error
    error_param = params[:error] || 'authentication_failed'
    message_param = params[:message]
    
    # フロントエンドのエラーページにリダイレクト
    redirect_url = "#{frontend_url}/auth/error?error=#{CGI.escape(error_param)}"
    redirect_url += "&message=#{CGI.escape(message_param)}" if message_param.present?
    
    Rails.logger.info "Redirecting to frontend error page: #{redirect_url}"
    redirect_to redirect_url, allow_other_host: true
  end

  private

  def frontend_url
    ENV['FRONTEND_URL'] || 'http://localhost:3000'
  end

  def set_auth_cookies(access_token:, refresh_token:)
    if refresh_token.present?
      cookies[:refresh_token] = {
        value: refresh_token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        path: '/'
      }
    end

    if access_token.present?
      cookies[:auth_token] = {
        value: access_token,
        httponly: false,
        secure: Rails.env.production?,
        same_site: :lax,
        path: '/'
      }
    end
  end
end