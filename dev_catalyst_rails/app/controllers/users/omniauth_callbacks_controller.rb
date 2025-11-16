# frozen_string_literal: true

module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    skip_before_action :verify_authenticity_token

    def passthru
      super
    end

    def google_oauth2
      handle_oauth_callback("Google")
    end

    def github
      handle_oauth_callback("GitHub")
    end

    def failure
      error_type = params[:message] || "authentication_failed"
      strategy = params[:strategy] || "unknown"

      Rails.logger.error "OAuth authentication failed - Strategy: #{strategy}, Error: #{error_type}"

      detailed_message = error_message_for(error_type, strategy)
      redirect_to auth_error_path(error: "authentication_failed", message: detailed_message)
    end

    private

    def handle_oauth_callback(provider_name)
      Rails.logger.info "#{provider_name} OAuth callback received"
      Rails.logger.info "Auth info: #{request.env['omniauth.auth']&.info&.to_h}"

      response = OauthService.handle_callback(request.env["omniauth.auth"])

      if response
        Rails.logger.info "#{provider_name} OAuth successful"
        redirect_to auth_success_path(response)
      else
        Rails.logger.error "Failed to create user"
        redirect_to auth_error_path(
          error: "user_creation_failed",
          message: "ユーザーの作成に失敗しました"
        )
      end
    rescue StandardError => e
      Rails.logger.error "#{provider_name} OAuth error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      redirect_to auth_error_path(
        error: "oauth_error",
        message: "OAuth認証中にエラーが発生しました"
      )
    end

    def error_message_for(error_type, strategy)
      case error_type
      when "csrf_detected"
        "セキュリティエラー: CSRF攻撃が検出されました。再度お試しください。"
      when "invalid_credentials"
        "認証情報が無効です。正しい認証情報を使用してください。"
      when "timeout"
        "認証がタイムアウトしました。ネットワーク接続を確認して再度お試しください。"
      else
        "OAuth認証に失敗しました (#{strategy}): #{error_type}"
      end
    end

    def auth_success_path(params = {})
      "/auth/success?#{params.to_query}"
    end

    def auth_error_path(params = {})
      "/auth/error?#{params.to_query}"
    end
  end
end
