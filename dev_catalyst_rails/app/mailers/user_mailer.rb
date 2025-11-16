# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: ENV["MAILER_FROM_EMAIL"] || "noreply@devcatalyst.com"

  # パスワードリセット用メール
  # @param user [User] ユーザーオブジェクト
  # @param reset_password_token [String] リセットトークン
  def reset_password_instructions(user, reset_password_token)
    @user = user
    @reset_password_token = reset_password_token
    @reset_password_url = "#{frontend_url}/reset-password?token=#{@reset_password_token}"
    @support_email = ENV["SUPPORT_EMAIL"] || "support@devcatalyst.com"

    mail(
      to: @user.email,
      subject: "パスワードリセットのご案内 - devCatalyst"
    )
  end

  # ウェルカムメール
  # @param user [User] ユーザーオブジェクト
  def welcome_email(user)
    @user = user
    @login_url = "#{frontend_url}/login"

    mail(
      to: @user.email,
      subject: "devCatalystへようこそ！"
    )
  end

  private

  def frontend_url
    ENV["FRONTEND_URL"] || "http://localhost:3000"
  end
end
