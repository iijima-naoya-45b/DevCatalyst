# frozen_string_literal: true

# セキュリティ設定

# BCryptのコスト設定（セキュリティと性能のバランス）
# 開発環境では低く、本番環境では高く設定
BCrypt::Engine.cost = if Rails.env.production?
                        12 # 本番環境：高セキュリティ
                      else
                        4 # 開発・テスト環境：高速処理
                      end

# セキュリティヘッダーの設定
Rails.application.config.force_ssl = true if Rails.env.production?

# セッションセキュリティ
Rails.application.config.session_options = {
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax
}

# CSRF保護の設定
Rails.application.config.action_controller.default_protect_from_forgery = false # API専用のため無効化

# セキュリティヘッダーの追加
Rails.application.config.middleware.insert_before 0, Rack::Attack if defined?(Rack::Attack)

# Content Security Policy
Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, :https, :data
    policy.img_src     :self, :https, :data
    policy.object_src  :none
    policy.script_src  :self
    policy.style_src   :self, :https, :unsafe_inline
    policy.connect_src :self, :https

    # 開発環境での設定
    if Rails.env.development?
      frontend_url = ENV["FRONTEND_URL"] || "http://localhost:3000"
      frontend_ws_url = frontend_url.gsub(/^http/, "ws")
      policy.connect_src :self, :https, frontend_url, frontend_ws_url
    end
  end

  # CSPレポートの設定
  config.content_security_policy_report_only = false
  config.content_security_policy_nonce_generator = ->(_request) { SecureRandom.base64(16) }
end
