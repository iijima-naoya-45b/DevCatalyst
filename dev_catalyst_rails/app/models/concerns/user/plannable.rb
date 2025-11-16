# frozen_string_literal: true

module User::Plannable
  extend ActiveSupport::Concern

    # プラン定義
    PLANS = {
      free: {
        name: "Free",
        price: 0,
        features: {
          chat_sessions_per_month: 50,
          messages_per_session: 20,
          ai_models: ["gpt-4o-mini"],
          support: "community"
        }
      },
      standard: {
        name: "Standard",
        price: 9.99,
        features: {
          chat_sessions_per_month: 500,
          messages_per_session: 100,
          ai_models: ["gpt-4o-mini", "gpt-4o", "claude-3-haiku-20240307"],
          support: "email"
        }
      },
      premium: {
        name: "Premium",
        price: 29.99,
        features: {
          chat_sessions_per_month: Float::INFINITY,
          messages_per_session: Float::INFINITY,
          ai_models: ["gpt-4o-mini", "gpt-4o", "claude-3-haiku-20240307", "claude-3-sonnet-20240229"],
          support: "priority"
        }
      }
    }.freeze

    included do
      enum :plan, { free: 0, standard: 1, premium: 2 }

      # Scopes
      scope :with_plan, ->(plan_name) { where(plan: plan_name) if plan_name.present? }
    end

    # プラン情報取得
    def plan_info
      PLANS[plan.to_sym]
    end

    # プラン名
    def plan_name
      plan_info[:name]
    end

    # プラン価格
    def plan_price
      plan_info[:price]
    end

    # プラン機能
    def plan_features
      plan_info[:features]
    end

    # プランチェック
    def free_plan?
      plan == "free"
    end

    def standard_plan?
      plan == "standard"
    end

    def premium_plan?
      plan == "premium"
    end

    # 機能アクセス権限チェック
    def can_access_feature?(feature)
      case feature
      when :basic_features
        true
      when :advanced_features
        standard_plan? || premium_plan?
      when :premium_features
        premium_plan?
      else
        false
      end
    end

    # AIモデルアクセス権限
    def can_use_model?(model_name)
      plan_features[:ai_models].include?(model_name)
    end

    # 使用制限チェック
    def within_chat_session_limit?
      return true if premium_plan?

      monthly_sessions_count < plan_features[:chat_sessions_per_month]
    end

    def within_message_limit?(session)
      return true if premium_plan?

      session.chat_messages.count < plan_features[:messages_per_session]
    end

    # 今月のセッション数
    def monthly_sessions_count
      chat_sessions.where(created_at: Time.current.beginning_of_month..).count
    end

    # プランアップグレード
    def upgrade_to(new_plan)
      return false unless can_upgrade_to?(new_plan)

      update(plan: new_plan)
    end

    def can_upgrade_to?(new_plan)
      new_plan_index = self.class.plans[new_plan.to_s]
      current_plan_index = self.class.plans[plan]

      new_plan_index && new_plan_index > current_plan_index
    end
end
