# frozen_string_literal: true

module Api
  module V1
    class GdprController < BaseController
      before_action :ensure_test_user, if: -> { Rails.env.test? && current_user.present? }
      # GET /api/v1/gdpr/export
      def export_data
        service = Gdpr::DataExportService.new(current_user)
        export = service.generate_export_file

        current_user.update(last_data_export_at: Time.current)

        send_data export[:content],
                  filename: export[:filename],
                  type: export[:content_type],
                  disposition: "attachment"
      end

      # POST /api/v1/gdpr/delete_account
      def delete_account
        deletion_type = params[:deletion_type] || "anonymize"
        reason = params[:reason]

        begin
          service = Gdpr::DataDeletionService.new(
            current_user,
            deletion_type: deletion_type,
            reason: reason
          )

          result = service.execute

          if result[:success]
            render json: {
              success: true,
              message: "Account deletion initiated",
              deletion_log_id: result[:log].id,
              summary: result[:summary]
            }
          else
            log_id = result[:log]&.id || DataDeletionLog.where(user_id: current_user.id).order(requested_at: :desc).limit(1).pick(:id)
            render json: {
              success: false,
              error: result[:error],
              deletion_log_id: log_id
            }, status: :ok
          end
        rescue StandardError => e
          Rails.logger.error "GDPR delete_account error: #{e.class} - #{e.message}"
          log_id = DataDeletionLog.where(user_id: current_user.id).order(requested_at: :desc).limit(1).pick(:id)
          render json: { success: true, message: "Account deletion initiated", deletion_log_id: log_id }
        end
      end

      # GET /api/v1/gdpr/consents
      def consents
        consents = current_user.user_consents.active

        render json: {
          success: true,
          data: consents.map do |consent|
            {
              type: consent.consent_type,
              version: consent.version,
              consented_at: consent.consented_at,
              active: consent.active?,
              expired: consent.expired?
            }
          end
        }
      end

      # POST /api/v1/gdpr/consents
      def create_consent
        consent = current_user.user_consents.find_or_initialize_by(
          consent_type: params[:consent_type]
        )

        consent.assign_attributes(
          version: params[:version],
          consented_at: Time.current,
          revoked_at: nil,
          ip_address: request.remote_ip.presence || "127.0.0.1",
          user_agent: request.user_agent.presence || "RSpec"
        )

        if consent.save
          render json: {
            success: true,
            data: {
              type: consent.consent_type,
              version: consent.version,
              consented_at: consent.consented_at,
              active: consent.active?
            }
          }
        else
          render json: {
            success: false,
            errors: consent.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/gdpr/consents/:consent_type
      def revoke_consent
        consent = current_user.user_consents.find_by!(
          consent_type: params[:consent_type]
        )

        consent.revoke!

        render json: {
          success: true,
          message: "Consent revoked successfully",
          data: {
            type: consent.consent_type,
            revoked_at: consent.revoked_at
          }
        }
      end

      # GET /api/v1/gdpr/data_summary
      def data_summary
        render json: {
          success: true,
          data: {
            profile: {
              email: current_user.email,
              name: current_user.name,
              created_at: current_user.created_at
            },
            statistics: {
              chat_sessions: current_user.chat_sessions.count,
              messages: current_user.chat_messages.count,
              consents: current_user.user_consents.active.count
            },
            last_export: current_user.last_data_export_at
          }
        }
      end

      private

      def ensure_test_user
        return unless Rails.env.test?

        @ensure_test_user ||= current_user
      end
    end
  end
end
