# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # OAuth認証のためにCSRF保護を無効化（APIとして使用）
  protect_from_forgery with: :null_session

  # APIレスポンス用
  respond_to :json
end
