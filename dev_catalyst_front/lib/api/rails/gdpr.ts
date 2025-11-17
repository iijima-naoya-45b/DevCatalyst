import { BaseApiClient, type ApiResponse } from '../client';

const RAILS_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
const client = new BaseApiClient(RAILS_API_URL);

export interface DataSummary {
  profile: {
    email: string;
    name: string;
    created_at: string;
  };
  statistics: {
    chat_sessions: number;
    messages: number;
    consents: number;
  };
  last_export: string | null;
}

export interface Consent {
  type: string;
  version: string;
  consented_at: string;
  active: boolean;
  expired: boolean;
}

export interface DeleteAccountRequest {
  deletion_type: 'soft' | 'anonymize' | 'hard';
  reason?: string;
}

export const gdprApi = {
  // データエクスポート
  async exportData(): Promise<void> {
    const token = getToken();
    const response = await fetch(`${RAILS_API_URL}/api/v1/gdpr/export`, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Export failed');
    }

    // ファイルダウンロード
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_data_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  // データサマリー取得
  async getDataSummary(): Promise<ApiResponse<DataSummary>> {
    return client.get('/api/v1/gdpr/data_summary');
  },

  // アカウント削除
  async deleteAccount(
    request: DeleteAccountRequest
  ): Promise<ApiResponse<{ message: string; deletion_log_id: number }>> {
    return client.post('/api/v1/gdpr/delete_account', request);
  },

  // 同意一覧取得
  async getConsents(): Promise<ApiResponse<Consent[]>> {
    return client.get('/api/v1/gdpr/consents');
  },

  // 同意作成
  async giveConsent(consentType: string, version: string): Promise<ApiResponse<Consent>> {
    return client.post('/api/v1/gdpr/consents', {
      consent_type: consentType,
      version,
    });
  },

  // 同意取り消し
  async revokeConsent(consentType: string): Promise<ApiResponse<{ message: string }>> {
    return client.delete(`/api/v1/gdpr/consents/${consentType}`);
  },
};

// Helper function
function getToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token' || name === 'access_token' || name === 'auth_access_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}
