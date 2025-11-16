# frozen_string_literal: true

namespace :oauth do
  desc "Check OAuth configuration"
  task check: :environment do
    puts "=== OAuth Configuration Check ==="
    puts

    # Google OAuth設定
    puts "Google OAuth:"
    google_client_id = ENV.fetch("GOOGLE_CLIENT_ID", nil)
    google_client_secret = ENV.fetch("GOOGLE_CLIENT_SECRET", nil)

    if google_client_id.present? && google_client_id != "your_google_client_id_here"
      puts "  ✅ GOOGLE_CLIENT_ID: #{google_client_id[0..20]}..."
      puts "  ✅ GOOGLE_CLIENT_SECRET: #{google_client_secret.present? ? '[SET]' : '[NOT SET]'}"
    else
      puts "  ❌ GOOGLE_CLIENT_ID: Not configured"
      puts "  ❌ GOOGLE_CLIENT_SECRET: Not configured"
    end

    puts

    # GitHub OAuth設定
    puts "GitHub OAuth:"
    github_client_id = ENV.fetch("GITHUB_CLIENT_ID", nil)
    github_client_secret = ENV.fetch("GITHUB_CLIENT_SECRET", nil)

    if github_client_id.present? && github_client_id != "your_github_client_id_here"
      puts "  ✅ GITHUB_CLIENT_ID: #{github_client_id[0..20]}..."
      puts "  ✅ GITHUB_CLIENT_SECRET: #{github_client_secret.present? ? '[SET]' : '[NOT SET]'}"
    else
      puts "  ❌ GITHUB_CLIENT_ID: Not configured"
      puts "  ❌ GITHUB_CLIENT_SECRET: Not configured"
    end

    puts

    # Devise OmniAuth プロバイダー確認
    puts "Configured OmniAuth providers:"
    Devise.omniauth_providers.each do |provider|
      puts "  - #{provider}"
    end

    puts
    puts "=== Setup Instructions ==="
    puts
    puts "Google OAuth setup:"
    puts "1. Go to https://console.cloud.google.com/"
    puts "2. Create or select a project"
    puts "3. Enable Google+ API"
    puts "4. Go to Credentials → Create OAuth 2.0 Client ID"
    puts "5. Set authorized redirect URIs:"
    puts "   - http://localhost:3001/users/auth/google_oauth2/callback"
    puts "   - http://localhost:3001/api/auth/oauth/google/callback"
    puts "6. Copy Client ID and Client Secret to .env.development"
    puts
  end
end
