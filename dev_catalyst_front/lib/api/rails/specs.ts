import { BaseApiClient } from '../client';

const RAILS_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const client = new BaseApiClient(RAILS_API_URL);

export interface Spec {
  id: number;
  title: string;
  description?: string;
  status: 'draft' | 'generating' | 'completed' | 'exported';
  format: 'notion' | 'markdown' | 'pdf' | 'json';
  completion_percentage: number;
  chat_session_id?: number;
  sections?: SpecSection[];
  markdown_content?: string;
  created_at: string;
  updated_at: string;
  exported_at?: string;
  notion_page_id?: string;
}

export interface SpecSection {
  id: number;
  section_type:
    | 'overview'
    | 'target'
    | 'features'
    | 'technical_stack'
    | 'schedule'
    | 'budget'
    | 'risks'
    | 'custom';
  title: string;
  content: string;
  order: number;
  is_completed: boolean;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSpecRequest {
  title: string;
  description?: string;
  chat_session_id?: number;
  format?: 'notion' | 'markdown' | 'pdf' | 'json';
}

export interface GenerateSectionRequest {
  section_type: string;
  user_input?: string;
}

export const specsApi = {
  // Spec一覧取得
  async getSpecs(): Promise<{ success: boolean; data: Spec[] }> {
    const response = await client.get('/api/v1/specs');
    return response as { success: boolean; data: Spec[] };
  },

  // Spec詳細取得
  async getSpec(specId: number): Promise<{ success: boolean; data: Spec }> {
    const response = await client.get(`/api/v1/specs/${specId}`);
    return response as { success: boolean; data: Spec };
  },

  // Spec作成
  async createSpec(request: CreateSpecRequest): Promise<{ success: boolean; data: Spec }> {
    const response = await client.post('/api/v1/specs', { spec: request });
    return response as { success: boolean; data: Spec };
  },

  // セッションからSpec作成
  async createFromSession(sessionId: number): Promise<{ success: boolean; data: Spec }> {
    const response = await client.post(`/api/v1/specs/from_session/${sessionId}`);
    return response as { success: boolean; data: Spec };
  },

  // Spec更新
  async updateSpec(
    specId: number,
    request: Partial<CreateSpecRequest>
  ): Promise<{ success: boolean; data: Spec }> {
    const response = await client.patch(`/api/v1/specs/${specId}`, { spec: request });
    return response as { success: boolean; data: Spec };
  },

  // Spec削除
  async deleteSpec(specId: number): Promise<{ success: boolean }> {
    const response = await client.delete(`/api/v1/specs/${specId}`);
    return response as { success: boolean };
  },

  // セクション生成
  async generateSection(
    specId: number,
    request: GenerateSectionRequest
  ): Promise<{ success: boolean; data: { section: SpecSection; spec: Spec } }> {
    const response = await client.post(`/api/v1/specs/${specId}/generate_section`, request);
    return response as { success: boolean; data: { section: SpecSection; spec: Spec } };
  },

  // Markdownエクスポート
  async exportMarkdown(
    specId: number
  ): Promise<{ success: boolean; data: { markdown: string; exported_at: string } }> {
    const response = await client.post(`/api/v1/specs/${specId}/export_markdown`);
    return response as { success: boolean; data: { markdown: string; exported_at: string } };
  },

  // PDFエクスポート
  async exportPdf(
    specId: number
  ): Promise<{ success: boolean; data: { html: string; title: string; exported_at: string } }> {
    const response = await client.post(`/api/v1/specs/${specId}/export_pdf`);
    return response as {
      success: boolean;
      data: { html: string; title: string; exported_at: string };
    };
  },

  // Notionエクスポート（Phase 3で実装）
  async exportNotion(
    specId: number
  ): Promise<{ success: boolean; data: { notion_page_id: string; notion_url: string } }> {
    const response = await client.post(`/api/v1/specs/${specId}/export_notion`);
    return response as { success: boolean; data: { notion_page_id: string; notion_url: string } };
  },

  // 対話形式Spec生成を開始
  async startConversation(specId: number): Promise<{
    success: boolean;
    data: { question: string; session_id: number; next_section_type: string; spec: Spec };
  }> {
    const response = await client.post(`/api/v1/specs/${specId}/start_conversation`);
    return response as {
      success: boolean;
      data: { question: string; session_id: number; next_section_type: string; spec: Spec };
    };
  },

  // ユーザーの回答を受け取り、次の質問を生成
  async respondToQuestion(
    specId: number,
    userResponse: string,
    sectionType?: string
  ): Promise<{
    success: boolean;
    data: {
      question: string | null;
      spec: Spec;
      completion_percentage: number;
      is_complete: boolean;
    };
  }> {
    const response = await client.post(`/api/v1/specs/${specId}/respond_to_question`, {
      user_response: userResponse,
      section_type: sectionType,
    });
    return response as {
      success: boolean;
      data: {
        question: string | null;
        spec: Spec;
        completion_percentage: number;
        is_complete: boolean;
      };
    };
  },
};
