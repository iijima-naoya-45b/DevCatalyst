# frozen_string_literal: true

class Api::V1::BaseController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user_from_token!
  
  respond_to :json
  
  # 統一エラーハンドリング
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
  rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
  rescue_from JWT::DecodeError, JWT::ExpiredSignature, with: :handle_invalid_token
  rescue_from StandardError, with: :handle_internal_error

  private

  def authenticate_user_from_token!
    token = extract_token_from_header
    
    if token.present?
      @current_user = User.from_jwt_token(token)
      
      unless @current_user
        render json: { 
          success: false,
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        }, status: :unauthorized
      end
    else
      render json: { 
        success: false,
        error: 'Authorization token required',
        code: 'MISSING_TOKEN'
      }, status: :unauthorized
    end
  end

  def extract_token_from_header
    headerToken = extract_token_from_authorization_header
    return headerToken if headerToken.present?

    cookieToken = extract_token_from_cookies
    return cookieToken if cookieToken.present?

    paramsToken = params[:token] || params[:access_token]
    return paramsToken if paramsToken.present?

    nil
  end

  def extract_token_from_authorization_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')

    auth_header.split(' ').last
  end

  def extract_token_from_cookies
    cookieCandidates = [
      request.cookies['auth_access_token'],
      request.cookies['auth_token'],
      request.cookies['access_token']
    ].compact

    cookieCandidates.find(&:present?)
  end

  def current_user
    @current_user
  end

  def render_error(message, status = :unprocessable_entity, code = nil)
    render json: { 
      success: false, 
      error: message,
      code: code
    }, status: status
  end

  def render_success(data = {}, message = 'Success')
    render json: { 
      success: true, 
      message: message, 
      data: data 
    }
  end
  
  # エラーハンドリングメソッド
  def handle_not_found(exception)
    render json: ErrorSerializer.new(exception, status: :not_found).as_json, 
           status: :not_found
  end
  
  def handle_validation_error(exception)
    render json: ErrorSerializer.new(exception, status: :unprocessable_entity).as_json,
           status: :unprocessable_entity
  end
  
  def handle_parameter_missing(exception)
    render json: ErrorSerializer.new(exception, status: :bad_request).as_json,
           status: :bad_request
  end
  
  def handle_invalid_token(exception)
    render json: ErrorSerializer.new(exception, status: :unauthorized).as_json,
           status: :unauthorized
  end
  
  def handle_internal_error(exception)
    Rails.logger.error "Internal Server Error: #{exception.class} - #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")
    
    # 本番環境では詳細を隠す
    message = Rails.env.production? ? 'An unexpected error occurred' : exception.message
    
    render json: ErrorSerializer.new(message, status: :internal_server_error).as_json,
           status: :internal_server_error
  end
end