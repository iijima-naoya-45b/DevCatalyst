# frozen_string_literal: true

# == Schema Information
#
# Table name: psychological_profiles
#
#  id                   :bigint           not null, primary key
#  user_id              :bigint           not null
#  cognitive_load_level :integer          default(5), not null
#  self_efficacy_score  :integer          default(50), not null
#  bias_awareness       :text             is an Array
#  motivation_factors   :text             is an Array
#  learning_style       :string(50)
#  risk_tolerance       :integer          default(5), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
# Indexes
#
#  index_psychological_profiles_on_user_id                  (user_id) UNIQUE
#  index_psychological_profiles_on_cognitive_load_level     (cognitive_load_level)
#  index_psychological_profiles_on_self_efficacy_score      (self_efficacy_score)
#
# Foreign Keys
#
#  fk_psychological_profiles_user_id  (user_id => users.id)
#

class PsychologicalProfile < ApplicationRecord
  belongs_to :user

  # バリデーション
  validates :cognitive_load_level, inclusion: {
    in: 1..10,
    message: "認知負荷レベルは1から10の間で設定してください"
  }

  validates :self_efficacy_score, inclusion: {
    in: 1..100,
    message: "自己効力感スコアは1から100の間で設定してください"
  }

  validates :risk_tolerance, inclusion: {
    in: 1..10,
    message: "リスク許容度は1から10の間で設定してください"
  }

  validates :learning_style, inclusion: {
    in: ["visual", "auditory", "kinesthetic", "reading_writing", "multimodal"],
    message: "学習スタイルは指定された値から選択してください",
    allow_nil: true
  }

  # スコープ
  scope :high_cognitive_load, -> { where(cognitive_load_level: 7..) }
  scope :low_self_efficacy, -> { where(self_efficacy_score: ..30) }
  scope :high_risk_tolerance, -> { where(risk_tolerance: 7..) }

  # コールバック
  before_save :normalize_arrays
  after_update :log_psychological_changes

  # 認知バイアスの種類
  BIAS_TYPES = [
    "confirmation_bias",
    "anchoring_bias",
    "availability_heuristic",
    "representativeness_heuristic",
    "optimism_bias",
    "overconfidence_bias",
    "loss_aversion",
    "sunk_cost_fallacy"
  ].freeze

  # モチベーション要因の種類
  MOTIVATION_FACTORS = [
    "achievement",
    "autonomy",
    "mastery",
    "purpose",
    "social_recognition",
    "financial_reward",
    "learning_growth",
    "problem_solving",
    "creativity",
    "impact"
  ].freeze

  # 学習スタイルの種類
  LEARNING_STYLES = {
    "visual" => "視覚的学習",
    "auditory" => "聴覚的学習",
    "kinesthetic" => "体感的学習",
    "reading_writing" => "読み書き学習",
    "multimodal" => "複合的学習"
  }.freeze

  # インスタンスメソッド

  # 認知負荷レベルの評価
  def cognitive_load_assessment
    case cognitive_load_level
    when 1..3
      { level: "low", message: "情報処理に余裕があります。より複雑なタスクにも取り組めます。" }
    when 4..6
      { level: "moderate", message: "適度な認知負荷です。バランスの取れた状態です。" }
    when 7..8
      { level: "high", message: "認知負荷が高めです。情報を整理して段階的に進めましょう。" }
    when 9..10
      { level: "overload", message: "認知負荷が過度です。休憩を取り、タスクを分割することをお勧めします。" }
    end
  end

  # 自己効力感の評価
  def self_efficacy_assessment
    case self_efficacy_score
    when 1..25
      { level: "very_low", message: "小さな成功体験を積み重ねて自信を育てましょう。" }
    when 26..50
      { level: "low", message: "段階的な目標設定で達成感を得ることが重要です。" }
    when 51..75
      { level: "moderate", message: "良好な自己効力感です。さらなる挑戦も可能です。" }
    when 76..100
      { level: "high", message: "高い自己効力感を持っています。リーダーシップを発揮できます。" }
    end
  end

  # リスク許容度の評価
  def risk_tolerance_assessment
    case risk_tolerance
    when 1..3
      { level: "conservative", message: "慎重なアプローチを好みます。確実性を重視した計画が適しています。" }
    when 4..6
      { level: "moderate", message: "バランスの取れたリスク管理ができます。" }
    when 7..10
      { level: "aggressive", message: "積極的なリスクテイクが可能です。革新的なアプローチに向いています。" }
    end
  end

  # 認知バイアスの追加
  def add_bias_awareness(bias_type)
    return false unless BIAS_TYPES.include?(bias_type.to_s)

    self.bias_awareness ||= []
    return if bias_awareness.include?(bias_type.to_s)

    self.bias_awareness << bias_type.to_s
    save
  end

  # モチベーション要因の追加
  def add_motivation_factor(factor)
    return false unless MOTIVATION_FACTORS.include?(factor.to_s)

    self.motivation_factors ||= []
    return if motivation_factors.include?(factor.to_s)

    self.motivation_factors << factor.to_s
    save
  end

  # 心理学的推奨事項の生成
  def generate_recommendations
    recommendations = []

    # 認知負荷に基づく推奨
    if cognitive_load_level >= 7
      recommendations << {
        type: "cognitive_load",
        message: "タスクを小さく分割し、一度に一つずつ取り組むことをお勧めします。",
        priority: "high"
      }
    end

    # 自己効力感に基づく推奨
    if self_efficacy_score <= 30
      recommendations << {
        type: "self_efficacy",
        message: "小さな目標を設定し、達成体験を積み重ねることで自信を育てましょう。",
        priority: "high"
      }
    end

    # リスク許容度に基づく推奨
    if risk_tolerance <= 3
      recommendations << {
        type: "risk_management",
        message: "段階的なアプローチで、リスクを最小化しながら進めることをお勧めします。",
        priority: "medium"
      }
    end

    recommendations
  end

  # 学習スタイルに適した提案
  def learning_style_suggestions
    return [] if learning_style.blank?

    case learning_style
    when "visual"
      ["図表やチャートを活用", "マインドマップの作成", "色分けによる整理"]
    when "auditory"
      ["音声での説明", "ディスカッション", "音楽を活用した学習"]
    when "kinesthetic"
      ["実践的な演習", "手を動かす作業", "体験型学習"]
    when "reading_writing"
      ["文書による学習", "ノート作成", "要約の作成"]
    when "multimodal"
      ["複数の方法を組み合わせ", "多様なメディアの活用", "柔軟なアプローチ"]
    else
      []
    end
  end

  # 心理学的状態の総合評価
  def overall_psychological_state
    {
      cognitive_load: cognitive_load_assessment,
      self_efficacy: self_efficacy_assessment,
      risk_tolerance: risk_tolerance_assessment,
      recommendations: generate_recommendations,
      learning_suggestions: learning_style_suggestions
    }
  end

  private

  # 配列フィールドの正規化
  def normalize_arrays
    self.bias_awareness = bias_awareness&.compact&.uniq || []
    self.motivation_factors = motivation_factors&.compact&.uniq || []
  end

  # 心理学的変化のログ記録
  def log_psychological_changes
    return unless saved_changes.any?

    Rails.logger.info "Psychological profile updated for user #{user_id}: #{saved_changes.keys.join(', ')}"
  end
end
