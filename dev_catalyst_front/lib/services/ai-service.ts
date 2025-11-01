import { aiServiceClient, ApiResponse } from '../api-client';
import { API_ENDPOINTS } from '../config';

// Type definitions for AI Service
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}

export interface ChatRequest {
    message: string;
    context?: {
        project_id?: number;
        user_id?: number;
        conversation_history?: ChatMessage[];
    };
}

export interface ChatResponse {
    response: string;
    psychological_insights?: {
        cognitive_load_level?: number;
        bias_mitigation?: string;
        recommended_framing?: string;
    };
    suggestions?: string[];
}

export interface ValidationQuestion {
    id: string;
    question: string;
    type: 'problem_validation' | 'market_size' | 'customer_acquisition' | 'pricing';
    cognitive_complexity: number;
}

export interface ValidationRequest {
    idea: string;
    user_context?: {
        experience_level?: string;
        technical_skills?: string[];
        previous_projects?: number;
    };
}

export interface ValidationResponse {
    questions: ValidationQuestion[];
    psychological_analysis: {
        cognitive_load_optimization: string;
        bias_awareness: string[];
    };
}

export interface AnalysisRequest {
    responses: Array<{
        question_id: string;
        answer: string;
        confidence_score: number;
    }>;
    project_context: {
        idea: string;
        target_market?: string;
    };
}

export interface AnalysisResponse {
    revenue_models: Array<{
        model: string;
        description: string;
        feasibility_score: number;
        psychological_framing: string;
    }>;
    validation_steps: Array<{
        step: string;
        description: string;
        priority: number;
        estimated_effort: string;
    }>;
    behavioral_insights: {
        change_readiness: number;
        commitment_level: string;
        recommended_approach: string;
    };
}

export interface RecommendationRequest {
    project_id: number;
    current_progress?: {
        completed_steps: string[];
        current_challenges: string[];
    };
}

export interface RecommendationResponse {
    next_steps: Array<{
        action: string;
        rationale: string;
        psychological_benefit: string;
    }>;
    motivation_boosters: string[];
    risk_mitigation: string[];
}

// AI Service Class
export class AiService {
    // Chat Methods
    static async sendMessage(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
        return aiServiceClient.post<ChatResponse>(API_ENDPOINTS.AI.CHAT, request);
    }

    // Validation Methods
    static async generateValidationQuestions(request: ValidationRequest): Promise<ApiResponse<ValidationResponse>> {
        return aiServiceClient.post<ValidationResponse>(API_ENDPOINTS.AI.VALIDATION, request);
    }

    static async analyzeValidationResponses(request: AnalysisRequest): Promise<ApiResponse<AnalysisResponse>> {
        return aiServiceClient.post<AnalysisResponse>(API_ENDPOINTS.AI.ANALYSIS, request);
    }

    // Recommendation Methods
    static async getRecommendations(request: RecommendationRequest): Promise<ApiResponse<RecommendationResponse>> {
        return aiServiceClient.post<RecommendationResponse>(API_ENDPOINTS.AI.RECOMMENDATIONS, request);
    }

    // Utility Methods
    static async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
        return aiServiceClient.get<{ status: string; timestamp: string }>('/health');
    }

    // Psychology-focused methods
    static async optimizeCognitiveLoad(content: string, userProfile: any): Promise<ApiResponse<any>> {
        return aiServiceClient.post<any>('/ai/psychology/cognitive-load', {
            content,
            user_profile: userProfile,
        });
    }

    static async applyBehavioralFraming(content: string, framingType: string): Promise<ApiResponse<any>> {
        return aiServiceClient.post<any>('/ai/psychology/framing', {
            content,
            framing_type: framingType,
        });
    }

    static async generateMotivationalContent(userProgress: any, goals: any): Promise<ApiResponse<any>> {
        return aiServiceClient.post<any>('/ai/psychology/motivation', {
            user_progress: userProgress,
            goals,
        });
    }
}