# frozen_string_literal: true

class ContentLengthValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    min_length = options[:minimum] || 1
    max_length = options[:maximum] || 10_000

    record.errors.add(attribute, :too_short, count: min_length) if value.length < min_length

    record.errors.add(attribute, :too_long, count: max_length) if value.length > max_length

    # 空白のみのコンテンツをチェック
    return unless options[:no_whitespace_only] && value.strip.blank?

    record.errors.add(attribute, :blank_content)
  end
end
