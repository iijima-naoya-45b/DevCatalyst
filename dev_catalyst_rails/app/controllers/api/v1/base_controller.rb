# frozen_string_literal: true

class Api::V1::BaseController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user_from_token!
  
  respond_to :json

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
end