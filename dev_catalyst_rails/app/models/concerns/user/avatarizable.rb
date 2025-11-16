# frozen_string_literal: true

module User
  module Avatarizable
    extend ActiveSupport::Concern

    GRAVATAR_BASE_URL = "https://www.gravatar.com/avatar/"
    DEFAULT_AVATAR_SIZE = 200

    # アバターURL取得
    def avatar_url
      read_attribute(:avatar_url).presence || default_avatar_url
    end

    # デフォルトアバター（Gravatar）
    def default_avatar_url
      gravatar_url(size: DEFAULT_AVATAR_SIZE)
    end

    # Gravatar URL生成
    def gravatar_url(size: DEFAULT_AVATAR_SIZE, default: "identicon")
      hash = Digest::MD5.hexdigest(email.downcase)
      "#{GRAVATAR_BASE_URL}#{hash}?d=#{default}&s=#{size}"
    end

    # アバター更新
    def update_avatar(url)
      update(avatar_url: url)
    end

    # アバター削除（デフォルトに戻す）
    def remove_avatar
      update(avatar_url: nil)
    end

    # アバターの種類判定
    def has_custom_avatar?
      self[:avatar_url].present?
    end

    def using_gravatar?
      !has_custom_avatar?
    end

    def using_oauth_avatar?
      has_custom_avatar? && provider.present?
    end
  end
end
