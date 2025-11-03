# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRF保護をスキップ（OAuth認証のため）
  skip_before_action :verify_authenticity_token
  
  # Google OAuth2 callback
  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    Rails.logger.info "Auth info: #{request.env['omniauth.auth']&.info&.to_h}"
    
    @user = User.from_omniauth(request.env['omniauth.auth'])
    
    if @user.persisted?
      Rails.logger.info "Google OAuth successful: #{@user.email}"
      
      # JWTトークンを生成
      tokens = @user.generate_jwt_tokens
      
      # 成功時のリダイレクト
      redirect_to auth_success_path(
        access_token: tokens[:access_token],
        refresh_token: tokens[:refresh_token],
        expires_in: tokens[:expires_in],
        user: @user.to_json
      )
    else
      Rails.logger.error "Failed to create user: #{@user.errors.full_messages}"
      redirect_to auth_error_path(error: 'user_creation_failed', message: 'ユーザーの作成に失敗しました')
    end
  rescue StandardError => e
    Rails.logger.error "Google OAuth error: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    redirect_to auth_error_path(error: 'oauth_error', message: 'OAuth認証中にエラーが発生しました')
  end

  # GitHub OAuth callback
  def github
    Rails.logger.info "GitHub OAuth callback received"
    Rails.logger.info "Auth info: #{request.env['omniauth.auth']&.info&.to_h}"
    
    @user = User.from_omniauth(request.env['omniauth.auth'])
    
    if @user.persisted?
      Rails.logger.info "GitHub OAuth successful: #{@user.email}"
      
      # JWTトークンを生成
      tokens = @user.generate_jwt_tokens
      
      # 成功時のリダイレクト
      redirect_to auth_success_path(
        access_token: tokens[:access_token],
        refresh_token: tokens[:refresh_token],
        expires_in: tokens[:expires_in],
        user: @user.to_json
      )
    else
      Rails.logger.error "Failed to create user: #{@user.errors.full_messages}"
      redirect_to auth_error_path(error: 'user_creation_failed', message: 'ユーザーの作成に失敗しました')
    end
  rescue StandardError => e
    Rails.logger.error "GitHub OAuth error: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    redirect_to auth_error_path(error: 'oauth_error', message: 'OAuth認証中にエラーが発生しました')
  end

  # OAuth failure callback
  def failure
    error_type = params[:message] || 'authentication_failed'
    strategy = params[:strategy] || 'unknown'
    
    Rails.logger.error "OAuth authentication failed - Strategy: #{strategy}, Error: #{error_type}"
    
    # より詳細なエラーメッセージを生成
    detailed_message = case error_type
    when 'csrf_detected'
      "セキュリティエラー: CSRF攻撃が検出されました。再度お試しください。"
    when 'invalid_credentials'
      "認証情報が無効です。正しい認証情報を使用してください。"
    when 'timeout'
      "認証がタイムアウトしました。ネットワーク接続を確認して再度お試しください。"
    else
      "OAuth認証に失敗しました (#{strategy}): #{error_type}"
    end
    
    redirect_to auth_error_path(error: 'authentication_failed', message: detailed_message)
  end

  private

  def auth_success_path(params = {})
    "/auth/success?#{params.to_query}"
  end

  def auth_error_path(params = {})
    "/auth/error?#{params.to_query}"
  end
end