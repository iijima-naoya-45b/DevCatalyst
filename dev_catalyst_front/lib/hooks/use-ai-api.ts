import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aiService, ChatRequest, ChatResponse, AvailableModels } from '../services/ai-service';

export interface UseAIApiOptions {
    autoRefreshToken?: boolean;
    redirectOnAuthError?: boolean;
}

export function useAIApi(options: UseAIApiOptions = {}) {
    const { autoRefreshToken = true, redirectOnAuthError = true } = options;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // 認証状態をチェック
    const checkAuth = useCallback(async () => {
        try {
            const authStatus = await aiService.checkAuthStatus();
            setIsAuthenticated(authStatus.authenticated);

            if (!authStatus.authenticated && redirectOnAuthError) {
                router.push('/login');
                return false;
            }

            return authStatus.authenticated;
        } catch (error) {
            setIsAuthenticated(false);
            if (redirectOnAuthError) {
                router.push('/login');
            }
            return false;
        }
    }, [router, redirectOnAuthError]);

    // トークンリフレッシュ
    const refreshToken = useCallback(async () => {
        try {
            const success = await aiService.refreshToken();
            if (success) {
                setIsAuthenticated(true);
                return true;
            } else {
                setIsAuthenticated(false);
                if (redirectOnAuthError) {
                    router.push('/login');
                }
                return false;
            }
        } catch (error) {
            setIsAuthenticated(false);
            if (redirectOnAuthError) {
                router.push('/login');
            }
            return false;
        }
    }, [router, redirectOnAuthError]);

    // 認証エラー時の処理
    const handleAuthError = useCallback(async () => {
        if (autoRefreshToken) {
            const refreshed = await refreshToken();
            if (!refreshed && redirectOnAuthError) {
                router.push('/login');
            }
            return refreshed;
        } else if (redirectOnAuthError) {
            router.push('/login');
            return false;
        }
        return false;
    }, [autoRefreshToken, refreshToken, redirectOnAuthError, router]);

    // AI チャット補完
    const chatCompletion = useCallback(async (request: ChatRequest): Promise<ChatResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // 認証チェック
            if (isAuthenticated === false) {
                const authSuccess = await handleAuthError();
                if (!authSuccess) {
                    return null;
                }
            }

            const response = await aiService.chatCompletion(request);
            return response;
        } catch (error: any) {
            if (error.message.includes('認証')) {
                const authSuccess = await handleAuthError();
                if (authSuccess) {
                    // 認証成功後、再試行
                    try {
                        const response = await aiService.chatCompletion(request);
                        return response;
                    } catch (retryError: any) {
                        setError(retryError.message);
                        return null;
                    }
                }
            } else {
                setError(error.message);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, handleAuthError]);

    // AI チャット補完（ストリーミング）
    const chatCompletionStream = useCallback(async (
        request: ChatRequest,
        onChunk: (chunk: string) => void,
        onError?: (error: string) => void,
        onComplete?: () => void
    ): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // 認証チェック
            if (isAuthenticated === false) {
                const authSuccess = await handleAuthError();
                if (!authSuccess) {
                    onError?.('認証に失敗しました');
                    return;
                }
            }

            await aiService.chatCompletionStream(
                request,
                onChunk,
                (error) => {
                    if (error.includes('認証')) {
                        handleAuthError().then((authSuccess) => {
                            if (!authSuccess) {
                                onError?.(error);
                            }
                        });
                    } else {
                        setError(error);
                        onError?.(error);
                    }
                },
                () => {
                    setIsLoading(false);
                    onComplete?.();
                }
            );
        } catch (error: any) {
            setError(error.message);
            onError?.(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, handleAuthError]);

    // 利用可能なモデル一覧を取得
    const getAvailableModels = useCallback(async (): Promise<AvailableModels | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // 認証チェック
            if (isAuthenticated === false) {
                const authSuccess = await handleAuthError();
                if (!authSuccess) {
                    return null;
                }
            }

            const models = await aiService.getAvailableModels();
            return models;
        } catch (error: any) {
            if (error.message.includes('認証')) {
                const authSuccess = await handleAuthError();
                if (authSuccess) {
                    // 認証成功後、再試行
                    try {
                        const models = await aiService.getAvailableModels();
                        return models;
                    } catch (retryError: any) {
                        setError(retryError.message);
                        return null;
                    }
                }
            } else {
                setError(error.message);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, handleAuthError]);

    // 初期化時に認証状態をチェック
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        // State
        isLoading,
        error,
        isAuthenticated,

        // Methods
        chatCompletion,
        chatCompletionStream,
        getAvailableModels,
        checkAuth,
        refreshToken,

        // Utils
        clearError: () => setError(null),
    };
}