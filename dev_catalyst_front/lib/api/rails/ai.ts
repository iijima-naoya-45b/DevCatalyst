import { BaseApiClient } from '../client';

const RAILS_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const client = new BaseApiClient(RAILS_API_URL);

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
    metadata?: Record<string, any>;
    stream?: boolean;
}

export interface ChatResponse {
    success: boolean;
    data?: {
        assistant_message: string;
        message: string;
        provider: string;
        model: string;
        usage?: {
            prompt_tokens?: number;
            completion_tokens?: number;
            total_tokens?: number;
        };
        session_id: number;
        cache_hit: boolean;
    };
}

export interface ChatSession {
    id: number;
    title: string;
    last_message_preview?: string;
    last_interacted_at: string;
    created_at: string;
    messages_count: number;
    archived: boolean;
}

export const aiApi = {
    // チャット送信
    async chat(request: ChatRequest, sessionId?: number): Promise<ChatResponse> {
        const endpoint = sessionId
            ? `/api/v1/ai/chat?session_id=${sessionId}`
            : '/api/v1/ai/chat';

        return await client.post<ChatResponse>(endpoint, { chat: request }) as ChatResponse;
    },

    // ストリーミングチャット
    async chatStream(
        request: ChatRequest,
        sessionId: number | undefined,
        callbacks: {
            onChunk: (chunk: string) => void;
            onError?: (error: string) => void;
            onComplete?: (sessionId: number) => void;
        }
    ): Promise<void> {
        const endpoint = sessionId
            ? `/api/v1/ai/chat/stream?session_id=${sessionId}`
            : '/api/v1/ai/chat/stream';

        const token = getToken();
        const response = await fetch(`${RAILS_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({ chat: request }),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Streaming failed');
        }

        await processStream(response, callbacks);
    },

    // セッション一覧取得
    async getSessions(limit: number = 20): Promise<{ success: boolean; data: ChatSession[] }> {
        const response = await client.get(`/api/v1/ai/sessions?limit=${limit}`);
        return response as { success: boolean; data: ChatSession[] };
    },

    // セッション詳細取得
    async getSession(sessionId: number): Promise<{ success: boolean; data: any }> {
        const response = await client.get(`/api/v1/ai/sessions/${sessionId}`);
        return response as { success: boolean; data: any };
    },

    // セッション削除
    async deleteSession(sessionId: number): Promise<{ success: boolean }> {
        const response = await client.delete(`/api/v1/ai/sessions/${sessionId}`);
        return response as { success: boolean };
    },

    // セッションアーカイブ
    async archiveSession(sessionId: number): Promise<{ success: boolean }> {
        const response = await client.patch(`/api/v1/ai/sessions/${sessionId}/archive`);
        return response as { success: boolean };
    },
};

// Helper functions
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

async function processStream(
    response: Response,
    callbacks: {
        onChunk: (chunk: string) => void;
        onError?: (error: string) => void;
        onComplete?: (sessionId: number) => void;
    }
): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('Failed to get stream reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
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
                            callbacks.onError?.(data.message || 'An error occurred');
                            return;
                        }

                        if (data.done) {
                            callbacks.onComplete?.(data.session_id);
                            return;
                        }

                        if (data.content) {
                            callbacks.onChunk(data.content);
                        }
                    } catch (e) {
                        console.error('Failed to parse SSE data:', e);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
