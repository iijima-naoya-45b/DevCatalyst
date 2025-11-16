// Rails API Clients
export { aiApi } from './rails/ai';
export { gdprApi } from './rails/gdpr';

// Types
export type { ChatMessage, ChatRequest, ChatResponse, ChatSession } from './rails/ai';
export type { DataSummary, Consent, DeleteAccountRequest } from './rails/gdpr';
export type { ApiResponse, ApiError, ApiClientError } from './client';

// Re-export for convenience
export const api = {
  ai: () => import('./rails/ai').then((m) => m.aiApi),
  gdpr: () => import('./rails/gdpr').then((m) => m.gdprApi),
};
