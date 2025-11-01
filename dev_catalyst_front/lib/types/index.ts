// Common types used across the application

// User and Authentication Types
export interface User {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Project Types
export interface Project {
    id: number;
    title: string;
    idea_text: string;
    status: 'draft' | 'validation' | 'analysis' | 'planning' | 'development';
    user_id: number;
    created_at: string;
    updated_at: string;
}

// Psychology and UX Types
export interface PsychologicalProfile {
    cognitive_load_level: number;
    self_efficacy_score: number;
    bias_awareness: string[];
    motivation_factors: string[];
}

export interface UXPsychologyConfig {
    enable_cognitive_load_optimization: boolean;
    enable_bias_mitigation: boolean;
    enable_motivational_framing: boolean;
    user_experience_level: 'beginner' | 'intermediate' | 'advanced';
}

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_count: number;
        per_page: number;
    };
}

// Form Types
export interface FormState<T> {
    data: T;
    errors: Record<keyof T, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

// Component Props Types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface LoadingState {
    isLoading: boolean;
    loadingMessage?: string;
}

export interface ErrorState {
    hasError: boolean;
    errorMessage?: string;
    errorCode?: string;
}

// API Integration Types
export interface ApiEndpoint {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    requiresAuth: boolean;
}

export interface ApiConfiguration {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
}

// Psychology-specific Types
export interface CognitiveLoadMetrics {
    complexity_score: number;
    information_density: number;
    decision_points: number;
    recommended_simplification: string[];
}

export interface BiasDetection {
    detected_biases: string[];
    confidence_scores: Record<string, number>;
    mitigation_strategies: string[];
}

export interface MotivationalFraming {
    framing_type: 'positive' | 'negative' | 'neutral';
    psychological_triggers: string[];
    expected_impact: number;
}