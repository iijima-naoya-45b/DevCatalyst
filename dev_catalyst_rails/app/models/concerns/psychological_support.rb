# frozen_string_literal: true

# 心理学的サポート機能を提供するConcern
module PsychologicalSupport
  extend ActiveSupport::Concern

  # 心理学的配慮のエラーメッセージ
  PSYCHOLOGICAL_ERROR_MESSAGES = {
    email: {
      blank: "メールアドレスを入力してください。安全にアカウントを管理するために必要です。",
      invalid: "有効なメールアドレスを入力してください。正しい形式で入力することで、重要な通知を確実に受け取れます。",
      taken: "このメールアドレスは既に使用されています。別のメールアドレスをお試しください。"
    },
    password: {
      blank: "パスワードを入力してください。アカウントの安全性を保つために必要です。",
      too_short: "パスワードは8文字以上で設定してください。長いパスワードほど安全性が向上します。",
      invalid: "パスワードは大文字、小文字、数字を含む必要があります。これにより、アカウントがより安全になります。"
    },
    general: {
      required: "この項目は必須です。正確な情報を入力することで、より良いサービスを提供できます。",
      invalid_format: "入力形式が正しくありません。例を参考に正しい形式で入力してください。"
    }
  }.freeze

  included do
    # 心理学的配慮のバリデーションメッセージを設定
    def self.human_attribute_name(attribute, options = {})
      case attribute.to_sym
      when :email
        "メールアドレス"
      when :password
        "パスワード"
      when :password_confirmation
        "パスワード確認"
      else
        super
      end
    end
  end

  # インスタンスメソッド

  # 心理学的配慮のエラーメッセージ取得
  def get_psychological_error_message(field, error_type)
    PSYCHOLOGICAL_ERROR_MESSAGES.dig(field.to_sym, error_type.to_sym) ||
      PSYCHOLOGICAL_ERROR_MESSAGES.dig(:general, error_type.to_sym) ||
      "入力内容を確認してください。"
  end

  # ユーザーフレンドリーなエラーメッセージの生成
  def friendly_errors
    return {} if errors.empty?

    friendly_messages = {}

    errors.each do |error|
      field = error.attribute
      error_type = case error.type
                   when :blank, :empty
                     :blank
                   when :invalid
                     :invalid
                   when :taken
                     :taken
                   when :too_short
                     :too_short
                   else
                     :invalid_format
                   end

      friendly_messages[field] = get_psychological_error_message(field, error_type)
    end

    friendly_messages
  end

  # 成功メッセージの生成（心理学的配慮）
  def success_message_for_action(action)
    case action.to_sym
    when :create
      "アカウントが正常に作成されました。devCatalystへようこそ！"
    when :update
      "情報が正常に更新されました。変更内容が保存されています。"
    when :destroy
      "アカウントが削除されました。ご利用いただき、ありがとうございました。"
    else
      "操作が正常に完了しました。"
    end
  end

  # 励ましメッセージの生成
  def encouragement_message
    messages = [
      "素晴らしいスタートです！一歩ずつ進んでいきましょう。",
      "順調に進んでいます。この調子で続けてください。",
      "着実に成長しています。小さな積み重ねが大きな成果につながります。",
      "よくできています！継続することで必ず結果が出ます。"
    ]

    messages.sample
  end

  # モチベーション向上メッセージ
  def motivation_boost_message(context = nil)
    case context&.to_sym
    when :login
      "お帰りなさい！今日も素晴らしい一日にしましょう。"
    when :project_creation
      "新しいプロジェクトの開始ですね。ワクワクする挑戦の始まりです！"
    when :milestone_reached
      "マイルストーン達成おめでとうございます！着実に前進していますね。"
    else
      "あなたの努力は必ず実を結びます。一緒に頑張りましょう！"
    end
  end

  # リスク認知管理メッセージ
  def risk_awareness_message(risk_level)
    case risk_level.to_sym
    when :low
      "安全な選択です。確実に進めることができます。"
    when :medium
      "適度なリスクです。慎重に進めれば良い結果が期待できます。"
    when :high
      "チャレンジングな選択ですね。リスクを理解した上で、サポートを活用しながら進めましょう。"
    else
      "どのような選択でも、適切なサポートがあります。"
    end
  end

  # 信頼感創出メッセージ
  def trust_building_message(action)
    case action.to_sym
    when :data_protection
      "あなたの情報は最高レベルのセキュリティで保護されています。"
    when :privacy
      "プライバシーを尊重し、必要な情報のみを安全に管理しています。"
    when :support
      "困ったときはいつでもサポートチームがお手伝いします。"
    else
      "安心してご利用ください。私たちがしっかりとサポートします。"
    end
  end
end
