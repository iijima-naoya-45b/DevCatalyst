Rails.application.routes.draw do
  # Devise routes with OmniAuth
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  # 開発用OAuth認証ルート
  if Rails.env.development?
    get '/users/auth/developer', to: 'users/omniauth_callbacks#developer_auth'
    get '/users/auth/developer/callback', to: 'users/omniauth_callbacks#developer'
  end

  # API routes
  namespace :api do
    # Authentication (v1 namespace removed to match API spec)
    post 'auth/login', to: 'v1/auth#login'
    post 'auth/register', to: 'v1/auth#register'
    delete 'auth/logout', to: 'v1/auth#logout'
    post 'auth/forgot_password', to: 'v1/auth#forgot_password'
    post 'auth/reset_password', to: 'v1/auth#reset_password'
    post 'auth/verify_token', to: 'v1/auth#verify_token'
    post 'auth/refresh', to: 'v1/auth#refresh_token'
    
    # OAuth authentication
    get 'auth/oauth/:provider', to: 'v1/auth#oauth_redirect'
    get 'auth/oauth/:provider/callback', to: 'v1/auth#oauth_callback'
    
    # Users (keeping v1 namespace for user endpoints)
    namespace :v1 do
      get 'users/me', to: 'users#show'
      put 'users/me', to: 'users#update'
      put 'users/change_password', to: 'users#change_password'
      delete 'users/me', to: 'users#destroy'
    end
  end

  # Auth callback routes (for frontend redirects)
  get '/auth/success', to: 'auth#success'
  get '/auth/error', to: 'auth#error'

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
  get "health" => "rails/health#show"

  # Root path
  root "rails/health#show"
end
