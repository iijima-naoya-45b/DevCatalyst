# frozen_string_literal: true

class ContentLengthValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?
    
    min_length = options[:minimum] || 1
    max_length = options[:maximum] || 10_000
    
    if value.length < min_length
      record.errors.add(attribute, :too_short, count: min_length)
    end
    
    if value.length > max_length
      record.errors.add(attribute, :too_long, count: max_length)
    end
    
    # 空白のみのコンテンツをチェック
    if options[:no_whitespace_only] && value.strip.blank?
      record.errors.add(attribute, :blank_content)
    end
  end
end
