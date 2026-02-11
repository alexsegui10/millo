// src/types/index.ts

export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER';

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export type ModelStatus = 'ACTIVE' | 'PENDING' | 'PAUSED' | 'ARCHIVED';
export type NicheStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type AssetType = 'IMAGE' | 'VIDEO';
export type PostType = 'REEL' | 'POST' | 'STORY';
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'POSTED';
export type IdeaStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
export type TaskType = 'DAILY' | 'ONE_OFF';

export interface Model {
    id: string;
    fullName: string;
    status: ModelStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    nicheCount?: number;
    niches?: Niche[];
}

export interface Niche {
    id: string;
    modelId: string;
    nicheName: string;
    instagramHandle: string;
    imageUrl?: string;
    bio?: string;
    status: NicheStatus;
    createdAt: string;
    updatedAt: string;
    model?: {
        id: string;
        fullName: string;
        status: ModelStatus;
    };
    _count?: {
        posts: number;
        assets: number;
        ideas: number;
    };
}

export interface Asset {
    id: string;
    nicheId: string;
    type: AssetType;
    url: string;
    tags: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContentPost {
    id: string;
    nicheId: string;
    type: PostType;
    status: PostStatus;
    caption?: string;
    hook?: string;
    theme?: string;
    scheduledAt?: string;
    postedAt?: string;
    createdAt: string;
    updatedAt: string;
    assets?: PostAsset[];
    metrics?: PostMetric[];
    niche?: {
        id: string;
        nicheName: string;
        instagramHandle: string;
    };
}

export interface PostAsset {
    id: string;
    postId: string;
    assetId: string;
    orderIndex: number;
    asset: Asset;
}

export interface PostMetric {
    id: string;
    postId: string;
    date: string;
    views: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    followersGained: number;
}

export interface AccountMetricsDaily {
    id: string;
    nicheId: string;
    date: string;
    followers: number;
    reach: number;
    impressions: number;
    profileVisits: number;
}

export interface Idea {
    id: string;
    nicheId: string;
    hook: string;
    description?: string;
    format?: string;
    status: IdeaStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    ok: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}
