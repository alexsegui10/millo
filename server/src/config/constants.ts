// Security and Configuration Constants
export const BCRYPT_ROUNDS = 12;

export const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

export const JWT_EXPIRATION = '7d';
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 999999; // Unlimited for development
export const AUTH_RATE_LIMIT_MAX = 999999; // Unlimited for development
