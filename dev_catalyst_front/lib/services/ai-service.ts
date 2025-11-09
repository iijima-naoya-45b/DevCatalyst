import { aiServiceClient, ApiClientError } from '../api-client';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatRequest {
    messages: ChatMessage[];
    provider?: 'openai' | 'anthropic';
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}

export interface ChatResponse {
    message: string;
    provider: string;
    model: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
        input_tokens?: number;
        output_tokens?: number;
    };
}

export interface AIModel {
    id: string;
    name: string;
    plan_required: string;
}

export interface AvailableModels {
    models: {
        openai: AIModel[];
        anthropic: AIModel[];
    };
    user_plan: string;
}

class AIService {
    private baseURL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

    /**
     * AI チャット補完
     */
    async chatCompletion(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await aiServiceClient.post<ChatResponse>('/ai/chat', request);
            return response.data as ChatResponse;
        } catch (error: unknown) {
            if (error instanceof ApiClientError) {
                if (error.status === 401) {
                    window.location.href = '/login';
                    throw new Error('認証が必要です。ログインしてください。');
                }
                if (error.status === 403) {
                    throw new Error(error.message || 'このAIプロバイダーを使用する権限がありません。');
                }
                throw new Error(error.message || 'AI APIの呼び出しに失敗しました。');
            }
            throw new Error('AI APIの呼び出しに失敗しました。');
        }
    }

    /**
     * AI チャット補完（ストリーミング）
     */
    async chatCompletionStream(
        request: ChatRequest,
        onChunk: (chunk: string) => void,
        onError?: (error: string) => void,
        onComplete?: () => void
    ): Promise<void> {
        try {
            const response = await fetch(`${this.baseURL}/api/ai/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAccessToken()}`,
                },
                body: JSON.stringify(request),
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // 認証エラーの場合、ログインページにリダイレクト
                    window.location.href = '/login';
                    throw new Error('認証が必要です。ログインしてください。');
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || 'AI APIの呼び出しに失敗しました。');
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('ストリーミングレスポンスの読み取りに失敗しました。');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) {
                                onError?.(data.message);
                                return;
                            }

                            if (data.done) {
                                onComplete?.();
                                return;
                            }

                            if (data.content) {
                                onChunk(data.content);
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
            }
        } catch (error: any) {
            onError?.(error.message || 'ストリーミング中にエラーが発生しました。');
        }
    }

    /**
     * 利用可能なAIモデル一覧を取得
     */
    async getAvailableModels(): Promise<AvailableModels> {
        try {
            const response = await aiServiceClient.get<AvailableModels>('/ai/models');
            return response.data as AvailableModels;
        } catch (error: unknown) {
            if (error instanceof ApiClientError) {
                if (error.status === 401) {
                    window.location.href = '/login';
                    throw new Error('認証が必要です。ログインしてください。');
                }
                throw new Error(error.message || 'モデル一覧の取得に失敗しました。');
            }
            throw new Error('モデル一覧の取得に失敗しました。');
        }
    }

    /**
     * アクセストークンを取得
     */
    private getAccessToken(): string | null {
        // Cookieからアクセストークンを取得
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'access_token') {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    /**
     * 認証状態をチェック
     */
    async checkAuthStatus(): Promise<{
        authenticated: boolean;
        user: any;
        expires_in: number | null;
    }> {
        try {
            const response = await aiServiceClient.get<{
                authenticated: boolean;
                user: any;
                expires_in: number | null;
            }>('/auth/check');
            return (response.data as {
                authenticated: boolean;
                user: any;
                expires_in: number | null;
            }) || {
                authenticated: false,
                user: null,
                expires_in: null,
            };
        } catch (error) {
            return {
                authenticated: false,
                user: null,
                expires_in: null,
            };
        }
    }

    /**
     * トークンをリフレッシュ
     */
    async refreshToken(): Promise<boolean> {
        try {
            await aiServiceClient.post('/auth/refresh');
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const aiService = new AIService();