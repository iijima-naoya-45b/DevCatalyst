# frozen_string_literal: true

class Users::OmniauthController < ApplicationController
  def redirect
    redirect_to "/users/auth/#{params[:provider]}", allow_other_host: true
  end
end