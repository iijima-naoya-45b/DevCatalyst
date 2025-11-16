import { TokenManager, ApiClient } from '@/lib/auth';

// トークンの有効期限チェック（JWTのpayloadをデコード）
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // ミリ秒に変換
    const now = Date.now();
    // 有効期限の1分前になったら期限切れとみなす
    return exp - now < 60 * 1000;
  } catch (error) {
    return true;
  }
}

// トークンをリフレッシュする（どこからでも使える）
export async function refreshAuthToken(): Promise<boolean> {
  try {
    const refreshTokenValue = TokenManager.getRefreshToken();

    if (!refreshTokenValue) {
      return false;
    }

    // リフレッシュトークンも期限切れかチェック
    if (isTokenExpired(refreshTokenValue)) {
      TokenManager.removeToken();
      return false;
    }
    const apiClient = new ApiClient();
    const response = await apiClient.refreshToken();

    if (response.tokens) {
      TokenManager.setTokens(response.tokens.access_token, response.tokens.refresh_token || '');
      return true;
    }
    return false;
  } catch (error) {
    TokenManager.removeToken();
    return false;
  }
}

// アクセストークンをチェックして、必要ならリフレッシュ
export async function ensureValidAuthToken(): Promise<boolean> {
  const accessToken = TokenManager.getAccessToken();

  if (!accessToken) {
    return false;
  }

  // トークンが期限切れまたは期限が近い場合
  if (isTokenExpired(accessToken)) {
    return await refreshAuthToken();
  }

  return true;
}

// API呼び出し前にトークンを確認（ユーティリティ関数）
export async function withAuthToken<T>(
  apiCall: () => Promise<T>,
  options: { autoRefresh?: boolean } = { autoRefresh: true }
): Promise<T> {
  if (options.autoRefresh) {
    const accessToken = TokenManager.getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated. Please log in.');
    }

    if (isTokenExpired(accessToken)) {
      const refreshed = await refreshAuthToken();
      if (!refreshed) {
        throw new Error('Authentication expired. Please log in again.');
      }
    }
  }

  return await apiCall();
}

// トークンの残り時間を取得（秒単位）
export function getTokenTimeRemaining(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((exp - now) / 1000));
  } catch (error) {
    return 0;
  }
}

// トークン情報を取得
export function getTokenInfo(token: string): {
  userId?: number;
  email?: string;
  type?: string;
  exp?: number;
  timeRemaining?: number;
} {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.user_id,
      email: payload.email,
      type: payload.type,
      exp: payload.exp,
      timeRemaining: getTokenTimeRemaining(token),
    };
  } catch (error) {
    return {};
  }
}
