# frozen_string_literal: true

FactoryBot.define do
  factory :user_consent do
    association :user
    consent_type { :terms_of_service }
    version { "1.0" }
    consented_at { Time.current }
    revoked_at { nil }
    ip_address { "127.0.0.1" }
    user_agent { "Mozilla/5.0 (Test)" }
    
    trait :revoked do
      revoked_at { 1.day.ago }
    end
    
    trait :expired do
      consented_at { 3.years.ago }
    end
    
    trait :privacy_policy do
      consent_type { :privacy_policy }
    end
    
    trait :marketing do
      consent_type { :marketing }
    end
  end
end
