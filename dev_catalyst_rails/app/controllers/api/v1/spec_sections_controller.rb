# frozen_string_literal: true

module Api
  module V1
    class SpecSectionsController < BaseController
      before_action :ensure_user_authenticated!
      before_action :set_spec_section

      # PATCH /api/v1/spec_sections/:id
      def update
        if @spec_section.update(section_params)
          @spec_section.spec.generate_markdown!
          @spec_section.spec.update_completion_percentage!

          render json: success_response({
                                          section: serialize_section(@spec_section),
                                          spec: serialize_spec(@spec_section.spec.reload, include_sections: true)
                                        })
        else
          render json: error_response(@spec_section.errors.full_messages.join(", ")), status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/spec_sections/:id
      def destroy
        spec = @spec_section.spec
        @spec_section.destroy!
        spec.generate_markdown!
        spec.update_completion_percentage!

        render json: success_response({
                                        spec: serialize_spec(spec.reload, include_sections: true)
                                      })
      end

      private

      def set_spec_section
        @spec_section = SpecSection.joins(:spec).where(specs: { user_id: current_user.id }).find(params[:id])
      end

      def section_params
        params.expect(spec_section: [:title, :content, :order, :is_completed])
      end

      def serialize_section(section)
        {
          id: section.id,
          section_type: section.section_type,
          title: section.title,
          content: section.content,
          order: section.order,
          is_completed: section.is_completed,
          ai_generated: section.ai_generated,
          created_at: section.created_at.iso8601,
          updated_at: section.updated_at.iso8601
        }
      end

      def serialize_spec(spec, include_sections: false)
        data = {
          id: spec.id,
          title: spec.title,
          description: spec.description,
          status: spec.status,
          format: spec.format,
          completion_percentage: spec.completion_percentage,
          chat_session_id: spec.chat_session_id,
          created_at: spec.created_at.iso8601,
          updated_at: spec.updated_at.iso8601
        }

        if include_sections
          data[:sections] = spec.spec_sections.ordered.map { |s| serialize_section(s) }
          data[:markdown_content] = spec.markdown_content
        end

        data[:exported_at] = spec.exported_at.iso8601 if spec.exported_at
        data[:notion_page_id] = spec.notion_page_id if spec.notion_page_id

        data
      end

      def ensure_user_authenticated!
        return if current_user.present?

        render json: error_response("Unauthorized"), status: :unauthorized
      end

      def error_response(message, details: nil)
        {
          success: false,
          error: message,
          details: details
        }.compact
      end

      def success_response(data)
        {
          success: true,
          data: data
        }
      end
    end
  end
end
