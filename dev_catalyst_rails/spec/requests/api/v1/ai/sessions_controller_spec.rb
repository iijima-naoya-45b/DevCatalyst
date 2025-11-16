# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Ai::SessionsController", type: :request do
  let(:user) { create(:user) }

  before do
    sign_in user if respond_to?(:sign_in)
  end

  describe "GET /api/v1/ai/sessions" do
    it "returns an array (not wrapped) with ISO8601 dates" do
      session = user.chat_sessions.create!(last_interacted_at: Time.current, archived: false)
      get "/api/v1/ai/sessions", headers: { "ACCEPT" => "application/json" }
      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json).to be_an(Array)
      s = json.first
      expect(s["id"]).to eq(session.id)
      expect { Time.iso8601(s["last_interacted_at"]) }.not_to raise_error
      expect { Time.iso8601(s["created_at"]) }.not_to raise_error
    end
  end

  describe "DELETE /api/v1/ai/sessions/:id" do
    it "deletes a session and returns success json" do
      session = user.chat_sessions.create!(last_interacted_at: Time.current, archived: false)
      delete "/api/v1/ai/sessions/#{session.id}", headers: { "ACCEPT" => "application/json" }
      expect(response).to have_http_status(:ok)
      body = response.parsed_body
      expect(body["success"]).to eq(true)
      expect(ChatSession.where(id: session.id)).to be_empty
    end
  end
end
