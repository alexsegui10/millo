import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import z from 'zod';

const router = Router();
const prisma = new PrismaClient();

// GET /dashboard/summary - Aggregated dashboard data
router.get('/summary', authMiddleware, async (req, res, next) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    try {
        // KPIs
        const activeModels = await prisma.model.count({ where: { status: 'ACTIVE' } });
        const activeNiches = await prisma.niche.count({ where: { status: 'ACTIVE' } });
        const postsLast7Days = await prisma.contentPost.count({
            where: {
                postedAt: { gte: sevenDaysAgo }
            }
        });

        // Followers growth calculation
        const niches = await prisma.niche.findMany({
            where: { status: 'ACTIVE' },
            select: { id: true }
        });

        let followersGrowth7Days = 0;
        for (const niche of niches) {
            const latest = await prisma.accountMetricsDaily.findFirst({
                where: { nicheId: niche.id },
                orderBy: { date: 'desc' }
            });

            const sevenDaysAgoMetric = await prisma.accountMetricsDaily.findFirst({
                where: {
                    nicheId: niche.id,
                    date: { lte: sevenDaysAgo }
                },
                orderBy: { date: 'desc' }
            });

            if (latest && sevenDaysAgoMetric) {
                followersGrowth7Days += (latest.followers - sevenDaysAgoMetric.followers);
            }
        }

        // Latest posts (10 most recent by postedAt)
        const latestPosts = await prisma.contentPost.findMany({
            where: { postedAt: { not: null } },
            orderBy: { postedAt: 'desc' },
            take: 10,
            include: {
                niche: {
                    include: {
                        model: { select: { id: true, fullName: true } }
                    }
                }
            }
        });

        // Top posts by saves_rate
        const topPosts = await prisma.$queryRaw`
            SELECT DISTINCT ON (cp.id)
                cp.id, cp.type, cp.hook, cp.theme, cp."nicheId",
                pm.views, pm.saves,
                CASE WHEN pm.views > 0 THEN (pm.saves::float / pm.views::float) * 100 ELSE 0 END as saves_rate,
                n."nicheName",
                m."fullName" as "modelName"
            FROM "ContentPost" cp
            LEFT JOIN "PostMetric" pm ON pm."postId" = cp.id
            LEFT JOIN "Niche" n ON n.id = cp."nicheId"
            LEFT JOIN "Model" m ON m.id = n."modelId"
            WHERE pm.id IS NOT NULL AND cp."postedAt" IS NOT NULL
            ORDER BY cp.id, pm.date DESC, saves_rate DESC
            LIMIT 10
        ` as any[];

        // Alerts
        const scheduledToday = await prisma.contentPost.count({
            where: {
                status: 'SCHEDULED',
                scheduledAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        });

        const nichesWithoutMetrics = await prisma.niche.count({
            where: {
                status: 'ACTIVE',
                dailyMetrics: {
                    none: {
                        date: { gte: sevenDaysAgo }
                    }
                }
            }
        });

        res.json({
            ok: true,
            data: {
                kpis: {
                    activeModels,
                    activeNiches,
                    postsLast7Days,
                    followersGrowth7Days
                },
                latestPosts,
                topPosts: topPosts.map(p => ({
                    ...p,
                    saves_rate: parseFloat(p.saves_rate || '0')
                })),
                alerts: {
                    scheduledToday,
                    nichesWithoutMetrics
                }
            }
        });
    } catch (error: any) {
        next(error);
    }
});

export default router;
