'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useAuthHook, ApiClient } from '@/lib/auth';
import type { User, AuthResponse, LoginCredentials, RegisterCredentials, ForgotPasswordData } from '@/lib/types';
import { useAuthToken } from '@/lib/hooks/use-auth-token';

interface AuthContextType {
    user: User | null;
    isAuthenticated: () => boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    forgotPassword: (data: ForgotPasswordData) => Promise<AuthResponse>;
    loginWithOAuth: (provider: 'google' | 'github') => void;
    handleOAuthCallback: (params: URLSearchParams) => any;
    apiClient: ApiClient;
    refreshToken: () => Promise<boolean>;
    ensureValidToken: () => Promise<boolean>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuthHook();
    const authToken = useAuthToken();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 初期化時にトークンの検証を行う
        const initializeAuth = async () => {
            try {
                // クライアントサイドでのみ実行
                if (typeof window !== 'undefined') {
                    const { TokenManager } = await import('@/lib/auth');
                    if (TokenManager.isAuthenticated()) {
                        // トークンが有効か確認し、必要ならリフレッシュ
                        const isValid = await authToken.ensureValidToken();
                        if (isValid) {
                            await auth.verifyToken();
                        } else {
                            // トークンが無効な場合はログアウト
                            await auth.logout();
                        }
                    }
                }
            } catch (error) {                // トークンが無効な場合は削除
                try {
                    await auth.logout();
                } catch (logoutError) {                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [auth, authToken]);

    const contextValue: AuthContextType = {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        login: auth.login,
        register: auth.register,
        logout: auth.logout,
        forgotPassword: auth.forgotPassword,
        loginWithOAuth: auth.loginWithOAuth,
        handleOAuthCallback: auth.handleOAuthCallback,
        apiClient: auth.apiClient,
        refreshToken: authToken.refreshToken,
        ensureValidToken: authToken.ensureValidToken,
        loading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function useOptionalAuth() {
    return useContext(AuthContext);
}