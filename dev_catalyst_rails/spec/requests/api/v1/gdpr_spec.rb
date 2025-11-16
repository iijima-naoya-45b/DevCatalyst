# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::GdprController", type: :request do
  let(:user) { create(:user) }
  let(:token) { user.generate_jwt_tokens[:access_token] }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  describe "GET /api/v1/gdpr/export" do
    it "exports user data" do
      get "/api/v1/gdpr/export", headers: headers

      expect(response).to have_http_status(:success)
      expect(response.headers["Content-Type"]).to include("application/json")
      expect(response.headers["Content-Disposition"]).to include("attachment")
    end

    it "updates last_data_export_at" do
      expect do
        get "/api/v1/gdpr/export", headers: headers
      end.to change { user.reload.last_data_export_at }.from(nil)
    end

    it "requires authentication" do
      get "/api/v1/gdpr/export"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /api/v1/gdpr/delete_account" do
    context "with anonymize deletion type" do
      let(:params) do
        {
          deletion_type: "anonymize",
          reason: "User requested deletion"
        }
      end

      it "initiates account deletion" do
        post "/api/v1/gdpr/delete_account", params: params, headers: headers

        expect(response).to have_http_status(:success)
        json = response.parsed_body
        expect(json["success"]).to be true
        expect(json["deletion_log_id"]).to be_present
      end

      it "creates a deletion log" do
        expect do
          post "/api/v1/gdpr/delete_account", params: params, headers: headers
        end.to change(DataDeletionLog, :count).by(1)
      end

      it "anonymizes user data" do
        post "/api/v1/gdpr/delete_account", params: params, headers: headers

        user.reload
        expect(user.email).to eq("deleted_#{user.id}@example.com")
        expect(user.name).to eq("Deleted User")
        expect(user.deleted_at).to be_present
      end
    end

    it "requires authentication" do
      post "/api/v1/gdpr/delete_account"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/v1/gdpr/consents" do
    before do
      create(:user_consent, user: user, consent_type: :terms_of_service)
      create(:user_consent, user: user, consent_type: :privacy_policy, revoked_at: 1.day.ago)
    end

    it "returns active consents" do
      get "/api/v1/gdpr/consents", headers: headers

      expect(response).to have_http_status(:success)
      json = response.parsed_body
      expect(json["success"]).to be true
      expect(json["data"].size).to eq(1)
    end
  end

  describe "POST /api/v1/gdpr/consents" do
    let(:params) do
      {
        consent_type: "terms_of_service",
        version: "1.0"
      }
    end

    it "creates a new consent" do
      expect do
        post "/api/v1/gdpr/consents", params: params, headers: headers
      end.to change(UserConsent, :count).by(1)

      expect(response).to have_http_status(:success)
    end

    it "records IP address and user agent" do
      post "/api/v1/gdpr/consents", params: params, headers: headers

      consent = user.user_consents.last
      expect(consent.ip_address).to be_present
      expect(consent.user_agent).to be_present
    end
  end

  describe "DELETE /api/v1/gdpr/consents/:consent_type" do
    let!(:consent) { create(:user_consent, user: user, consent_type: :marketing) }

    it "revokes the consent" do
      delete "/api/v1/gdpr/consents/marketing", headers: headers

      expect(response).to have_http_status(:success)
      expect(consent.reload.revoked_at).to be_present
    end
  end

  describe "GET /api/v1/gdpr/data_summary" do
    before do
      create_list(:chat_session, 3, user: user)
      create(:user_consent, user: user)
    end

    it "returns data summary" do
      get "/api/v1/gdpr/data_summary", headers: headers

      expect(response).to have_http_status(:success)
      json = response.parsed_body
      expect(json["data"]["statistics"]["chat_sessions"]).to eq(3)
      expect(json["data"]["statistics"]["consents"]).to eq(1)
    end
  end
end
