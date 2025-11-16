import {
  specsApi,
  type Spec,
  type SpecSection,
  type CreateSpecRequest,
  type GenerateSectionRequest,
} from '../api/rails/specs';

class SpecService {
  /**
   * Spec一覧取得
   */
  async getSpecs(): Promise<Spec[]> {
    try {
      const response = await specsApi.getSpecs();
      return response.data || [];
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Spec詳細取得
   */
  async getSpec(specId: number): Promise<Spec> {
    try {
      const response = await specsApi.getSpec(specId);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Spec作成
   */
  async createSpec(request: CreateSpecRequest): Promise<Spec> {
    try {
      const response = await specsApi.createSpec(request);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * セッションからSpec作成
   */
  async createFromSession(sessionId: number): Promise<Spec> {
    try {
      const response = await specsApi.createFromSession(sessionId);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Spec更新
   */
  async updateSpec(specId: number, request: Partial<CreateSpecRequest>): Promise<Spec> {
    try {
      const response = await specsApi.updateSpec(specId, request);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Spec削除
   */
  async deleteSpec(specId: number): Promise<void> {
    try {
      await specsApi.deleteSpec(specId);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * セクション生成
   */
  async generateSection(
    specId: number,
    request: GenerateSectionRequest
  ): Promise<{ section: SpecSection; spec: Spec }> {
    try {
      const response = await specsApi.generateSection(specId, request);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Markdownエクスポート
   */
  async exportMarkdown(specId: number): Promise<{ markdown: string; exported_at: string }> {
    try {
      const response = await specsApi.exportMarkdown(specId);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PDFエクスポート
   */
  async exportPdf(specId: number): Promise<{ html: string; title: string; exported_at: string }> {
    try {
      const response = await specsApi.exportPdf(specId);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 対話形式Spec生成を開始
   */
  async startConversation(
    specId: number
  ): Promise<{ question: string; session_id: number; next_section_type: string; spec: Spec }> {
    try {
      const response = await specsApi.startConversation(specId);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * ユーザーの回答を受け取り、次の質問を生成
   */
  async respondToQuestion(
    specId: number,
    userResponse: string,
    sectionType?: string
  ): Promise<{
    question: string | null;
    spec: Spec;
    completion_percentage: number;
    is_complete: boolean;
  }> {
    try {
      const response = await specsApi.respondToQuestion(specId, userResponse, sectionType);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: any): void {
    if (error.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('認証が必要です。ログインしてください。');
    }

    if (error.status === 403) {
      throw new Error(error.message || 'この操作を実行する権限がありません。');
    }

    if (error.status === 404) {
      throw new Error('Specが見つかりませんでした。');
    }

    throw new Error(error.message || 'Spec APIの呼び出しに失敗しました。');
  }
}

export const specService = new SpecService();
export type {
  Spec,
  SpecSection,
  CreateSpecRequest,
  GenerateSectionRequest,
} from '../api/rails/specs';
