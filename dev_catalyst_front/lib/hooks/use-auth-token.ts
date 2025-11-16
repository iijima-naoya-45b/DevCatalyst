import { useCallback, useEffect, useRef } from 'react';
import { TokenManager, ApiClient } from '@/lib/auth';

// トークンの有効期限チェック（JWTのpayloadをデコード）
function isTokenExpired(token: string): boolean {
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

// トークンリフレッシュ用のカスタムフック
export function useAuthToken() {
  const apiClient = useRef(new ApiClient());
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // トークンをリフレッシュする関数
  const refreshToken = useCallback(async (): Promise<boolean> => {
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
      const response = await apiClient.current.refreshToken();

      if (response.tokens) {
        TokenManager.setTokens(response.tokens.access_token, response.tokens.refresh_token || '');
        return true;
      }
      return false;
    } catch (error) {
      TokenManager.removeToken();
      return false;
    }
  }, []);

  // アクセストークンをチェックして、必要ならリフレッシュ
  const ensureValidToken = useCallback(async (): Promise<boolean> => {
    const accessToken = TokenManager.getAccessToken();

    if (!accessToken) {
      return false;
    }

    // トークンが期限切れまたは期限が近い場合
    if (isTokenExpired(accessToken)) {
      return await refreshToken();
    }

    return true;
  }, [refreshToken]);

  // 定期的なトークンチェック（バックグラウンドで実行）
  const startTokenRefreshTimer = useCallback(() => {
    // 既存のタイマーをクリア
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // 5分ごとにトークンをチェック
    refreshTimeoutRef.current = setTimeout(
      async () => {
        const accessToken = TokenManager.getAccessToken();
        if (accessToken && isTokenExpired(accessToken)) {
          await refreshToken();
        }
        // 次回のチェックをスケジュール
        startTokenRefreshTimer();
      },
      5 * 60 * 1000
    ); // 5分
  }, [refreshToken]);

  // コンポーネントマウント時にタイマーを開始
  useEffect(() => {
    if (typeof window !== 'undefined' && TokenManager.isAuthenticated()) {
      startTokenRefreshTimer();
    }

    // クリーンアップ
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [startTokenRefreshTimer]);

  return {
    refreshToken,
    ensureValidToken,
    isAuthenticated: () => TokenManager.isAuthenticated(),
    getAccessToken: () => TokenManager.getAccessToken(),
    getRefreshToken: () => TokenManager.getRefreshToken(),
  };
}

// ユーティリティ関数：API呼び出し前にトークンを確認
export async function withAuthToken<T>(
  apiCall: () => Promise<T>,
  options: { autoRefresh?: boolean } = { autoRefresh: true }
): Promise<T> {
  if (options.autoRefresh) {
    const accessToken = TokenManager.getAccessToken();

    if (accessToken && isTokenExpired(accessToken)) {
      const apiClient = new ApiClient();
      try {
        await apiClient.refreshToken();
      } catch (error) {
        throw new Error('Authentication expired. Please log in again.');
      }
    }
  }

  return await apiCall();
}
