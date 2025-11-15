import { API_CONFIG, REQUEST_CONFIG } from './config';

// APIレスポンス型
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

// カスタムAPIエラークラス
export class ApiClientError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.code = code;
    }
}

// Base API Client Class
class BaseApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new ApiClientError(
                data.message || data.error || 'API request failed',
                response.status,
                data.code
            );
        }

        return {
            data,
            status: response.status,
        };
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...REQUEST_CONFIG,
            ...options,
            headers: {
                ...REQUEST_CONFIG.HEADERS,
                ...options.headers,
            },
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return await this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof ApiClientError) {
                throw error;
            }

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new ApiClientError('Request timeout', 408);
                }
                throw new ApiClientError(error.message, 0);
            }

            throw new ApiClientError('Unknown error occurred', 0);
        }
    }

    // HTTP Methods
    async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
        return this.makeRequest<T>(url, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, { method: 'DELETE' });
    }
}

// Rails API Client
export const railsApiClient = new BaseApiClient(API_CONFIG.RAILS_API_URL);

// FastAPI AI Service Client
export const aiServiceClient = new BaseApiClient(API_CONFIG.AI_SERVICE_URL);