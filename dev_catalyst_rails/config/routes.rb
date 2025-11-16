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

      # AI chat (新しい構造)
      namespace :ai do
        # チャット
        post 'chat', to: 'chat#create'
        
        # ストリーミング
        post 'chat/stream', to: 'stream#create'
        
        # セッション管理
        resources :sessions, only: [:index, :show, :destroy] do
          member do
            patch :archive
          end
        end
      end
      
      # Spec Generator
      resources :specs, only: [:index, :show, :create, :update, :destroy] do
        member do
          post :generate_section
          post :export_markdown
          post :export_pdf
          post :export_notion
          post :start_conversation
          post :respond_to_question
        end
        collection do
          post 'from_session/:session_id', to: 'specs#create_from_session', as: :from_session
        end
      end
      
      # GDPR
      namespace :gdpr do
        get 'export', to: 'gdpr#export_data'
        post 'delete_account', to: 'gdpr#delete_account'
        get 'data_summary', to: 'gdpr#data_summary'
        
        resources :consents, only: [:index, :create] do
          collection do
            delete ':consent_type', to: 'gdpr#revoke_consent'
          end
        end
      end
      
      # 旧エンドポイント（後方互換性のため一時的に保持）
      post 'ai/chat', to: 'ai#chat'
      post 'ai/chat/stream', to: 'ai#chatStream'
      get 'ai/chat_sessions', to: 'ai#chatSessions'
      get 'ai/chat_sessions/:id/messages', to: 'ai#chatSessionMessages'
    end
  end

  # Auth callback routes (for frontend redirects)
  get '/auth/success', to: 'auth#success'
  get '/auth/error', to: 'auth#error'

  # Letter opener web (development only)
  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
  get "health" => "rails/health#show"

  # Root path
  root "rails/health#show"
end
