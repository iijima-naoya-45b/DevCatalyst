# Redis設定

# Redis接続設定
redis_config = {
  url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0'),
  timeout: 5,
  reconnect_attempts: 3,
  reconnect_delay: 0.5,
  reconnect_delay_max: 5.0,
  inherit_socket: false
}

# Redis接続の初期化
begin
  Redis.current = Redis.new(redis_config)
  
  # 接続テスト
  Redis.current.ping
  Rails.logger.info "Redis connection established successfully"
rescue Redis::CannotConnectError => e
  Rails.logger.error "Failed to connect to Redis: #{e.message}"
  # 開発環境では警告のみ、本番環境ではエラーを発生
  raise e if Rails.env.production?
end

# Sidekiq設定（バックグラウンドジョブ用）
if defined?(Sidekiq)
  Sidekiq.configure_server do |config|
    config.redis = redis_config
    
    # サーバー側の設定
    config.concurrency = ENV.fetch('SIDEKIQ_CONCURRENCY', 5).to_i
    
    # デッドジョブの保持期間
    config.death_timeout = 1.week
  end

  Sidekiq.configure_client do |config|
    config.redis = redis_config
  end
end

# キャッシュストアの設定
Rails.application.configure do
  config.cache_store = :redis_cache_store, {
    url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1'),
    expires_in: 1.hour,
    namespace: 'dev_catalyst_cache',
    compress: true,
    compression_threshold: 1024, # 1KB以上で圧縮
    pool_size: ENV.fetch('RAILS_MAX_THREADS', 5).to_i,
    pool_timeout: 5
  }
end

# セッションストアの設定
Rails.application.config.session_store :redis_session_store, {
  key: '_dev_catalyst_session',
  redis: {
    url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/2'),
    expire_after: 2.weeks,
    key_prefix: 'dev_catalyst:session:',
    pool_size: ENV.fetch('RAILS_MAX_THREADS', 5).to_i,
    pool_timeout: 5
  },
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax
}