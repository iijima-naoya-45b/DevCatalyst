// API設定
export const API_CONFIG = {
    RAILS_API_URL: process.env.NEXT_PUBLIC_RAILS_API_URL || 'http://localhost:3001',
    AI_SERVICE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000',
    TIMEOUT: 30000, // 30秒
} as const;

// APIエンドポイント
export const API_ENDPOINTS = {
    // Rails APIエンドポイント
    RAILS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            REFRESH: '/auth/refresh',
            LOGOUT: '/auth/logout',
        },
        PROJECTS: '/projects',
        COMPETITORS: '/competitors',
        ROADMAPS: '/roadmaps',
        PAYMENTS: '/payments',
        SUBSCRIPTIONS: '/subscriptions',
        AI_CHAT: '/api/v1/ai/chat',
        AI_CHAT_STREAM: '/api/v1/ai/chat/stream',
        AI_CHAT_SESSIONS: '/api/v1/ai/chat_sessions',
    },
    // FastAPI AIサービスエンドポイント
    AI: {
        CHAT: '/ai/chat',
        VALIDATION: '/ai/validation',
        ANALYSIS: '/ai/analysis',
        RECOMMENDATIONS: '/ai/recommendations',
    },
} as const;

// リクエスト設定
export const REQUEST_CONFIG = {
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    credentials: 'include' as RequestCredentials, // HTTP-onlyクッキー用
} as const;