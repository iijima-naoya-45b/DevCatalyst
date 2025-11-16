# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境 - 環境変数から取得
    frontend_url = ENV["FRONTEND_URL"] || "http://localhost:3000"
    # 127.0.0.1版も生成
    frontend_127 = frontend_url.gsub("localhost", "127.0.0.1")
    origins frontend_url, frontend_127

    resource "*",
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             credentials: true,
             expose: ["Authorization"]
  end

  # 本番環境用（環境変数で設定）
  if Rails.env.production?
    allow do
      origins ENV["FRONTEND_URL"] || "https://your-frontend-domain.com"

      resource "*",
               headers: :any,
               methods: [:get, :post, :put, :patch, :delete, :options, :head],
               credentials: true,
               expose: ["Authorization"]
    end
  end
end
