import { api } from './api';
import type {
    Model,
    Niche,
    Asset,
    ContentPost,
    PostMetric,
    AccountMetricsDaily,
    Idea,
    Task,
    TaskType,
} from '../types';

// Models
export const getModel = (id: string) => api.get<Model>(`/models/${id}`);
export const listModels = () => api.get<Model[]>('/models');
export const createModel = (data: any) => api.post<Model>('/models', data);
export const updateModel = (id: string, data: any) => api.patch<Model>(`/models/${id}`, data);
export const deleteModel = (id: string) => api.delete<{ id: string }>(`/models/${id}`);

// Niches
export const listNichesByModel = (modelId: string) =>
    api.get<Niche[]>(`/models/${modelId}/niches`);
export const getNiche = (id: string) => api.get<Niche>(`/niches/${id}`);
export const createNiche = (modelId: string, data: any) =>
    api.post<Niche>(`/models/${modelId}/niches`, data);
export const updateNiche = (id: string, data: any) => api.patch<Niche>(`/niches/${id}`, data);
export const deleteNiche = (id: string) => api.delete<{ id: string }>(`/niches/${id}`);

// Assets
export const listAssets = (nicheId: string, params?: { type?: string; tag?: string; q?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<Asset[]>(`/niches/${nicheId}/assets${query ? `?${query}` : ''}`);
};

export const createAsset = async (nicheId: string, file: File, notes?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) formData.append('notes', notes);

    return api.post<Asset>(`/niches/${nicheId}/assets`, formData);
};

export const updateAsset = (id: string, data: any) => api.patch<Asset>(`/assets/${id}`, data);
export const deleteAsset = (id: string) => api.delete<{ id: string }>(`/assets/${id}`);

// Posts
export const listPostsByNiche = (nicheId: string, params?: { status?: string; type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<ContentPost[]>(`/niches/${nicheId}/posts${query ? `?${query}` : ''}`);
};
export const getPost = (id: string) => api.get<ContentPost>(`/posts/${id}`);
export const createPost = (nicheId: string, data: any) =>
    api.post<ContentPost>(`/niches/${nicheId}/posts`, data);
export const updatePost = (id: string, data: any) =>
    api.patch<ContentPost>(`/posts/${id}`, data);
export const deletePost = (id: string) => api.delete<{ id: string }>(`/posts/${id}`);
export const markPosted = (id: string) => api.post<ContentPost>(`/posts/${id}/mark-posted`);
export const getUsedAssets = (nicheId: string) => api.get<string[]>(`/niches/${nicheId}/used-assets`);

// Post Metrics
export const upsertPostMetrics = (postId: string, data: any) =>
    api.post<PostMetric>(`/metrics/posts/${postId}/metrics`, data);
export const listPostMetrics = (postId: string) =>
    api.get<PostMetric[]>(`/metrics/posts/${postId}/metrics`);

// Daily Metrics
export const upsertDailyMetrics = (nicheId: string, data: any) =>
    api.post<AccountMetricsDaily>(`/metrics/niches/${nicheId}/metrics-daily`, data);
export const listDailyMetrics = (nicheId: string, params?: { from?: string; to?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<AccountMetricsDaily[]>(
        `/metrics/niches/${nicheId}/metrics-daily${query ? `?${query}` : ''}`
    );
};

// Ideas
export const listIdeas = (nicheId: string, params?: { status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<Idea[]>(`/niches/${nicheId}/ideas${query ? `?${query}` : ''}`);
};
export const createIdea = (nicheId: string, data: any) =>
    api.post<Idea>(`/niches/${nicheId}/ideas`, data);
export const updateIdea = (id: string, data: any) => api.patch<Idea>(`/ideas/${id}`, data);
export const deleteIdea = (id: string) => api.delete<{ id: string }>(`/ideas/${id}`);

// General Upload
export const uploadFile = async (file: File, folder: string = 'millo/uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string; filename: string; mimetype: string; size: number }>(
        `/upload?folder=${folder}`,
        formData
    );
};

// Tasks
export const listTasks = (params?: { type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<Task[]>(`/tasks${query ? `?${query}` : ''}`);
};
export const createTask = (data: { text: string; type: TaskType }) => api.post<Task>('/tasks', data);
export const toggleTask = (id: string, isDone: boolean) => api.patch<Task>(`/tasks/${id}/toggle`, { isDone });
export const deleteTask = (id: string) => api.delete<{ id: string }>(`/tasks/${id}`);
