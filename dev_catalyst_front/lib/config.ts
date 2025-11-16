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
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            REFRESH: '/api/auth/refresh',
            LOGOUT: '/api/auth/logout',
        },
        PROJECTS: '/api/v1/projects',
        COMPETITORS: '/api/v1/competitors',
        ROADMAPS: '/api/v1/roadmaps',
        PAYMENTS: '/api/v1/payments',
        SUBSCRIPTIONS: '/api/v1/subscriptions',
        AI: {
            CHAT: '/api/v1/ai/chat',
            STREAM: '/api/v1/ai/chat/stream',
            SESSIONS: '/api/v1/ai/sessions',
        },
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