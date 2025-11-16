# frozen_string_literal: true

module Api
  module V1
    class SpecsController < BaseController
      before_action :ensure_user_authenticated!
      before_action :set_spec,
                    only: [:show, :update, :destroy, :generate_section, :export_markdown, :export_pdf, :export_notion]

      # GET /api/v1/specs
      def index
        specs = current_user.specs.recent_first

        render json: success_response(
          specs.map { |spec| serialize_spec(spec) }
        )
      end

      # GET /api/v1/specs/:id
      def show
        render json: success_response(serialize_spec(@spec, include_sections: true))
      end

      # POST /api/v1/specs
      def create
        spec = current_user.specs.build(spec_params)
        spec.status = :draft
        spec.format = params[:spec][:format]&.to_sym || :markdown

        if spec.save
          # チャットセッションから生成する場合
          if params[:spec][:chat_session_id].present?
            chat_session = current_user.chat_sessions.find_by(id: params[:spec][:chat_session_id])
            generate_from_session(spec, chat_session) if chat_session
          end

          render json: success_response(serialize_spec(spec)), status: :created
        else
          render json: error_response(spec.errors.full_messages.join(", ")), status: :unprocessable_entity
        end
      end

      # POST /api/v1/specs/from_session/:session_id
      def create_from_session
        chat_session = current_user.chat_sessions.find(params[:session_id])

        spec = current_user.specs.create!(
          title: chat_session.title || "Spec from Session ##{chat_session.id}",
          description: "チャットセッションから自動生成",
          chat_session: chat_session,
          status: :generating,
          format: :markdown
        )

        generate_from_session(spec, chat_session)

        render json: success_response(serialize_spec(spec, include_sections: true)), status: :created
      end

      # PATCH /api/v1/specs/:id
      def update
        if @spec.update(spec_params)
          @spec.generate_markdown! if @spec.saved_change_to_attribute?(:title) || @spec.spec_sections.any?(&:saved_changes?)
          render json: success_response(serialize_spec(@spec))
        else
          render json: error_response(@spec.errors.full_messages.join(", ")), status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/specs/:id
      def destroy
        @spec.destroy!
        render json: success_response(message: "Spec deleted successfully")
      end

      # POST /api/v1/specs/:id/generate_section
      def generate_section
        section_type = params[:section_type]&.to_sym
        user_input = params[:user_input]

        return render json: error_response("section_type is required"), status: :bad_request unless section_type

        service = SpecGeneratorService.new(
          user: current_user,
          chat_session: @spec.chat_session,
          fast_api_base_url: fast_api_base_url,
          authorization_token: authorization_token
        )

        section = service.generate_section(@spec, section_type, user_input: user_input)

        render json: success_response(
          section: serialize_section(section),
          spec: serialize_spec(@spec)
        )
      end

      # POST /api/v1/specs/:id/export_markdown
      def export_markdown
        @spec.generate_markdown!
        @spec.update!(exported_at: Time.current, status: :exported)

        render json: success_response(
          markdown: @spec.markdown_content,
          exported_at: @spec.exported_at.iso8601
        )
      end

      # POST /api/v1/specs/:id/export_pdf
      def export_pdf
        @spec.generate_markdown!

        # MarkdownをHTMLに変換
        html_content = markdown_to_html(@spec.markdown_content)

        # PDFを生成（シンプルな実装：HTMLをそのまま返すか、クライアント側でPDF生成）
        # 本番環境では、groverやwicked_pdfなどのgemを使用することを推奨
        render json: success_response(
          html: html_content,
          title: @spec.title,
          exported_at: Time.current.iso8601
        )
      end

      # POST /api/v1/specs/:id/export_notion
      def export_notion
        # Phase 3で実装
        render json: error_response("Notion export is not yet implemented"), status: :not_implemented
      end

      # POST /api/v1/specs/:id/start_conversation
      # 対話形式のSpec生成を開始
      def start_conversation
        @spec.update!(status: :generating) unless @spec.status_generating?

        service = SpecGeneratorService.new(
          user: current_user,
          chat_session: @spec.chat_session,
          fast_api_base_url: fast_api_base_url,
          authorization_token: authorization_token
        )

        result = service.start_conversational_generation(@spec)

        render json: success_response({
                                        question: result[:question],
                                        session_id: result[:session_id],
                                        next_section_type: result[:next_section_type],
                                        spec: serialize_spec(@spec.reload, include_sections: true)
                                      })
      rescue StandardError => e
        Rails.logger.error "SpecsController#start_conversation error: #{e.message}\n#{e.backtrace.join("\n")}"
        render json: error_response("対話の開始に失敗しました: #{e.message}"), status: :internal_server_error
      end

      # POST /api/v1/specs/:id/respond_to_question
      # ユーザーの回答を受け取り、次の質問を生成
      def respond_to_question
        user_response = params[:user_response]
        section_type = params[:section_type]&.to_sym

        return render json: error_response("user_response is required"), status: :bad_request if user_response.blank?

        @spec.update!(status: :generating) unless @spec.status_generating?

        service = SpecGeneratorService.new(
          user: current_user,
          chat_session: @spec.chat_session,
          fast_api_base_url: fast_api_base_url,
          authorization_token: authorization_token
        )

        result = service.process_user_response(@spec, user_response: user_response, section_type: section_type)

        # 完成した場合はstatusを更新
        @spec.update!(status: :completed) if result[:is_complete]

        render json: success_response({
                                        question: result[:question],
                                        spec: serialize_spec(@spec.reload, include_sections: true),
                                        completion_percentage: result[:completion_percentage],
                                        is_complete: result[:is_complete]
                                      })
      rescue StandardError => e
        Rails.logger.error "SpecsController#respond_to_question error: #{e.message}\n#{e.backtrace.join("\n")}"
        render json: error_response("回答の処理に失敗しました: #{e.message}"), status: :internal_server_error
      end

      private

      def markdown_to_html(markdown)
        return "" if markdown.blank?

        html = markdown.dup

        # コードブロックを保護
        code_blocks = {}
        html.gsub!(/```[\s\S]*?```/) do |match|
          id = "CODE_BLOCK_#{code_blocks.size}"
          code_blocks[id] = match
          id
        end

        # 見出し（行単位で処理）
        html = html.split("\n").map do |line|
          case line
          when /^# (.+)$/
            "<h1>#{::Regexp.last_match(1)}</h1>"
          when /^## (.+)$/
            "<h2>#{::Regexp.last_match(1)}</h2>"
          when /^### (.+)$/
            "<h3>#{::Regexp.last_match(1)}</h3>"
          when /^- (.+)$/
            "<li>#{::Regexp.last_match(1)}</li>"
          when /^\* (.+)$/
            "<li>#{::Regexp.last_match(1)}</li>"
          when /^\[ \] (.+)$/
            "<li class=\"task\">☐ #{::Regexp.last_match(1)}</li>"
          when /^\[x\] (.+)$/
            "<li class=\"task completed\">☑ #{::Regexp.last_match(1)}</li>"
          else
            line.strip.empty? ? "" : "<p>#{line}</p>"
          end
        end.join("\n")

        # リストをulでラップ
        html.gsub!(%r{(<li>.*?</li>(?:\n<li>.*?</li>)*)}m) do |match|
          "<ul>#{match}</ul>"
        end

        # コードブロックを復元
        code_blocks.each do |id, code|
          html.gsub!(id, "<pre><code>#{code.gsub(/```[a-z]*\n?/, '').gsub('```', '')}</code></pre>")
        end

        # 空の段落を削除
        html.gsub!("<p></p>", "")
        html.gsub!(%r{<p>\s*</p>}, "")

        html
      end

      def set_spec
        @spec = current_user.specs.find(params[:id])
      end

      def spec_params
        params.expect(spec: [:title, :description, :chat_session_id, :format])
      end

      def generate_from_session(spec, chat_session)
        service = SpecGeneratorService.new(
          user: current_user,
          chat_session: chat_session,
          fast_api_base_url: fast_api_base_url,
          authorization_token: authorization_token
        )

        spec.update!(status: :generating)

        # バックグラウンドで生成（将来的にはJobに移行）
        begin
          service.generate_from_session(spec)
          spec.update!(status: :completed)
        rescue StandardError => e
          Rails.logger.error "Spec generation error: #{e.message}"
          spec.update!(status: :draft)
        end
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

      def fast_api_base_url
        ENV.fetch("FASTAPI_BASE_URL", "http://localhost:8000")
      end

      def authorization_token
        header_token = request.headers["Authorization"]
        return header_token if header_token.present?

        cookie_token = request.cookies["auth_access_token"] ||
                       request.cookies["auth_token"] ||
                       request.cookies["access_token"]

        "Bearer #{cookie_token}" if cookie_token.present?
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
