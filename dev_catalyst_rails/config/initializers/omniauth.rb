# OmniAuth設定
OmniAuth.config.allowed_request_methods = [:post, :get]
OmniAuth.config.silence_get_warning = true

# CSRF保護の設定
Rails.application.config.middleware.use OmniAuth::Builder do
  # この設定により、DeviseのOmniAuth設定が優先される
end