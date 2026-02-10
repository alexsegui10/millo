import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { postMetricSchema, accountMetricSchema } from '../utils/validation';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// POST /posts/:postId/metrics (upsert)
router.post('/posts/:postId/metrics', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const data = postMetricSchema.parse(req.body);

        const metric = await prisma.postMetric.upsert({
            where: {
                postId_date: {
                    postId,
                    date: new Date(data.date),
                },
            },
            update: {
                views: data.views,
                likes: data.likes,
                comments: data.comments,
                saves: data.saves,
                shares: data.shares,
                followersGained: data.followersGained,
            },
            create: {
                postId,
                date: new Date(data.date),
                views: data.views,
                likes: data.likes,
                comments: data.comments,
                saves: data.saves,
                shares: data.shares,
                followersGained: data.followersGained,
            },
        });

        res.json({
            ok: true,
            data: metric,
        });
    } catch (error) {
        next(error);
    }
});

// GET /posts/:postId/metrics
router.get('/posts/:postId/metrics', async (req, res, next) => {
    try {
        const { postId } = req.params;

        const metrics = await prisma.postMetric.findMany({
            where: { postId },
            orderBy: {
                date: 'desc',
            },
        });

        res.json({
            ok: true,
            data: metrics,
        });
    } catch (error) {
        next(error);
    }
});

// POST /niches/:nicheId/metrics-daily (upsert)
router.post('/niches/:nicheId/metrics-daily', async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const data = accountMetricSchema.parse(req.body);

        const metric = await prisma.accountMetricsDaily.upsert({
            where: {
                nicheId_date: {
                    nicheId,
                    date: new Date(data.date),
                },
            },
            update: {
                followers: data.followers,
                reach: data.reach,
                impressions: data.impressions,
                profileVisits: data.profileVisits,
            },
            create: {
                nicheId,
                date: new Date(data.date),
                followers: data.followers,
                reach: data.reach,
                impressions: data.impressions,
                profileVisits: data.profileVisits,
            },
        });

        res.json({
            ok: true,
            data: metric,
        });
    } catch (error) {
        next(error);
    }
});

// GET /niches/:nicheId/metrics-daily
router.get('/niches/:nicheId/metrics-daily', async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const { from, to } = req.query;

        const where: any = { nicheId };

        if (from || to) {
            where.date = {};
            if (from) where.date.gte = new Date(from as string);
            if (to) where.date.lte = new Date(to as string);
        }

        const metrics = await prisma.accountMetricsDaily.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
        });

        res.json({
            ok: true,
            data: metrics,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
