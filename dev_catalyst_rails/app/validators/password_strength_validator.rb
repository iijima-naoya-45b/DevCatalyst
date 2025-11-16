# frozen_string_literal: true

class PasswordStrengthValidator < ActiveModel::EachValidator
  MIN_LENGTH = 8
  MAX_LENGTH = 128
  
  def validate_each(record, attribute, value)
    return if value.blank?
    
    # 長さチェック
    if value.length < MIN_LENGTH
      record.errors.add(attribute, :too_short, count: MIN_LENGTH)
      return
    end
    
    if value.length > MAX_LENGTH
      record.errors.add(attribute, :too_long, count: MAX_LENGTH)
      return
    end
    
    # 強度チェック
    strength_errors = []
    
    strength_errors << :no_uppercase unless value.match?(/[A-Z]/)
    strength_errors << :no_lowercase unless value.match?(/[a-z]/)
    strength_errors << :no_digit unless value.match?(/\d/)
    strength_errors << :no_special_char unless value.match?(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    
    # 少なくとも3つの条件を満たす必要がある
    if strength_errors.size > 1
      record.errors.add(attribute, :weak_password, 
        message: 'must contain at least 3 of: uppercase, lowercase, digit, special character')
    end
    
    # 一般的な弱いパスワードをチェック
    if common_password?(value)
      record.errors.add(attribute, :too_common)
    end
  end
  
  private
  
  def common_password?(password)
    common_passwords = %w[
      password password123 12345678 qwerty abc123
      letmein monkey 1234567890 welcome admin
    ]
    
    common_passwords.include?(password.downcase)
  end
end
