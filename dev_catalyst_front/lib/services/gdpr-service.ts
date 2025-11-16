import {
  gdprApi,
  type DataSummary,
  type Consent,
  type DeleteAccountRequest,
} from '../api/rails/gdpr';

class GdprService {
  /**
   * データエクスポート
   */
  async exportData(): Promise<void> {
    try {
      await gdprApi.exportData();
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * データサマリー取得
   */
  async getDataSummary(): Promise<DataSummary> {
    try {
      const response = await gdprApi.getDataSummary();
      if (!response.data) {
        throw new Error('GDPR:getDataSummary response.data is undefined');
      }
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * アカウント削除
   */
  async deleteAccount(
    deletionType: 'soft' | 'anonymize' | 'hard',
    reason?: string
  ): Promise<{
    message: string;
    deletion_log_id: number;
  }> {
    try {
      const response = await gdprApi.deleteAccount({ deletion_type: deletionType, reason });
      return {
        message: response.message ?? 'アカウント削除が完了しました。',
        deletion_log_id: (response.data as any)?.deletion_log_id as number,
      };
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 同意一覧取得
   */
  async getConsents(): Promise<Consent[]> {
    try {
      const response = await gdprApi.getConsents();
      return response.data || [];
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 同意作成
   */
  async giveConsent(consentType: string, version: string = '1.0'): Promise<Consent> {
    try {
      const response = await gdprApi.giveConsent(consentType, version);
      if (!response.data) {
        throw new Error('GDPR:giveConsent response.data is undefined');
      }
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 同意取り消し
   */
  async revokeConsent(consentType: string): Promise<void> {
    try {
      await gdprApi.revokeConsent(consentType);
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

    throw new Error(error.message || 'GDPR APIの呼び出しに失敗しました。');
  }
}

export const gdprService = new GdprService();
export type { DataSummary, Consent, DeleteAccountRequest } from '../api/rails/gdpr';
