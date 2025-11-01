# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email      (email) UNIQUE
#  index_users_on_created_at (created_at)
#

class User < ApplicationRecord
  include PsychologicalSupport
  
  has_secure_password

  # アソシエーション
  has_many :refresh_tokens, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_one :psychological_profile, dependent: :destroy
  has_one :skill_profile, dependent: :destroy

  # バリデーション
  validates :email, presence: true, 
                   uniqueness: { case_sensitive: false },
                   format: { with: URI::MailTo::EMAIL_REGEXP, message: "有効なメールアドレスを入力してください" }
  
  validates :password, length: { minimum: 8, message: "パスワードは8文字以上で入力してください" },
                      format: { 
                        with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "パスワードは大文字、小文字、数字を含む必要があります"
                      },
                      if: :password_required?

  # コールバック
  before_save :normalize_email
  after_create :create_psychological_profile

  # スコープ
  scope :recent, -> { order(created_at: :desc) }
  scope :with_active_subscriptions, -> { joins(:subscriptions).where(subscriptions: { status: 'active' }) }

  # インスタンスメソッド
  
  # 心理学的プロファイルの更新
  def update_psychological_state(state_data)
    profile = psychological_profile || build_psychological_profile
    profile.update!(state_data)
  end

  # アクティブなサブスクリプションの確認
  def has_active_subscription?
    subscriptions.where(status: 'active').exists?
  end

  # ユーザーの経験レベル取得
  def experience_level
    skill_profile&.experience_level || 'beginner'
  end

  # 認知負荷レベル取得
  def cognitive_load_level
    psychological_profile&.cognitive_load_level || 5
  end

  # 自己効力感スコア取得
  def self_efficacy_score
    psychological_profile&.self_efficacy_score || 50
  end

  # プロジェクト数によるユーザーレベル判定
  def user_level
    case projects.count
    when 0
      'newcomer'
    when 1..3
      'beginner'
    when 4..10
      'intermediate'
    else
      'advanced'
    end
  end

  # 心理学的安心感を配慮したエラーメッセージ
  def friendly_error_message(error_type)
    case error_type
    when :authentication_failed
      "ログイン情報が正しくありません。もう一度お試しください。"
    when :account_locked
      "セキュリティのため一時的にアカウントがロックされています。しばらく待ってから再度お試しください。"
    when :password_reset_required
      "安全のためパスワードの更新が必要です。新しいパスワードを設定してください。"
    else
      "問題が発生しました。サポートチームがお手伝いします。"
    end
  end

  private

  # メールアドレスの正規化
  def normalize_email
    self.email = email.strip.downcase if email.present?
  end

  # 心理学的プロファイルの初期作成
  def create_psychological_profile
    PsychologicalProfile.create!(
      user: self,
      cognitive_load_level: 5,
      self_efficacy_score: 50,
      risk_tolerance: 5,
      learning_style: 'visual'
    )
  end

  # パスワード必須チェック
  def password_required?
    new_record? || password.present?
  end
end