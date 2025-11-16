# frozen_string_literal: true

FactoryBot.define do
  factory :chat_session do
    association :user
    title { "Test Session" }
    last_interacted_at { Time.current }
    archived { false }
    created_at { Time.current }
    updated_at { Time.current }
  end
end
