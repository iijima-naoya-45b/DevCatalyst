# frozen_string_literal: true

module Api
  module V1
    class AuthController < ApplicationController
      protect_from_forgery with: :null_session

      # POST /api/auth/login
      def login
        user = User.find_for_database_authentication(email: login_params[:email])

        if user&.valid_password?(login_params[:password])
          tokens = user.generate_jwt_tokens
          Rails.logger.info("[Auth] Login success user_id=#{user.id} email=#{user.email}")
          set_auth_cookies(tokens)

          render json: {
            success: true,
            message: "Login successful",
            user: user.as_json,
            access_token: tokens[:access_token],
            refresh_token: tokens[:refresh_token],
            expires_in: tokens[:expires_in],
            token_type: "bearer"
          }
        else
          render json: {
            success: false,
            error: "Invalid email or password",
            code: "INVALID_CREDENTIALS"
          }, status: :unauthorized
        end
      end

      # POST /api/auth/register
      def register
        user = User.new(register_params)
        user.plan = :free # デフォルトプラン

        if user.save
          tokens = user.generate_jwt_tokens
          Rails.logger.info("[Auth] Registration success user_id=#{user.id} email=#{user.email}")
          set_auth_cookies(tokens)

          render json: {
            success: true,
            message: "Registration successful",
            user: user.as_json,
            access_token: tokens[:access_token],
            refresh_token: tokens[:refresh_token],
            expires_in: tokens[:expires_in],
            token_type: "bearer"
          }, status: :created
        else
          render json: {
            success: false,
            error: "Registration failed",
            errors: user.errors.full_messages,
            code: "REGISTRATION_FAILED"
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/auth/logout
      def logout
        # JWTはステートレスなので、クライアント側でトークンを削除するだけ
        # 必要に応じてトークンブラックリストを実装

        render json: {
          success: true,
          message: "Logged out successfully"
        }
      end

      # POST /api/v1/auth/forgot_password
      def forgot_password
        user = User.find_by(email: forgot_password_params[:email])

        if user
          user.send_reset_password_instructions

          render json: {
            success: true,
            message: "Password reset instructions sent to your email"
          }
        else
          render json: {
            success: false,
            error: "Email not found",
            code: "EMAIL_NOT_FOUND"
          }, status: :not_found
        end
      end

      # POST /api/v1/auth/reset_password
      def reset_password
        user = User.reset_password_by_token(reset_password_params)

        if user.errors.empty?
          token = user.generate_jwt_token

          render json: {
            success: true,
            message: "Password reset successful",
            user: user.as_json,
            token: token
          }
        else
          render json: {
            success: false,
            error: "Password reset failed",
            errors: user.errors.full_messages,
            code: "RESET_FAILED"
          }, status: :unprocessable_entity
        end
      end

      # POST /api/auth/verify_token
      def verify_token
        token = extract_token_from_header

        if token.present?
          user = User.from_jwt_token(token, token_type: "access")

          if user
            render json: {
              success: true,
              user: user.as_json,
              token: token
            }
          else
            render json: {
              success: false,
              error: "Invalid or expired token",
              code: "INVALID_TOKEN"
            }, status: :unauthorized
          end
        else
          render json: {
            success: false,
            error: "Token not provided",
            code: "MISSING_TOKEN"
          }, status: :unauthorized
        end
      end

      # POST /api/auth/refresh
      def refresh_token
        refresh_token = params[:refresh_token]

        if refresh_token.blank?
          Rails.logger.warn("[Auth] Refresh token request missing refresh_token parameter")
          render json: {
            success: false,
            error: "Refresh token not provided",
            code: "MISSING_REFRESH_TOKEN"
          }, status: :bad_request
          return
        end

        tokens, user, remaining_seconds = User.refresh_access_token(refresh_token)

        if tokens && user
          Rails.logger.info("[Auth] Refresh token success user_id=#{user.id} remaining_refresh_lifetime=#{remaining_seconds}s")
          set_auth_cookies(tokens)
          render json: {
            success: true,
            message: "Token refreshed successfully",
            access_token: tokens[:access_token],
            refresh_token: tokens[:refresh_token],
            expires_in: tokens[:expires_in],
            token_type: "bearer"
          }
        else
          Rails.logger.warn("[Auth] Refresh token failed: invalid or expired token provided")
          render json: {
            success: false,
            error: "Invalid or expired refresh token",
            code: "INVALID_REFRESH_TOKEN"
          }, status: :unauthorized
        end
      end

      # GET /api/auth/oauth/:provider
      def oauth_redirect
        provider = params[:provider]

        # Deviseが生成するプロバイダー名に合わせる
        provider_path = provider == "google" ? "google_oauth2" : provider

        # フロントエンドのURLを生成
        oauth_url = "#{request.base_url}/users/auth/#{provider_path}?redirect_uri=#{CGI.escape("#{frontend_url}/auth/callback")}"

        render json: {
          success: true,
          oauth_url: oauth_url
        }
      end

      # GET /api/auth/oauth/:provider/callback
      def oauth_callback
        auth = request.env["omniauth.auth"]

        if auth.present?
          user = User.from_omniauth(auth)

          if user.persisted?
            tokens = user.generate_jwt_tokens

            # フロントエンドにリダイレクト（新しいトークン形式で）
            redirect_params = {
              access_token: tokens[:access_token],
              refresh_token: tokens[:refresh_token],
              expires_in: tokens[:expires_in],
              user: user.as_json.to_json
            }

            redirect_to "#{frontend_url}/auth/success?#{redirect_params.to_query}", allow_other_host: true
          else
            redirect_to "#{frontend_url}/auth/error?message=#{CGI.escape('OAuth authentication failed')}",
                        allow_other_host: true
          end
        else
          redirect_to "#{frontend_url}/auth/error?message=#{CGI.escape('OAuth data not found')}", allow_other_host: true
        end
      end

      private

      def login_params
        params.expect(user: [:email, :password])
      end

      def register_params
        params.expect(user: [:email, :password, :password_confirmation, :name])
      end

      def forgot_password_params
        params.expect(user: [:email])
      end

      def reset_password_params
        params.expect(user: [:reset_password_token, :password, :password_confirmation])
      end

      def set_auth_cookies(tokens)
        cookies[:refresh_token] = {
          value: tokens[:refresh_token],
          httponly: true,
          secure: Rails.env.production?,
          same_site: :lax,
          path: "/"
        }

        cookies[:auth_token] = {
          value: tokens[:access_token],
          httponly: false,
          secure: Rails.env.production?,
          same_site: :lax,
          path: "/"
        }
      end

      def extract_token_from_header
        auth_header = request.headers["Authorization"]
        return nil unless auth_header&.start_with?("Bearer ")

        auth_header.split.last
      end

      def frontend_url
        ENV["FRONTEND_URL"] || "http://localhost:3000"
      end
    end
  end
end
