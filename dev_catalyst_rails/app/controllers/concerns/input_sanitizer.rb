# frozen_string_literal: true

module InputSanitizer
  extend ActiveSupport::Concern

  included do
    before_action :sanitize_params_recursively
  end

  private

  def sanitize_params_recursively
    return if params.blank?

    sanitize_hash(params)
  end

  def sanitize_hash(hash)
    hash.each do |key, value|
      case value
      when String
        hash[key] = sanitize_string(value)
      when Hash
        sanitize_hash(value)
      when ActionController::Parameters
        sanitize_hash(value)
      when Array
        hash[key] = value.map { |v| sanitize_value(v) }
      end
    end
  end

  def sanitize_value(value)
    case value
    when String
      sanitize_string(value)
    when Hash
      sanitize_hash(value)
      value
    when ActionController::Parameters
      sanitize_hash(value)
      value
    else
      value
    end
  end

  def sanitize_string(str)
    return str if str.blank?

    # XSS対策: HTMLタグを除去（特定のエンドポイントを除く）
    if should_sanitize_html?
      ActionController::Base.helpers.sanitize(str, tags: [], attributes: [])
    else
      str
    end
  end

  def should_sanitize_html?
    # チャットメッセージなど、HTMLを許可する必要があるエンドポイントを除外
    excluded_paths = [
      "/api/v1/ai/chat",
      "/api/v1/ai/chat/stream"
    ]

    excluded_paths.none? { |path| request.path.start_with?(path) }
  end
end
