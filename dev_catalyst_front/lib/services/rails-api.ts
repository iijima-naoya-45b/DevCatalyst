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

    static async createProject(project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Project>> {
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

    static async generateRoadmap(projectId: number, githubUsername?: string): Promise<ApiResponse<any>> {
        return railsApiClient.post<any>(API_ENDPOINTS.RAILS.ROADMAPS, {
            project_id: projectId,
            github_username: githubUsername,
        });
    }

    // Payment Methods
    static async getSubscriptions(): Promise<ApiResponse<any[]>> {
        return railsApiClient.get<any[]>(API_ENDPOINTS.RAILS.SUBSCRIPTIONS);
    }

    static async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<ApiResponse<any>> {
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
}