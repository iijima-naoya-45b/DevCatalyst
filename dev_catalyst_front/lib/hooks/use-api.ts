import { useState, useCallback } from 'react';
import { ApiResponse, ApiClientError } from '../api-client';
import { ErrorHandler, AppError } from '../utils/error-handler';

// Hook state interface
interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: AppError | null;
}

// Hook return interface
interface UseApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: AppError | null;
    execute: (...args: any[]) => Promise<T | null>;
    reset: () => void;
}

// Generic API hook
export function useApi<T = any>(
    apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]): Promise<T | null> => {
            setState(prev => ({ ...prev, loading: true, error: null }));

            try {
                const response = await apiFunction(...args);
                setState({
                    data: response.data || null,
                    loading: false,
                    error: null,
                });
                return response.data || null;
            } catch (error) {
                const appError = ErrorHandler.handleApiError(error);
                setState({
                    data: null,
                    loading: false,
                    error: appError,
                });
                return null;
            }
        },
        [apiFunction]
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        execute,
        reset,
    };
}

// Specialized hooks for common patterns
export function useAsyncApi<T = any>(
    apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
    immediate: boolean = false,
    ...args: any[]
): UseApiReturn<T> {
    const api = useApi(apiFunction);

    // Execute immediately if requested
    useState(() => {
        if (immediate) {
            api.execute(...args);
        }
    });

    return api;
}

// Hook for handling multiple API calls
export function useMultipleApi() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<AppError[]>([]);

    const executeMultiple = useCallback(
        async (apiCalls: Array<() => Promise<any>>): Promise<any[]> => {
            setLoading(true);
            setErrors([]);

            const results: any[] = [];
            const errorList: AppError[] = [];

            for (const apiCall of apiCalls) {
                try {
                    const result = await apiCall();
                    results.push(result);
                } catch (error) {
                    const appError = ErrorHandler.handleApiError(error);
                    errorList.push(appError);
                    results.push(null);
                }
            }

            setErrors(errorList);
            setLoading(false);
            return results;
        },
        []
    );

    return {
        loading,
        errors,
        executeMultiple,
    };
}