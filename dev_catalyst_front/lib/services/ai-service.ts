import { aiServiceClient } from '../api-client';
import type { ChatRequest, ChatResponse, AvailableModels } from '../types/ai';

class AIService {
    private baseURL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';

    async chatCompletion(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await aiServiceClient.post<ChatResponse>('/api/ai/chat', request);
            if (!response.data) {
                throw new Error('No data received from API');
            }
            return response.data;
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

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
                await this.handleFetchError(response);
            }

            await this.processStream(response, onChunk, onError, onComplete);
        } catch (error: any) {
            onError?.(error.message || 'ストリーミング中にエラーが発生しました。');
        }
    }

    async getAvailableModels(): Promise<AvailableModels> {
        try {
            const response = await aiServiceClient.get<AvailableModels>('/api/ai/models');
            if (!response.data) {
                throw new Error('No data received from API');
            }
            return response.data;
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

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
            }>('/api/auth/check');
            return response.data || {
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

    async refreshToken(): Promise<boolean> {
        try {
            await aiServiceClient.post('/api/auth/refresh', {});
            return true;
        } catch (error) {
            return false;
        }
    }

    private getAccessToken(): string | null {
        if (typeof document === 'undefined') return null;

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'access_token') {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    private handleError(error: any): void {
        if (error.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('認証が必要です。ログインしてください。');
        }
        if (error.status === 403) {
            throw new Error(error.message || 'このAIプロバイダーを使用する権限がありません。');
        }
        throw new Error(error.message || 'AI APIの呼び出しに失敗しました。');
    }

    private async handleFetchError(response: Response): Promise<void> {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('認証が必要です。ログインしてください。');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'AI APIの呼び出しに失敗しました。');
    }

    private async processStream(
        response: Response,
        onChunk: (chunk: string) => void,
        onError?: (error: string) => void,
        onComplete?: () => void
    ): Promise<void> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('ストリーミングレスポンスの読み取りに失敗しました。');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

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
    }
}

export const aiService = new AIService();
export type { ChatRequest, ChatResponse, AvailableModels } from '../types/ai';