# == Schema Information
#
# Table name: refresh_tokens
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  token_hash :string           not null
#  expires_at :datetime         not null
#  is_revoked :boolean          default(false), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_refresh_tokens_on_user_id     (user_id)
#  index_refresh_tokens_on_token_hash  (token_hash)
#  index_refresh_tokens_on_expires_at  (expires_at)
#  index_refresh_tokens_on_is_revoked  (is_revoked)
#
# Foreign Keys
#
#  fk_refresh_tokens_user_id  (user_id => users.id)
#

class RefreshToken < ApplicationRecord
  belongs_to :user

  # バリデーション
  validates :token_hash, presence: true, uniqueness: true
  validates :expires_at, presence: true

  # スコープ
  scope :active, -> { where(is_revoked: false) }
  scope :expired, -> { where('expires_at < ?', Time.current) }
  scope :valid, -> { active.where('expires_at > ?', Time.current) }

  # コールバック
  before_create :set_expiration_time

  # クラスメソッド

  # 新しいリフレッシュトークンの生成
  def self.generate_for_user(user)
    # 既存のアクティブなトークンを無効化
    user.refresh_tokens.active.update_all(is_revoked: true)
    
    # 新しいトークンを生成
    raw_token = SecureRandom.hex(32)
    token_hash = Digest::SHA256.hexdigest(raw_token)
    
    refresh_token = create!(
      user: user,
      token_hash: token_hash
    )
    
    # 生のトークンを返す（ハッシュ化前）
    [refresh_token, raw_token]
  end

  # トークンの検証
  def self.find_by_token(raw_token)
    return nil if raw_token.blank?
    
    token_hash = Digest::SHA256.hexdigest(raw_token)
    valid.find_by(token_hash: token_hash)
  end

  # 期限切れトークンのクリーンアップ
  def self.cleanup_expired
    expired.delete_all
  end

  # インスタンスメソッド

  # トークンの無効化
  def revoke!
    update!(is_revoked: true)
  end

  # トークンが有効かチェック
  def valid?
    !is_revoked && expires_at > Time.current
  end

  # トークンが期限切れかチェック
  def expired?
    expires_at <= Time.current
  end

  # 残り有効期間（秒）
  def remaining_lifetime
    return 0 if expired?
    (expires_at - Time.current).to_i
  end

  # 心理学的配慮：ユーザーフレンドリーな期限表示
  def friendly_expiration_message
    if expired?
      "セキュリティのため、セッションの有効期限が切れました。再度ログインしてください。"
    elsif remaining_lifetime < 1.hour
      "セッションの有効期限が近づいています。作業内容を保存することをお勧めします。"
    else
      "セッションは安全に管理されています。"
    end
  end

  private

  # 有効期限の設定（デフォルト2週間）
  def set_expiration_time
    self.expires_at ||= 2.weeks.from_now
  end
end