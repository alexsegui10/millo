import { getAuthToken, removeAuthToken } from './auth';
import type { ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const token = getAuthToken();

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string>),
        };

        // Only set Content-Type if body is not FormData
        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                removeAuthToken();
                window.location.href = '/login';
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            return {
                ok: false,
                error: {
                    message: 'Network error occurred',
                    code: 'NETWORK_ERROR',
                },
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
        });
    }

    async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient(API_URL);
