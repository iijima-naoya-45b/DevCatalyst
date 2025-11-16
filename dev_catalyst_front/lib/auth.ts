// OAuth + JWT + Devise認証関連のユーティリティ
import type { AuthResponse, User } from '@/lib/types/auth';
import type {
    ChangePasswordData,
    ForgotPasswordData,
    LoginCredentials,
    RegisterCredentials,
    ResetPasswordData,
} from '@/lib/types/credentials';

// OAuth プロバイダーの設定
export const OAUTH_PROVIDERS = {
    google: {
        name: 'Google',
        icon: '🔍',
        color: 'bg-red-500 hover:bg-red-600'
    },
    github: {
        name: 'GitHub',
        icon: '🐙',
        color: 'bg-gray-800 hover:bg-gray-900'
    },
    developer: {
        name: 'Developer (テスト用)',
        icon: '🔧',
        color: 'bg-blue-500 hover:bg-blue-600'
    }
} as const;

export type OAuthProvider = keyof typeof OAUTH_PROVIDERS;

// OAuth認証URL生成
export function getOAuthUrl(provider: OAuthProvider): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Deviseが生成するプロバイダー名に合わせる
    let providerPath: string = provider;
    if (provider === 'google') {
        providerPath = 'google_oauth2';
    }
    return `${baseUrl}/users/auth/${providerPath}`;
}

// Cookie管理ヘルパー
type CookieOptions = {
    days?: number;
    path?: string;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
};

export class CookieManager {
    static setCookie(name: string, value: string, days?: number): void;
    static setCookie(name: string, value: string, options: CookieOptions): void;
    static setCookie(name: string, value: string, arg: number | CookieOptions = 7): void {
        if (typeof window === 'undefined') return;

        const options: CookieOptions = typeof arg === 'number' ? { days: arg } : arg;
        const days = options.days ?? 7;
        const path = options.path ?? '/';
        const sameSite = options.sameSite ?? 'Lax';
        const secure = options.secure ?? false;

        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        const expiresStr = `expires=${expires.toUTCString()}`;
        const secureStr = secure ? ';Secure' : '';

        document.cookie = `${name}=${encodeURIComponent(value)};${expiresStr};path=${path};SameSite=${sameSite}${secureStr}`;
    }

    static getCookie(name: string): string | null {
        if (typeof window === 'undefined') return null;

        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
            }
        }
        return null;
    }

    static deleteCookie(name: string, path: string = '/'): void {
        if (typeof window === 'undefined') return;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};SameSite=Lax`;
    }
}

// JWTトークンの管理
export class TokenManager {
    private static readonly ACCESS_TOKEN_KEY = 'auth_access_token';
    private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
    private static readonly TOKEN_KEY = 'auth_token'; // 後方互換性のため
    private static readonly USER_KEY = 'auth_user';

    static setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window !== 'undefined') {
            // アクセストークン: 1日（JWTトークンの有効期限に合わせる）
            CookieManager.setCookie(this.ACCESS_TOKEN_KEY, accessToken, { days: 1, path: '/', sameSite: 'Lax' });
            // リフレッシュトークン: 7日（JWTトークンの有効期限に合わせる）
            CookieManager.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, { days: 7, path: '/', sameSite: 'Lax' });
            CookieManager.setCookie(this.TOKEN_KEY, accessToken, { days: 1, path: '/', sameSite: 'Lax' });
        }
    }

    static setToken(token: string): void {
        if (typeof window !== 'undefined') {
            // アクセストークン: 1日（JWTトークンの有効期限に合わせる）
            CookieManager.setCookie(this.ACCESS_TOKEN_KEY, token, { days: 1, path: '/', sameSite: 'Lax' });
            CookieManager.setCookie(this.TOKEN_KEY, token, { days: 1, path: '/', sameSite: 'Lax' });
        }
    }

    static getAccessToken(): string | null {
        return CookieManager.getCookie(this.ACCESS_TOKEN_KEY) || CookieManager.getCookie(this.TOKEN_KEY);
    }

    static getRefreshToken(): string | null {
        return CookieManager.getCookie(this.REFRESH_TOKEN_KEY);
    }

    static getToken(): string | null {
        return this.getAccessToken();
    }

    static removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.USER_KEY);

            CookieManager.deleteCookie(this.ACCESS_TOKEN_KEY);
            CookieManager.deleteCookie(this.REFRESH_TOKEN_KEY);
            CookieManager.deleteCookie(this.TOKEN_KEY);
        }
    }

    static setUser(user: User): void {
        if (typeof window !== 'undefined') {
            CookieManager.setCookie(this.USER_KEY, JSON.stringify(user), { days: 7, path: '/', sameSite: 'Lax' });
        }
    }

    static getUser(): User | null {
        const cookieValue = CookieManager.getCookie(this.USER_KEY);
        if (!cookieValue) {
            return null;
        }
        try {
            return JSON.parse(cookieValue) as User;
        } catch (_error) {
            return null;
        }
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

// API クライアント
export class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    }

    // トークンの有効期限チェック（JWTのpayloadをデコード）
    private isTokenExpired(token: string): boolean {
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

    private async refreshTokenIfNeeded(): Promise<boolean> {
        const refreshTokenValue = TokenManager.getRefreshToken();
        if (!refreshTokenValue) {
            return false;
        }

        // リフレッシュトークン自体も期限切れかチェック
        if (this.isTokenExpired(refreshTokenValue)) {
            TokenManager.removeToken();
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshTokenValue }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.access_token && data.refresh_token) {
                    TokenManager.setTokens(data.access_token, data.refresh_token); return true;
                }
            }
        } catch (error) { }

        // リフレッシュ失敗時はトークンを削除
        TokenManager.removeToken();
        return false;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        let token = TokenManager.getAccessToken();

        // トークンが存在し、期限切れまたは期限が近い場合は事前にリフレッシュ
        if (token && this.isTokenExpired(token)) {
            const refreshed = await this.refreshTokenIfNeeded();
            if (refreshed) {
                token = TokenManager.getAccessToken();
            } else {
                throw new Error('Unable to refresh access token. Please log in again.');
            }
        }

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        let response = await fetch(`${this.baseUrl}${endpoint}`, config);

        // それでも401エラーの場合は、もう一度リフレッシュを試行
        if (response.status === 401 && token) {
            const refreshed = await this.refreshTokenIfNeeded();
            if (refreshed) {
                // 新しいトークンで再試行
                token = TokenManager.getAccessToken();
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
                response = await fetch(`${this.baseUrl}${endpoint}`, config);
            } else {
                throw new Error('Authentication failed. Please log in again.');
            }
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    }

    // 認証関連
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ user: credentials }),
        });

        if (response.user && response.tokens) {
            TokenManager.setTokens(response.tokens.access_token, response.tokens.refresh_token || '');
            TokenManager.setUser(response.user);
        }

        return response;
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ user: credentials }),
        });

        if (response.user && response.tokens) {
            TokenManager.setTokens(response.tokens.access_token, response.tokens.refresh_token || '');
            TokenManager.setUser(response.user);
        }

        return response;
    }

    async logout(): Promise<void> {
        try {
            await this.request('/api/auth/logout', {
                method: 'DELETE',
            });
        } finally {
            TokenManager.removeToken();
        }
    }

    async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/api/auth/forgot_password', {
            method: 'POST',
            body: JSON.stringify({ user: data }),
        });
    }

    async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/api/auth/reset_password', {
            method: 'POST',
            body: JSON.stringify({ user: data }),
        });

        if (response.user && response.tokens) {
            TokenManager.setTokens(response.tokens.access_token, response.tokens.refresh_token || '');
            TokenManager.setUser(response.user);
        }

        return response;
    }

    async verifyToken(): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/api/auth/verify_token', {
            method: 'POST',
        });

        if (response.user) {
            TokenManager.setUser(response.user);
        }

        return response;
    }

    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();

        if (data.success) {
            TokenManager.setTokens(data.access_token, data.refresh_token);
        }

        return data;
    }

    // ユーザー関連
    async getCurrentUser(): Promise<User> {
        const response = await this.request<{ success: boolean; user: User }>('/api/v1/users/me');
        return response.user;
    }

    async updateUser(userData: Partial<User>): Promise<User> {
        const response = await this.request<{ success: boolean; user: User }>('/api/v1/users/me', {
            method: 'PUT',
            body: JSON.stringify({ user: userData }),
        });

        if (response.success && response.user) {
            TokenManager.setUser(response.user);
        }

        return response.user;
    }

    async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/api/v1/users/change_password', {
            method: 'PUT',
            body: JSON.stringify({ user: data }),
        });
    }

    async deleteAccount(password: string): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/api/v1/users/me', {
            method: 'DELETE',
            body: JSON.stringify({ user: { password } }),
        });

        TokenManager.removeToken();
        return response;
    }
}

// 認証フック
export function useAuth() {
    const apiClient = new ApiClient();

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return apiClient.login(credentials);
    };

    const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return apiClient.register(credentials);
    };

    const logout = async (): Promise<void> => {
        return apiClient.logout();
    };

    const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
        return apiClient.forgotPassword(data);
    };

    const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
        return apiClient.resetPassword(data);
    };

    const verifyToken = async (): Promise<AuthResponse> => {
        return apiClient.verifyToken();
    };

    // OAuth認証
    const loginWithOAuth = (provider: OAuthProvider) => {
        const authUrl = getOAuthUrl(provider);
        window.location.href = authUrl;
    };

    // OAuth認証コールバック処理
    const handleOAuthCallback = (params: URLSearchParams) => {
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const token = params.get('token'); // 後方互換性
        const userStr = params.get('user');
        const error = params.get('error');
        if (error) {
            throw new Error(error);
        }

        if (userStr) {
            const user = JSON.parse(decodeURIComponent(userStr));

            // トークンとユーザー情報を保存
            if (accessToken && refreshToken) {
                TokenManager.setTokens(accessToken, refreshToken);
                TokenManager.setUser(user);
                return { success: true, user, access_token: accessToken, refresh_token: refreshToken };
            } else if (token) {
                // 後方互換性
                TokenManager.setToken(token);
                TokenManager.setUser(user);
                return { success: true, user, token };
            }

            // トークンがない場合もユーザー情報は保存
            TokenManager.setUser(user);
            return { success: true, user };
        }

        throw new Error('Invalid callback parameters');
    };

    return {
        // 通常認証
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyToken,

        // OAuth認証
        loginWithOAuth,
        handleOAuthCallback,

        // トークン管理
        refreshToken: () => apiClient.refreshToken(),

        // 状態
        isAuthenticated: () => TokenManager.isAuthenticated(),
        user: TokenManager.getUser(),
        apiClient,
    };
}