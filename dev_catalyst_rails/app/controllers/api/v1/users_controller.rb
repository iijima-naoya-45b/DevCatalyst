# frozen_string_literal: true

module Api
  module V1
    class UsersController < Api::V1::BaseController
      # GET /api/v1/users/me
      def show
        render json: {
          success: true,
          user: current_user.as_json
        }
      end

      # PUT /api/v1/users/me
      def update
        if current_user.update(user_params)
          render json: {
            success: true,
            message: "User updated successfully",
            user: current_user.as_json
          }
        else
          render json: {
            success: false,
            error: "Update failed",
            errors: current_user.errors.full_messages,
            code: "UPDATE_FAILED"
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/users/change_password
      def change_password
        if current_user.valid_password?(change_password_params[:current_password])
          if current_user.update(
            password: change_password_params[:new_password],
            password_confirmation: change_password_params[:password_confirmation]
          )
            render json: {
              success: true,
              message: "Password changed successfully"
            }
          else
            render json: {
              success: false,
              error: "Password change failed",
              errors: current_user.errors.full_messages,
              code: "PASSWORD_CHANGE_FAILED"
            }, status: :unprocessable_entity
          end
        else
          render json: {
            success: false,
            error: "Current password is incorrect",
            code: "INVALID_CURRENT_PASSWORD"
          }, status: :unauthorized
        end
      end

      # DELETE /api/v1/users/me
      def destroy
        if current_user.valid_password?(destroy_params[:password])
          current_user.destroy

          render json: {
            success: true,
            message: "Account deleted successfully"
          }
        else
          render json: {
            success: false,
            error: "Password is incorrect",
            code: "INVALID_PASSWORD"
          }, status: :unauthorized
        end
      end

      private

      def user_params
        params.expect(user: [:name, :email])
      end

      def change_password_params
        params.expect(user: [:current_password, :new_password, :password_confirmation])
      end

      def destroy_params
        params.expect(user: [:password])
      end
    end
  end
end
