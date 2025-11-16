require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module DevCatalystRails
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # OAuth認証のためにセッションとCookieを有効化
    # config.api_only = true

    # タイムゾーン設定
    config.time_zone = 'UTC'

    # CORS設定は config/initializers/cors.rb で行う

    # セッション設定（OAuth認証のために有効化）
    config.session_store :cookie_store, key: '_dev_catalyst_session'

    # キャッシュ設定（開発環境ではメモリキャッシュを使用）
    if Rails.env.development?
      config.cache_store = :memory_store
    else
      config.cache_store = :redis_cache_store, {
        url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1'),
        expires_in: 1.hour
      }
    end

    # OAuth認証に必要なミドルウェアを追加
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: '_dev_catalyst_session'
    config.middleware.use ActionDispatch::Flash
    
    # Rate limiting
    config.middleware.use Rack::Attack

    # 自動読み込みパス
    config.autoload_paths += %W(#{config.root}/app/services)
    config.autoload_paths += %W(#{config.root}/app/serializers)
  end
end
