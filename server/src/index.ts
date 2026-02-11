import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import modelRoutes from './routes/models';
import nicheRoutes from './routes/niches';
import assetRoutes from './routes/assets';
import postRoutes from './routes/posts';
import metricRoutes from './routes/metrics';
import ideaRoutes from './routes/ideas';
import dashboardRoutes from './routes/dashboard';
import contentRoutes from './routes/content';
import uploadRoutes from './routes/upload';
import { errorHandler } from './middleware/errorHandler';
import { ALLOWED_ORIGINS, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS, AUTH_RATE_LIMIT_MAX } from './config/constants';
import { logger, requestLogger } from './utils/logger';
import { registerShutdownHandlers } from './utils/shutdown';

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Helmet - sets various HTTP headers
app.use(helmet());

// Security: CORS with whitelist
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// Security: Rate limiting - general
const generalLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: {
        ok: false,
        error: {
            message: 'Too many requests from this IP, please try again after 15 minutes',
            code: 'RATE_LIMIT_EXCEEDED',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security: Rate limiting - strict for auth endpoints
const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: AUTH_RATE_LIMIT_MAX,
    message: {
        ok: false,
        error: {
            message: 'Too many login attempts from this IP, please try again after 15 minutes',
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS - Must be before routes
app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    })
);

// Serve uploaded files BEFORE helmet with explicit CORS
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express.static(path.join(__dirname, '../uploads')));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(generalLimiter);
app.use(requestLogger);
app.use(express.json());

// Health check - robust with DB connectivity check
app.get('/health', async (req, res) => {
    try {
        // Check database connectivity
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            ok: true,
            message: 'OFM Agency Hub API is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: 'connected',
            uptime: process.uptime(),
        });
    } catch (error) {
        res.status(503).json({
            ok: false,
            message: 'Service unavailable - Database connection failed',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        });
    }
});

// Routes with specific rate limiting for auth
app.use('/auth', authLimiter, authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/content', contentRoutes);
app.use('/models', modelRoutes);
app.use('/niches', nicheRoutes);
app.use('/assets', assetRoutes); // For DELETE /assets/:id and PATCH /assets/:id
app.use('/', assetRoutes); // Mounted at root for /niches/:nicheId/assets paths
app.use('/', postRoutes);  // Mounted at root for /niches/:nicheId/posts paths
app.use('/', ideaRoutes);  // Mounted at root for /niches/:nicheId/ideas paths
app.use('/metrics', metricRoutes);
app.use('/upload', uploadRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Register graceful shutdown handlers
registerShutdownHandlers();

app.listen(PORT, () => {
    logger.info(`✅ Server running on http://localhost:${PORT}`);
    logger.info(`🔒 Security: Helmet, CORS, Rate Limiting enabled`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔑 CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔒 Security: Helmet, CORS, Rate Limiting enabled`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
