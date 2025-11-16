import { railsApiClient, ApiResponse } from '../api-client';
import { API_ENDPOINTS } from '../config';

// Type definitions for Rails API
export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  idea_text: string;
  status: 'draft' | 'validation' | 'analysis' | 'planning' | 'development';
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export type IdeaConfidenceLevel = 'high' | 'low';

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiChatRequest {
  idea_confidence: IdeaConfidenceLevel;
  messages: AiChatMessage[];
  metadata?: Record<string, unknown>;
  session_id?: number;
}

export interface AiChatResponsePayload {
  assistant_message: string;
  suggestions?: string[];
  summary?: string;
  next_steps?: string[];
  provider?: string;
  model?: string;
  usage?: any;
  session_id?: number;
  cache_hit?: boolean;
  raw_response?: any;
}

export interface ChatSessionSummary {
  id: number;
  title: string;
  last_message_preview?: string;
  last_interacted_at: string;
  created_at: string;
  messages_count: number;
  archived: boolean;
}

export interface ChatSessionMessage {
  id: number;
  sender_role: 'user' | 'aria';
  content: string;
  metadata: Record<string, unknown>;
  token_count?: number | null;
  cached_response: boolean;
  responded_at?: string | null;
  created_at: string;
}

export interface ChatSessionMessagesPayload {
  session: {
    id: number;
    title: string;
    archived: boolean;
    last_interacted_at: string;
    created_at: string;
  };
  messages: ChatSessionMessage[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Rails API Service Class
export class RailsApiService {
  // Authentication Methods
  static async login(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
    return railsApiClient.post<AuthResponse>(API_ENDPOINTS.RAILS.AUTH.LOGIN, {
      user: credentials,
    });
  }

  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return railsApiClient.post<AuthResponse>(API_ENDPOINTS.RAILS.AUTH.REGISTER, {
      user: data,
    });
  }

  static async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return railsApiClient.post<AuthResponse>(API_ENDPOINTS.RAILS.AUTH.REFRESH);
  }

  static async logout(): Promise<ApiResponse<{ message: string }>> {
    return railsApiClient.post<{ message: string }>(API_ENDPOINTS.RAILS.AUTH.LOGOUT);
  }

  // Project Management Methods
  static async getProjects(): Promise<ApiResponse<Project[]>> {
    return railsApiClient.get<Project[]>(API_ENDPOINTS.RAILS.PROJECTS);
  }

  static async getProject(id: number): Promise<ApiResponse<Project>> {
    return railsApiClient.get<Project>(`${API_ENDPOINTS.RAILS.PROJECTS}/${id}`);
  }

  static async createProject(
    project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<Project>> {
    return railsApiClient.post<Project>(API_ENDPOINTS.RAILS.PROJECTS, {
      project,
    });
  }

  static async updateProject(id: number, project: Partial<Project>): Promise<ApiResponse<Project>> {
    return railsApiClient.put<Project>(`${API_ENDPOINTS.RAILS.PROJECTS}/${id}`, {
      project,
    });
  }

  static async deleteProject(id: number): Promise<ApiResponse<{ message: string }>> {
    return railsApiClient.delete<{ message: string }>(`${API_ENDPOINTS.RAILS.PROJECTS}/${id}`);
  }

  // Competitor Analysis Methods
  static async getCompetitors(projectId: number): Promise<ApiResponse<any[]>> {
    return railsApiClient.get<any[]>(`${API_ENDPOINTS.RAILS.COMPETITORS}?project_id=${projectId}`);
  }

  static async analyzeCompetitors(projectId: number): Promise<ApiResponse<any>> {
    return railsApiClient.post<any>(`${API_ENDPOINTS.RAILS.COMPETITORS}/analyze`, {
      project_id: projectId,
    });
  }

  // Roadmap Methods
  static async getRoadmap(projectId: number): Promise<ApiResponse<any>> {
    return railsApiClient.get<any>(`${API_ENDPOINTS.RAILS.ROADMAPS}?project_id=${projectId}`);
  }

  static async generateRoadmap(
    projectId: number,
    githubUsername?: string
  ): Promise<ApiResponse<any>> {
    return railsApiClient.post<any>(API_ENDPOINTS.RAILS.ROADMAPS, {
      project_id: projectId,
      github_username: githubUsername,
    });
  }

  // Payment Methods
  static async getSubscriptions(): Promise<ApiResponse<any[]>> {
    return railsApiClient.get<any[]>(API_ENDPOINTS.RAILS.SUBSCRIPTIONS);
  }

  static async createPaymentIntent(
    amount: number,
    currency: string = 'usd'
  ): Promise<ApiResponse<any>> {
    return railsApiClient.post<any>(API_ENDPOINTS.RAILS.PAYMENTS, {
      amount,
      currency,
    });
  }

  static async updateSubscription(planId: string): Promise<ApiResponse<any>> {
    return railsApiClient.post<any>(API_ENDPOINTS.RAILS.SUBSCRIPTIONS, {
      plan_id: planId,
    });
  }

  // AI Conversation
  static async sendAiChatMessage(
    payload: AiChatRequest
  ): Promise<ApiResponse<AiChatResponsePayload>> {
    const response = await railsApiClient.post<{ success: boolean; data: AiChatResponsePayload }>(
      API_ENDPOINTS.RAILS.AI.CHAT,
      payload
    );

    if (response.data && (response.data as { data?: AiChatResponsePayload }).data) {
      const envelope = response.data as { success: boolean; data: AiChatResponsePayload };
      return {
        status: response.status,
        data: envelope.data,
        message: response.message,
        error: response.error,
      };
    }

    return response as unknown as ApiResponse<AiChatResponsePayload>;
  }

  // AI Sessions - 新しいAPI構造
  static async getChatSessions(limit?: number): Promise<ApiResponse<ChatSessionSummary[]>> {
    const response = await railsApiClient.get<{ success: boolean; sessions: ChatSessionSummary[] }>(
      `${API_ENDPOINTS.RAILS.AI.SESSIONS}${limit ? `?limit=${limit}` : ''}`
    );

    if (response.data && (response.data as { sessions?: ChatSessionSummary[] }).sessions) {
      const envelope = response.data as { success: boolean; sessions: ChatSessionSummary[] };
      return {
        status: response.status,
        data: envelope.sessions,
      };
    }

    return response as unknown as ApiResponse<ChatSessionSummary[]>;
  }

  static async getChatSession(sessionId: number): Promise<ApiResponse<ChatSessionSummary>> {
    const response = await railsApiClient.get<{ success: boolean; data: ChatSessionSummary }>(
      `${API_ENDPOINTS.RAILS.AI.SESSIONS}/${sessionId}`
    );

    if (response.data && (response.data as { data?: ChatSessionSummary }).data) {
      const envelope = response.data as { success: boolean; data: ChatSessionSummary };
      return {
        status: response.status,
        data: envelope.data,
      };
    }

    return response as unknown as ApiResponse<ChatSessionSummary>;
  }

  static async deleteChatSession(sessionId: number): Promise<ApiResponse<{ message: string }>> {
    return railsApiClient.delete<{ message: string }>(
      `${API_ENDPOINTS.RAILS.AI.SESSIONS}/${sessionId}`
    );
  }

  static async archiveChatSession(sessionId: number): Promise<ApiResponse<ChatSessionSummary>> {
    const response = await railsApiClient.patch<{ success: boolean; data: ChatSessionSummary }>(
      `${API_ENDPOINTS.RAILS.AI.SESSIONS}/${sessionId}/archive`
    );

    if (response.data && (response.data as { data?: ChatSessionSummary }).data) {
      const envelope = response.data as { success: boolean; data: ChatSessionSummary };
      return {
        status: response.status,
        data: envelope.data,
      };
    }

    return response as unknown as ApiResponse<ChatSessionSummary>;
  }

  // 後方互換性のため残す（非推奨）
  static async getChatSessionMessages(
    sessionId: number,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<ChatSessionMessagesPayload>> {
    // 新しいAPIでは show エンドポイントを使用
    const response = await this.getChatSession(sessionId);

    if (response.data && (response.data as any).messages) {
      const session = response.data as any;
      return {
        status: response.status,
        data: {
          session: {
            id: session.id,
            title: session.title,
            archived: session.archived,
            last_interacted_at: session.last_interacted_at,
            created_at: session.created_at,
          },
          messages: session.messages,
          pagination: {
            page: 1,
            per_page: session.messages?.length || 0,
            total: session.messages?.length || 0,
            total_pages: 1,
          },
        },
      };
    }

    return response as unknown as ApiResponse<ChatSessionMessagesPayload>;
  }
}
