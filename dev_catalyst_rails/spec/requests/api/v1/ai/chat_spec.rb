# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Ai::ChatController", type: :request do
  let(:user) { create(:user) }
  let(:token) { user.generate_jwt_tokens[:access_token] }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  describe "POST /api/v1/ai/chat" do
    let(:valid_params) do
      {
        chat: {
          messages: [
            { role: "user", content: "Hello, how are you?" }
          ],
          provider: "openai",
          model: "gpt-4o-mini"
        }
      }
    end

    context "with valid parameters" do
      before do
        # Mock AI service response
        allow_any_instance_of(AiChatService).to receive(:sendChatRequest).and_return(
          {
            "message" => "I am doing well, thank you!",
            "provider" => "openai",
            "model" => "gpt-4o-mini",
            "usage" => { "total_tokens" => 20 }
          }
        )
      end

      it "returns success response" do
        post "/api/v1/ai/chat", params: valid_params, headers: headers

        expect(response).to have_http_status(:success)
        json = response.parsed_body
        expect(json["success"]).to be true
        expect(json["data"]).to be_present
      end

      it "creates a chat session" do
        expect do
          post "/api/v1/ai/chat", params: valid_params, headers: headers
        end.to change(ChatSession, :count).by(1)
      end
    end

    context "without authentication" do
      it "returns unauthorized" do
        post "/api/v1/ai/chat", params: valid_params

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "with invalid parameters" do
      let(:invalid_params) do
        {
          chat: {
            messages: [],
            provider: "openai"
          }
        }
      end

      it "returns error response" do
        post "/api/v1/ai/chat", params: invalid_params, headers: headers

        expect(response).to have_http_status(:internal_server_error)
      end
    end
  end
end
