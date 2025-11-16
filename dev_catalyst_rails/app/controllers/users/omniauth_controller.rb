# frozen_string_literal: true

module Users
  class OmniauthController < ApplicationController
    def redirect
      redirect_to "/users/auth/#{params[:provider]}", allow_other_host: true
    end
  end
end
