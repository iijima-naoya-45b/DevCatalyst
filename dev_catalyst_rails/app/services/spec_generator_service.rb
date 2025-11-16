# frozen_string_literal: true

class SpecGeneratorService
  SECTION_TEMPLATES = {
    overview: {
      title: "プロジェクト概要",
      prompts: [
        "プロジェクトの目的は何ですか？",
        "解決したい課題は何ですか？",
        "期待される成果は何ですか？"
      ],
      required: true
    },
    target: {
      title: "ターゲットユーザー",
      prompts: [
        "想定ユーザーは誰ですか？",
        "ユーザーの課題は何ですか？",
        "ユーザーの行動パターンは？"
      ],
      required: true
    },
    features: {
      title: "機能要件",
      prompts: [
        "必須機能は何ですか？",
        "優先順位は？",
        "将来的に追加したい機能は？"
      ],
      required: true
    },
    technical_stack: {
      title: "技術スタック",
      prompts: [
        "使用する技術は？",
        "インフラ構成は？",
        "開発環境は？"
      ],
      required: false
    },
    schedule: {
      title: "スケジュール",
      prompts: [
        "リリース予定日は？",
        "マイルストーンは？",
        "各フェーズの期間は？"
      ],
      required: false
    }
  }.freeze
  
  def initialize(user:, chat_session: nil, fast_api_base_url: nil, authorization_token: nil)
    @user = user
    @chat_session = chat_session
    @fast_api_base_url = fast_api_base_url || ENV.fetch('FASTAPI_BASE_URL', 'http://localhost:8000')
    @authorization_token = authorization_token
  end
  
  # Spec生成専用のChatSessionを作成
  def create_spec_generation_session(spec_title:)
    @chat_session = @user.chat_sessions.create!(
      title: "#{spec_title} - Spec生成",
      metadata: {
        created_via: 'spec_generation',
        spec_generation: true
      },
      last_interacted_at: Time.current
    )
    @chat_session
  end
  
  # 対話形式でSpec生成を開始
  def start_conversational_generation(spec)
    # Spec生成専用セッションを作成（まだ作成されていない場合）
    unless @chat_session
      create_spec_generation_session(spec_title: spec.title)
      spec.update!(chat_session: @chat_session)
    end
    
    # 最初の質問を生成
    first_question = generate_next_question(spec)
    
    # 最初の質問をセッションに記録
    @chat_session.chat_messages.create!(
      sender_role: 'aria',
      content: first_question,
      metadata: {
        message_type: 'spec_generation_question',
        spec_id: spec.id
      }
    )
    
    {
      question: first_question,
      session_id: @chat_session.id,
      next_section_type: determine_next_section_type(spec)
    }
  end
  
  # ユーザーの回答を受け取り、次の質問を生成
  def process_user_response(spec, user_response:, section_type: nil)
    # ユーザーの回答を記録
    @chat_session.chat_messages.create!(
      sender_role: 'user',
      content: user_response,
      metadata: {
        message_type: 'spec_generation_response',
        spec_id: spec.id
      }
    )
    
    # 回答に基づいてセクションを生成または更新
    target_section_type = section_type || determine_next_section_type(spec)
    update_section_from_response(spec, target_section_type, user_response)
    
    # 次の質問を生成
    next_question = generate_next_question(spec, current_section_type: target_section_type)
    
    # 次の質問を記録
    if next_question
      @chat_session.chat_messages.create!(
        sender_role: 'aria',
        content: next_question,
        metadata: {
          message_type: 'spec_generation_question',
          spec_id: spec.id,
          section_type: determine_next_section_type(spec)
        }
      )
    end
    
    # Specの完成度を更新
    spec.update_completion_percentage!
    spec.generate_markdown!
    
    {
      question: next_question,
      spec: spec,
      completion_percentage: spec.completion_percentage,
      is_complete: spec.completion_percentage >= 100
    }
  end
  
  def generate_from_session(spec)
    return unless @chat_session
    
    # 1. セッションの対話内容を解析
    messages = extract_messages(@chat_session)
    
    # 2. AIで構造化
    structured_data = analyze_with_ai(messages)
    
    # 3. セクションごとに生成
    sections = generate_sections(spec, structured_data)
    
    # 4. Markdown変換
    spec.generate_markdown!
    
    # 5. 完成度を更新
    spec.update_completion_percentage!
    
    {
      sections: sections,
      markdown: spec.markdown_content,
      completion: spec.completion_percentage
    }
  end
  
  def generate_section(spec, section_type, user_input: nil)
    template = SECTION_TEMPLATES[section_type.to_sym]
    return nil unless template
    
    # 既存のセクションを取得または作成
    section = spec.spec_sections.find_or_initialize_by(section_type: section_type)
    section.title ||= template[:title]
    section.order ||= calculate_next_order(spec)
    
    # コンテキストを構築
    context = build_context_for_section(spec, section_type, user_input)
    
    # AIでセクション内容を生成
    content = generate_section_content(section_type, template, context)
    
    section.content = content
    section.is_completed = true
    section.ai_generated = true
    section.save!
    
    # Specの完成度を更新
    spec.update_completion_percentage!
    spec.generate_markdown!
    
    section
  end
  
  private
  
  def extract_messages(chat_session)
    chat_session.chat_messages.order(created_at: :asc).map do |message|
      {
        role: message.sender_role == 'aria' ? 'assistant' : 'user',
        content: message.content
      }
    end
  end
  
  def analyze_with_ai(messages)
    prompt = build_analysis_prompt(messages)
    
    # FastAPI経由でAIに問い合わせ
    response = call_fastapi_ai(prompt)
    
    # JSONレスポンスをパース
    parse_ai_response(response)
  rescue StandardError => e
    Rails.logger.error "SpecGeneratorService#analyze_with_ai error: #{e.message}"
    {}
  end
  
  def build_analysis_prompt(messages)
    <<~PROMPT
      以下の対話内容から、プロジェクト仕様書の各セクションに該当する情報を抽出してください。
      
      対話内容:
      #{messages.map { |m| "#{m[:role]}: #{m[:content]}" }.join("\n")}
      
      以下のJSON形式で出力してください:
      {
        "overview": { "purpose": "...", "problem": "...", "outcome": "..." },
        "target": { "users": [...], "problems": [...], "behaviors": [...] },
        "features": { "must_have": [...], "nice_to_have": [...] },
        "technical_stack": { "frontend": [...], "backend": [...], "infrastructure": [...] },
        "schedule": { "milestones": [...], "release_date": "..." }
      }
    PROMPT
  end
  
  def call_fastapi_ai(prompt)
    require 'faraday'
    
    conn = Faraday.new(url: @fast_api_base_url) do |f|
      f.request :json
      f.response :json
    end
    
    headers = {
      'Content-Type' => 'application/json'
    }
    headers['Authorization'] = @authorization_token if @authorization_token.present?
    
    response = conn.post('/api/ai/chat') do |req|
      req.headers = headers
      req.body = {
        messages: [
          { role: 'user', content: prompt }
        ],
        provider: 'openai',
        model: 'gpt-4o-mini',
        temperature: 0.3
      }
    end
    
    if response.success?
      response.body.dig('data', 'assistant_message') || response.body.dig('data', 'message') || ''
    else
      raise "FastAPI error: #{response.status}"
    end
  end
  
  def parse_ai_response(response_text)
    # JSONを抽出（コードブロック内のJSONを探す）
    json_match = response_text.match(/```(?:json)?\s*(\{.*?\})\s*```/m)
    json_text = json_match ? json_match[1] : response_text
    
    JSON.parse(json_text)
  rescue JSON::ParserError
    # JSONパースに失敗した場合は空のハッシュを返す
    {}
  end
  
  def generate_sections(spec, structured_data)
    sections = []
    order = 0
    
    SECTION_TEMPLATES.each do |section_type, template|
      next unless template[:required] || structured_data[section_type.to_s].present?
      
      section_data = structured_data[section_type.to_s] || {}
      content = format_section_content(section_type, section_data)
      
      section = spec.spec_sections.create!(
        section_type: section_type,
        title: template[:title],
        content: content,
        order: order,
        is_completed: content.present?,
        ai_generated: true
      )
      
      sections << section
      order += 1
    end
    
    sections
  end
  
  def format_section_content(section_type, data)
    case section_type
    when :overview
      format_overview(data)
    when :target
      format_target(data)
    when :features
      format_features(data)
    when :technical_stack
      format_technical_stack(data)
    when :schedule
      format_schedule(data)
    else
      data.to_json
    end
  end
  
  def format_overview(data)
    content = []
    content << "### 目的" if data['purpose']
    Array(data['purpose']).each { |p| content << "- #{p}" } if data['purpose']
    content << "\n### 解決する課題" if data['problem']
    Array(data['problem']).each { |p| content << "- #{p}" } if data['problem']
    content << "\n### 期待される成果" if data['outcome']
    Array(data['outcome']).each { |o| content << "- #{o}" } if data['outcome']
    content.join("\n")
  end
  
  def format_target(data)
    content = []
    content << "### ペルソナ" if data['users']
    Array(data['users']).each { |u| content << "- #{u}" } if data['users']
    content << "\n### ユーザーの課題" if data['problems']
    Array(data['problems']).each { |p| content << "- #{p}" } if data['problems']
    content << "\n### 行動パターン" if data['behaviors']
    Array(data['behaviors']).each { |b| content << "- #{b}" } if data['behaviors']
    content.join("\n")
  end
  
  def format_features(data)
    content = []
    content << "### 必須機能 (Must Have)" if data['must_have']
    Array(data['must_have']).each { |f| content << "- [ ] #{f}" } if data['must_have']
    content << "\n### 推奨機能 (Should Have)" if data['should_have']
    Array(data['should_have']).each { |f| content << "- [ ] #{f}" } if data['should_have']
    content << "\n### 将来機能 (Nice to Have)" if data['nice_to_have']
    Array(data['nice_to_have']).each { |f| content << "- [ ] #{f}" } if data['nice_to_have']
    content.join("\n")
  end
  
  def format_technical_stack(data)
    content = []
    content << "### Frontend" if data['frontend']
    Array(data['frontend']).each { |t| content << "- #{t}" } if data['frontend']
    content << "\n### Backend" if data['backend']
    Array(data['backend']).each { |t| content << "- #{t}" } if data['backend']
    content << "\n### Infrastructure" if data['infrastructure']
    Array(data['infrastructure']).each { |t| content << "- #{t}" } if data['infrastructure']
    content.join("\n")
  end
  
  def format_schedule(data)
    content = []
    content << "### マイルストーン" if data['milestones']
    Array(data['milestones']).each { |m| content << "- #{m}" } if data['milestones']
    content << "\n### リリース予定日" if data['release_date']
    content << data['release_date'] if data['release_date']
    content.join("\n")
  end
  
  def generate_section_content(section_type, template, context)
    prompt = build_section_prompt(section_type, template, context)
    
    response = call_fastapi_ai(prompt)
    
    # レスポンスからMarkdown形式のコンテンツを抽出
    extract_markdown_content(response)
  rescue StandardError => e
    Rails.logger.error "SpecGeneratorService#generate_section_content error: #{e.message}"
    "## #{template[:title]}\n\n（生成中にエラーが発生しました）"
  end
  
  def build_section_prompt(section_type, template, context)
    <<~PROMPT
      #{template[:title]}セクションの内容を生成してください。
      
      コンテキスト:
      #{context}
      
      #{template[:prompts].join("\n")}
      
      Markdown形式で、見出しと箇条書きを使って構造化された内容を出力してください。
    PROMPT
  end
  
  def build_context_for_section(spec, section_type, user_input)
    context = []
    
    # 既存のセクション情報
    existing_sections = spec.spec_sections.where.not(section_type: section_type).map do |s|
      "#{s.title}: #{s.content&.truncate(100)}"
    end
    context << "既存のセクション:\n#{existing_sections.join("\n")}" if existing_sections.any?
    
    # チャットセッションの情報
    if @chat_session
      messages = extract_messages(@chat_session)
      context << "対話履歴:\n#{messages.last(5).map { |m| "#{m[:role]}: #{m[:content]}" }.join("\n")}"
    end
    
    # ユーザー入力
    context << "追加情報: #{user_input}" if user_input.present?
    
    context.join("\n\n")
  end
  
  def extract_markdown_content(response_text)
    # コードブロック内のMarkdownを抽出
    markdown_match = response_text.match(/```(?:markdown)?\s*(.*?)\s*```/m)
    return markdown_match[1] if markdown_match
    
    # コードブロックがない場合はそのまま返す
    response_text.strip
  end
  
  def calculate_next_order(spec)
    max_order = spec.spec_sections.maximum(:order) || -1
    max_order + 1
  end
  
  # 次の質問を生成
  def generate_next_question(spec, current_section_type: nil)
    # 次のセクションタイプを決定
    next_section_type = determine_next_section_type(spec)
    return nil unless next_section_type
    
    template = SECTION_TEMPLATES[next_section_type]
    return nil unless template
    
    # 既存のセクション情報を取得
    existing_section = spec.spec_sections.find_by(section_type: next_section_type)
    
    # セクションが既に存在する場合は、より詳細な質問を生成
    if existing_section&.content.present?
      generate_followup_question(next_section_type, template, existing_section.content)
    else
      # 最初の質問を生成
      generate_initial_question(next_section_type, template, spec)
    end
  end
  
  # 次のセクションタイプを決定
  def determine_next_section_type(spec)
    # 必須セクションから順に確認
    required_sections = SECTION_TEMPLATES.select { |_, t| t[:required] }.keys
    
    required_sections.each do |section_type|
      section = spec.spec_sections.find_by(section_type: section_type)
      # セクションが存在しない、または未完成の場合
      return section_type unless section&.is_completed?
    end
    
    # 必須セクションが全て完成したら、オプションセクションを確認
    optional_sections = SECTION_TEMPLATES.select { |_, t| !t[:required] }.keys
    
    optional_sections.each do |section_type|
      section = spec.spec_sections.find_by(section_type: section_type)
      return section_type unless section&.is_completed?
    end
    
    # 全て完成
    nil
  end
  
  # 最初の質問を生成
  def generate_initial_question(section_type, template, spec)
    # 既存のセクション情報をコンテキストとして使用
    context = build_spec_context(spec)
    
    prompt = <<~PROMPT
      #{template[:title]}について質問してください。
      
      プロジェクト: #{spec.title}
      #{context}
      
      以下の観点から、自然な会話形式で1つの質問を生成してください:
      #{template[:prompts].join("\n")}
      
      質問は簡潔で、ユーザーが答えやすい形式にしてください。
      返答は質問文のみを出力してください（説明や補足は不要です）。
    PROMPT
    
    response = call_fastapi_ai(prompt)
    response.strip.gsub(/^質問[:：]\s*/, '').gsub(/^Q[:：]\s*/, '').strip
  rescue StandardError => e
    Rails.logger.error "SpecGeneratorService#generate_initial_question error: #{e.message}"
    "#{template[:title]}について教えてください。#{template[:prompts].first}"
  end
  
  # フォローアップ質問を生成
  def generate_followup_question(section_type, template, existing_content)
    prompt = <<~PROMPT
      既存の情報:
      #{existing_content}
      
      #{template[:title]}について、より詳細な情報を得るためのフォローアップ質問を1つ生成してください。
      
      以下の観点から、まだ聞いていない内容について質問してください:
      #{template[:prompts].join("\n")}
      
      質問は簡潔で、ユーザーが答えやすい形式にしてください。
      返答は質問文のみを出力してください。
    PROMPT
    
    response = call_fastapi_ai(prompt)
    response.strip.gsub(/^質問[:：]\s*/, '').gsub(/^Q[:：]\s*/, '').strip
  rescue StandardError => e
    Rails.logger.error "SpecGeneratorService#generate_followup_question error: #{e.message}"
    "#{template[:title]}について、他に追加したい情報はありますか？"
  end
  
  # 回答に基づいてセクションを更新
  def update_section_from_response(spec, section_type, user_response)
    template = SECTION_TEMPLATES[section_type.to_sym]
    return unless template
    
    section = spec.spec_sections.find_or_initialize_by(section_type: section_type)
    section.title ||= template[:title]
    section.order ||= calculate_next_order(spec)
    
    # 既存のコンテンツと新しい回答を統合
    context = build_context_for_section(spec, section_type, user_response)
    new_content = generate_section_content(section_type, template, context)
    
    # 既存のコンテンツと新しいコンテンツを統合
    if section.content.present?
      section.content = merge_section_content(section.content, new_content)
    else
      section.content = new_content
    end
    
    section.is_completed = true
    section.ai_generated = true
    section.save!
    
    section
  end
  
  # セクションコンテンツを統合
  def merge_section_content(existing_content, new_content)
    # 既存のコンテンツと新しいコンテンツを統合
    # シンプルな実装: 新しいコンテンツを追加
    "#{existing_content}\n\n#{new_content}"
  end
  
  # Spec全体のコンテキストを構築
  def build_spec_context(spec)
    context = []
    context << "タイトル: #{spec.title}"
    context << "説明: #{spec.description}" if spec.description.present?
    
    # 既存のセクション情報
    existing_sections = spec.spec_sections.order(:order).map do |s|
      "#{s.title}: #{s.content&.truncate(100)}"
    end
    context << "既存のセクション:\n#{existing_sections.join("\n")}" if existing_sections.any?
    
    context.join("\n")
  end
end

