FactoryBot.define do
  factory :spec_section do
    spec { nil }
    section_type { 1 }
    title { "MyString" }
    content { "MyText" }
    order { 1 }
    is_completed { false }
    ai_generated { false }
  end
end
