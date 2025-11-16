# Preview all emails at http://localhost:3000/rails/mailers/gdpr_mailer
class GdprMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/data_export_ready
  def data_export_ready
    GdprMailer.data_export_ready
  end

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/account_deletion_confirmation
  def account_deletion_confirmation
    GdprMailer.account_deletion_confirmation
  end

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/inactive_account_warning
  def inactive_account_warning
    GdprMailer.inactive_account_warning
  end

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/consent_renewal_required
  def consent_renewal_required
    GdprMailer.consent_renewal_required
  end

end
