# frozen_string_literal: true

class EmailFormatValidator < ActiveModel::EachValidator
  EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d-]+(\.[a-z\d-]+)*\.[a-z]+\z/i

  def validate_each(record, attribute, value)
    return if value.blank?

    record.errors.add(attribute, options[:message] || :invalid_email_format) unless value.match?(EMAIL_REGEX)

    # ドメインブロックリストチェック
    return unless blocked_domain?(value)

    record.errors.add(attribute, :domain_not_allowed)
  end

  private

  def blocked_domain?(email)
    return false if email.blank?

    blocked_domains = ENV["BLOCKED_EMAIL_DOMAINS"]&.split(",") || []
    domain = email.split("@").last&.downcase

    blocked_domains.map(&:downcase).include?(domain)
  end
end
