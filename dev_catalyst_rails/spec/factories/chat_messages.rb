# frozen_string_literal: true

FactoryBot.define do
  factory :chat_message do
    association :chat_session
    sender_role { "user" }
    content { "Hello" }
    metadata { { source: "rspec" } }
    created_at { Time.current }
    updated_at { Time.current }
  end
end
