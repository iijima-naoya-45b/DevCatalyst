import { aiApi } from '../api/rails/ai';
import type { ChatRequest, ChatResponse, ChatSession } from '../api/rails/ai';

class AIService {
    /**
     * チャット送信（通常）
     */
    async chatCompletion(request: ChatRequest, sessionId?: number): Promise<ChatResponse> {
        try {
            const response = await aiApi.chat(request, sessionId);
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * チャット送信（ストリーミング）
     */
    async chatCompletionStream(
        request: ChatRequest,
        sessionId: number | undefined,
        callbacks: {
            onChunk: (chunk: string) => void;
            onError?: (error: string) => void;
            onComplete?: (sessionId: number) => void;
        }
    ): Promise<void> {
        try {
            await aiApi.chatStream(request, sessionId, callbacks);
        } catch (error: any) {
            callbacks.onError?.(error.message || 'ストリーミング中にエラーが発生しました。');
            throw error;
        }
    }

    /**
     * セッション一覧取得
     */
    async getSessions(limit: number = 20): Promise<ChatSession[]> {
        try {
            const response = await aiApi.getSessions(limit);
            return response.data || [];
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * セッション詳細取得
     */
    async getSession(sessionId: number): Promise<any> {
        try {
            const response = await aiApi.getSession(sessionId);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * セッション削除
     */
    async deleteSession(sessionId: number): Promise<void> {
        try {
            await aiApi.deleteSession(sessionId);
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * セッションアーカイブ
     */
    async archiveSession(sessionId: number): Promise<void> {
        try {
            await aiApi.archiveSession(sessionId);
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
            throw new Error(error.message || 'このAIプロバイダーを使用する権限がありません。');
        }

        if (error.status === 429) {
            throw new Error('リクエスト制限に達しました。しばらく待ってから再試行してください。');
        }

        throw new Error(error.message || 'AI APIの呼び出しに失敗しました。');
    }
}

export const aiService = new AIService();
export type { ChatRequest, ChatResponse, ChatSession } from '../api/rails/ai';
