# frozen_string_literal: true

class GdprMailer < ApplicationMailer
  default from: ENV.fetch('MAILER_FROM', 'noreply@devcatalyst.com')
  
  # データエクスポート完了通知
  def data_export_ready(user, download_url)
    @user = user
    @download_url = download_url
    @expires_at = 7.days.from_now
    
    mail(
      to: user.email,
      subject: 'Your data export is ready - DevCatalyst'
    )
  end
  
  # アカウント削除確認
  def account_deletion_confirmation(user, deletion_log)
    @user = user
    @deletion_log = deletion_log
    @deletion_type = deletion_log.deletion_type
    @deleted_at = deletion_log.completed_at || Time.current
    
    mail(
      to: user.email,
      subject: 'Account deletion confirmation - DevCatalyst'
    )
  end
  
  # 非アクティブアカウント警告
  def inactive_account_warning(user)
    @user = user
    @last_sign_in = user.last_sign_in_at
    @days_inactive = ((Time.current - user.last_sign_in_at) / 1.day).to_i
    @deletion_date = 2.years.from_now
    
    mail(
      to: user.email,
      subject: 'Your DevCatalyst account has been inactive'
    )
  end
  
  # 同意更新要求
  def consent_renewal_required(user, consent)
    @user = user
    @consent = consent
    @consent_type = consent.consent_type.humanize
    @consented_at = consent.consented_at
    @renewal_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3000')}/settings/privacy"
    
    mail(
      to: user.email,
      subject: 'Please renew your consent - DevCatalyst'
    )
  end
end
