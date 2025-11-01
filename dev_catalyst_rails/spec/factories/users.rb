FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "ValidPass123" }
    password_confirmation { "ValidPass123" }

    # 心理学的プロファイルも一緒に作成
    after(:create) do |user|
      # コールバックで自動作成されるが、明示的に設定
      user.psychological_profile ||= create(:psychological_profile, user: user)
    end

    trait :admin do
      email { "admin@devcatalyst.com" }
      
      after(:create) do |user|
        user.psychological_profile.update!(
          cognitive_load_level: 3,
          self_efficacy_score: 85,
          risk_tolerance: 8,
          learning_style: 'multimodal'
        )
      end
    end

    trait :beginner do
      after(:create) do |user|
        user.psychological_profile.update!(
          cognitive_load_level: 7,
          self_efficacy_score: 35,
          risk_tolerance: 3,
          learning_style: 'visual'
        )
      end
    end

    trait :intermediate do
      after(:create) do |user|
        user.psychological_profile.update!(
          cognitive_load_level: 5,
          self_efficacy_score: 65,
          risk_tolerance: 6,
          learning_style: 'kinesthetic'
        )
      end
    end

    trait :advanced do
      after(:create) do |user|
        user.psychological_profile.update!(
          cognitive_load_level: 3,
          self_efficacy_score: 90,
          risk_tolerance: 9,
          learning_style: 'reading_writing'
        )
      end
    end

    trait :with_projects do
      after(:create) do |user|
        create_list(:project, 3, user: user)
      end
    end
  end
end