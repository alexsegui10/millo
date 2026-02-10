import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
});

// Model schemas
export const createModelSchema = z.object({
    fullName: z.string().trim().min(1),
    status: z.enum(['ACTIVE', 'PENDING', 'PAUSED', 'ARCHIVED']).optional(),
    notes: z.string().trim().optional(),
});

export const updateModelSchema = z.object({
    fullName: z.string().trim().min(1).optional(),
    status: z.enum(['ACTIVE', 'PENDING', 'PAUSED', 'ARCHIVED']).optional(),
    notes: z.string().trim().optional(),
});

// Niche schemas
export const createNicheSchema = z.object({
    nicheName: z.string().trim().min(1),
    instagramHandle: z.string().trim().min(1).regex(/^[a-zA-Z0-9._]+$/, 'Instagram handle must contain only letters, numbers, dots, and underscores'),
    bio: z.string().trim().optional(),
    status: z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
});

export const updateNicheSchema = z.object({
    nicheName: z.string().trim().min(1).optional(),
    instagramHandle: z.string().trim().min(1).regex(/^[a-zA-Z0-9._]+$/, 'Instagram handle must contain only letters, numbers, dots, and underscores').optional(),
    bio: z.string().trim().optional(),
    status: z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
});

// Asset schemas
export const createAssetSchema = z.object({
    type: z.enum(['IMAGE', 'VIDEO']),
    url: z.string().trim().url(),
    tags: z.array(z.string().trim()).default([]),
    notes: z.string().trim().optional(),
});

export const updateAssetSchema = z.object({
    type: z.enum(['IMAGE', 'VIDEO']).optional(),
    url: z.string().trim().url().optional(),
    tags: z.array(z.string().trim()).optional(),
    notes: z.string().trim().optional(),
});

// Post schemas
export const createPostSchema = z.object({
    type: z.enum(['REEL', 'POST', 'STORY']),
    status: z.enum(['DRAFT', 'SCHEDULED', 'POSTED']).default('DRAFT'),
    caption: z.string().trim().transform(val => val === '' ? undefined : val).optional(),
    hook: z.string().trim().transform(val => val === '' ? undefined : val).optional(),
    theme: z.string().trim().transform(val => val === '' ? undefined : val).optional(),
    scheduledAt: z.coerce.date().optional(),
    assetIds: z.array(z.string()).optional(),
}).refine((data) => {
    // If status is SCHEDULED, scheduledAt must be provided
    if (data.status === 'SCHEDULED' && !data.scheduledAt) {
        return false;
    }
    return true;
}, {
    message: 'scheduledAt is required when status is SCHEDULED',
    path: ['scheduledAt'],
}).refine((data) => {
    // scheduledAt cannot be in the past
    if (data.scheduledAt && data.scheduledAt < new Date()) {
        return false;
    }
    return true;
}, {
    message: 'scheduledAt cannot be in the past',
    path: ['scheduledAt'],
});

export const updatePostSchema = z.object({
    type: z.enum(['REEL', 'POST', 'STORY']).optional(),
    status: z.enum(['DRAFT', 'SCHEDULED', 'POSTED']).optional(),
    caption: z.string().trim().optional(),
    hook: z.string().trim().optional(),
    theme: z.string().trim().optional(),
    scheduledAt: z.coerce.date().optional(),
    postedAt: z.coerce.date().optional(),
    assetIds: z.array(z.string()).optional(),
}).refine((data) => {
    // If status is SCHEDULED, scheduledAt must be provided
    if (data.status === 'SCHEDULED' && !data.scheduledAt) {
        return false;
    }
    return true;
}, {
    message: 'scheduledAt is required when status is SCHEDULED',
    path: ['scheduledAt'],
}).refine((data) => {
    // postedAt cannot be in the future
    if (data.postedAt && data.postedAt > new Date()) {
        return false;
    }
    return true;
}, {
    message: 'postedAt cannot be in the future',
    path: ['postedAt'],
});

// Metrics schemas
export const postMetricSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((str: string) => new Date(str + "T00:00:00.000Z")),
    views: z.number().int().min(0).default(0),
    likes: z.number().int().min(0).default(0),
    comments: z.number().int().min(0).default(0),
    saves: z.number().int().min(0).default(0),
    shares: z.number().int().min(0).default(0),
    followersGained: z.number().int().default(0),
}).refine((data) => {
    // date cannot be in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date > today) {
        return false;
    }
    return true;
}, {
    message: 'Metric date cannot be in the future',
    path: ['date'],
});

export const accountMetricSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((str: string) => new Date(str + "T00:00:00.000Z")),
    followers: z.number().int().min(0),
    reach: z.number().int().min(0).default(0),
    impressions: z.number().int().min(0).default(0),
    profileVisits: z.number().int().min(0).default(0),
}).refine((data) => {
    // date cannot be in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date > today) {
        return false;
    }
    return true;
}, {
    message: 'Metric date cannot be in the future',
    path: ['date'],
});

// Idea schemas
export const createIdeaSchema = z.object({
    hook: z.string().trim().min(1),
    description: z.string().trim().optional(),
    format: z.string().trim().optional(),
    status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']).default('NEW'),
});

export const updateIdeaSchema = z.object({
    hook: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    format: z.string().trim().optional(),
    status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']).optional(),
});
