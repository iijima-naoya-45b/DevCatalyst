// API通信用のユーティリティ関数

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// APIリクエストのベース設定
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10秒
  headers: {
    'Content-Type': 'application/json',
  },
};

// 認証付きAPIリクエスト
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth-token');

  const config: RequestInit = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // 401エラーの場合は認証切れとして処理
    if (response.status === 401) {
      // トークンをクリアしてログインページにリダイレクト
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      window.location.href = '/login';
      throw new Error('認証が無効です');
    }

    return response;
  } catch (error) {
    throw error;
  }
}

// GET リクエスト
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await authenticatedFetch(endpoint, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// POST リクエスト
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  const response = await authenticatedFetch(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// PUT リクエスト
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  const response = await authenticatedFetch(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// DELETE リクエスト
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await authenticatedFetch(endpoint, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ヘルスチェック
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
