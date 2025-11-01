# データベースシードファイル

# 開発環境でのみ実行
if Rails.env.development?
  puts "🌱 Seeding development database..."

  # 既存データのクリーンアップ
  User.destroy_all
  puts "  Cleaned existing data"

  # 管理者ユーザーの作成
  admin_user = User.create!(
    email: 'admin@devcatalyst.com',
    password: 'AdminPass123!',
    password_confirmation: 'AdminPass123!'
  )
  puts "  ✅ Created admin user: #{admin_user.email}"

  # 管理者の心理学的プロファイルを更新
  admin_user.psychological_profile.update!(
    cognitive_load_level: 3,
    self_efficacy_score: 85,
    risk_tolerance: 8,
    learning_style: 'multimodal',
    bias_awareness: ['confirmation_bias', 'overconfidence_bias'],
    motivation_factors: ['achievement', 'mastery', 'impact']
  )
  puts "  ✅ Updated admin psychological profile"

  # テストユーザーの作成
  test_users = [
    {
      email: 'beginner@example.com',
      password: 'BeginnerPass123!',
      cognitive_load: 7,
      self_efficacy: 35,
      risk_tolerance: 3,
      learning_style: 'visual'
    },
    {
      email: 'intermediate@example.com',
      password: 'IntermediatePass123!',
      cognitive_load: 5,
      self_efficacy: 65,
      risk_tolerance: 6,
      learning_style: 'kinesthetic'
    },
    {
      email: 'advanced@example.com',
      password: 'AdvancedPass123!',
      cognitive_load: 3,
      self_efficacy: 90,
      risk_tolerance: 9,
      learning_style: 'reading_writing'
    }
  ]

  test_users.each do |user_data|
    user = User.create!(
      email: user_data[:email],
      password: user_data[:password],
      password_confirmation: user_data[:password]
    )

    # 心理学的プロファイルの設定
    user.psychological_profile.update!(
      cognitive_load_level: user_data[:cognitive_load],
      self_efficacy_score: user_data[:self_efficacy],
      risk_tolerance: user_data[:risk_tolerance],
      learning_style: user_data[:learning_style],
      bias_awareness: ['confirmation_bias'],
      motivation_factors: ['achievement', 'learning_growth']
    )

    puts "  ✅ Created test user: #{user.email} (#{user.experience_level})"
  end

  puts "🎉 Seeding completed successfully!"
  puts ""
  puts "Test accounts created:"
  puts "  Admin: admin@devcatalyst.com / AdminPass123!"
  puts "  Beginner: beginner@example.com / BeginnerPass123!"
  puts "  Intermediate: intermediate@example.com / IntermediatePass123!"
  puts "  Advanced: advanced@example.com / AdvancedPass123!"

elsif Rails.env.production?
  puts "⚠️  Production environment detected. Skipping seed data creation."
  puts "   Please create users manually or use specific production seeds."
else
  puts "ℹ️  Test environment detected. Seeds not needed for testing."
end