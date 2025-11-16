require "rails_helper"

RSpec.describe GdprMailer, type: :mailer do
  describe "data_export_ready" do
    let(:mail) { GdprMailer.data_export_ready }

    it "renders the headers" do
      expect(mail.subject).to eq("Data export ready")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

  describe "account_deletion_confirmation" do
    let(:mail) { GdprMailer.account_deletion_confirmation }

    it "renders the headers" do
      expect(mail.subject).to eq("Account deletion confirmation")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

  describe "inactive_account_warning" do
    let(:mail) { GdprMailer.inactive_account_warning }

    it "renders the headers" do
      expect(mail.subject).to eq("Inactive account warning")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

  describe "consent_renewal_required" do
    let(:mail) { GdprMailer.consent_renewal_required }

    it "renders the headers" do
      expect(mail.subject).to eq("Consent renewal required")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

end
