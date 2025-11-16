# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/gdpr_mailer
class GdprMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/data_export_ready
  delegate :data_export_ready, to: :GdprMailer

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/account_deletion_confirmation
  delegate :account_deletion_confirmation, to: :GdprMailer

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/inactive_account_warning
  delegate :inactive_account_warning, to: :GdprMailer

  # Preview this email at http://localhost:3000/rails/mailers/gdpr_mailer/consent_renewal_required
  delegate :consent_renewal_required, to: :GdprMailer
end
