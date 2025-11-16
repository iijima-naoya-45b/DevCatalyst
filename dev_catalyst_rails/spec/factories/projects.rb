# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    association :user
    name { "Test Project" }
    created_at { Time.current }
    updated_at { Time.current }
  end
end
