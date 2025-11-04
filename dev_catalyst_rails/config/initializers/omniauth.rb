# OmniAuth設定
OmniAuth.config.allowed_request_methods = [:post, :get]
OmniAuth.config.silence_get_warning = true

# 開発環境でのCSRF設定
if Rails.env.development?
  OmniAuth.config.test_mode = false
end