FactoryBot.define do
  factory :data_deletion_log do
    user_id { 1 }
    email { "MyString" }
    deletion_type { "MyString" }
    reason { "MyText" }
    requested_at { "2025-11-15 11:45:20" }
    completed_at { "2025-11-15 11:45:20" }
    status { "MyString" }
    deleted_data_summary { "" }
  end
end
