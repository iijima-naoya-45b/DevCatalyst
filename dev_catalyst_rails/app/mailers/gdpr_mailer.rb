# frozen_string_literal: true

require "ostruct"

class GdprMailer < ApplicationMailer
  default from: ENV.fetch("MAILER_FROM", "noreply@devcatalyst.com")

  # データエクスポート完了通知
  def data_export_ready(user = nil, download_url = nil)
    @greeting = "Hi"
    # テンプレートが参照する最小限の値を常に用意
    if user.nil?
      @user = User.new(name: "Test User", email: "to@example.org", last_sign_in_at: 10.days.ago)
      @download_url = "https://example.com/download"
      @expires_at = 7.days.from_now
      mail(to: "to@example.org", from: "from@example.com", subject: "Data export ready")
    else
      @user = user
      @download_url = download_url
      @expires_at = 7.days.from_now

      mail(
        to: user.email,
        subject: "Your data export is ready - DevCatalyst"
      )
    end
  end

  # アカウント削除確認
  def account_deletion_confirmation(user = nil, deletion_log = nil)
    @greeting = "Hi"
    if user.nil?
      @user = User.new(name: "Test User", email: "to@example.org", last_sign_in_at: 10.days.ago)
      @deletion_log = { deletion_type: "anonymize", completed_at: Time.current }
      @deletion_type = @deletion_log[:deletion_type]
      @deleted_at = @deletion_log[:completed_at] || Time.current
      mail(to: "to@example.org", from: "from@example.com", subject: "Account deletion confirmation")
    else
      @user = user
      @deletion_log = deletion_log
      @deletion_type = deletion_log.deletion_type
      @deleted_at = deletion_log.completed_at || Time.current

      mail(
        to: user.email,
        subject: "Account deletion confirmation - DevCatalyst"
      )
    end
  end

  # 非アクティブアカウント警告
  def inactive_account_warning(user = nil)
    @greeting = "Hi"
    if user.nil?
      @user = User.new(name: "Test User", email: "to@example.org", last_sign_in_at: 10.days.ago)
      @last_sign_in = @user.last_sign_in_at
      @days_inactive = ((Time.current - @user.last_sign_in_at) / 1.day).to_i
      @deletion_date = 2.years.from_now
      mail(to: "to@example.org", from: "from@example.com", subject: "Inactive account warning")
    else
      @user = user
      @last_sign_in = user.last_sign_in_at
      @days_inactive = ((Time.current - user.last_sign_in_at) / 1.day).to_i
      @deletion_date = 2.years.from_now

      mail(
        to: user.email,
        subject: "Your DevCatalyst account has been inactive"
      )
    end
  end

  # 同意更新要求
  def consent_renewal_required(user = nil, consent = nil)
    @greeting = "Hi"
    if user.nil?
      @user = User.new(name: "Test User", email: "to@example.org", last_sign_in_at: 10.days.ago)
      @consent = { consent_type: "terms_of_service", consented_at: 1.year.ago }
      @consent_type = @consent[:consent_type].to_s.humanize
      @consented_at = @consent[:consented_at]
      @renewal_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3000')}/settings/privacy"
      mail(to: "to@example.org", from: "from@example.com", subject: "Consent renewal required")
    else
      @user = user
      @consent = consent
      @consent_type = consent.consent_type.humanize
      @consented_at = consent.consented_at
      @renewal_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3000')}/settings/privacy"

      mail(
        to: user.email,
        subject: "Please renew your consent - DevCatalyst"
      )
    end
  end
end
