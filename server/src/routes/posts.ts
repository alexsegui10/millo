import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createPostSchema, updatePostSchema } from '../utils/validation';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /niches/:nicheId/posts
router.get('/niches/:nicheId/posts', async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const { status, type } = req.query;

        const where: any = { nicheId };

        if (status && ['DRAFT', 'SCHEDULED', 'POSTED'].includes(status as string)) {
            where.status = status;
        }

        if (type && ['REEL', 'POST', 'STORY'].includes(type as string)) {
            where.type = type;
        }

        const posts = await prisma.contentPost.findMany({
            where,
            include: {
                assets: {
                    include: {
                        asset: true,
                    },
                    orderBy: {
                        orderIndex: 'asc',
                    },
                },
                metrics: true,
                _count: {
                    select: {
                        assets: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            ok: true,
            data: posts,
        });
    } catch (error) {
        next(error);
    }
});

// GET /niches/:nicheId/used-assets
router.get('/niches/:nicheId/used-assets', async (req, res, next) => {
    try {
        const { nicheId } = req.params;

        const posts = await prisma.contentPost.findMany({
            where: { nicheId },
            include: { assets: { select: { assetId: true } } }
        });

        const usedAssetIds = [...new Set(posts.flatMap(post => post.assets.map(a => a.assetId)))];

        res.json({
            ok: true,
            data: usedAssetIds
        });
    } catch (error) {
        next(error);
    }
});

// POST /niches/:nicheId/posts
router.post('/niches/:nicheId/posts', async (req, res, next) => {
    try {
        const { nicheId } = req.params;

        console.log('🔵 Backend recibió:', req.body);
        const { assetIds, ...data } = createPostSchema.parse(req.body);
        console.log('🟢 Después de parse:', { data, assetIds });

        const post = await prisma.contentPost.create({
            data: {
                ...data,
                nicheId,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
                assets: assetIds
                    ? {
                        create: assetIds.map((assetId, index) => ({
                            assetId,
                            orderIndex: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                assets: {
                    include: {
                        asset: true,
                    },
                    orderBy: {
                        orderIndex: 'asc',
                    },
                },
            },
        });

        res.status(201).json({
            ok: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
});

// GET /posts/:id
router.get('/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await prisma.contentPost.findUnique({
            where: { id },
            include: {
                niche: {
                    select: {
                        id: true,
                        nicheName: true,
                        instagramHandle: true,
                    },
                },
                assets: {
                    include: {
                        asset: true,
                    },
                    orderBy: {
                        orderIndex: 'asc',
                    },
                },
                metrics: {
                    orderBy: {
                        date: 'desc',
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Post not found',
                    code: 'NOT_FOUND',
                },
            });
        }

        res.json({
            ok: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /posts/:id
router.patch('/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { assetIds, ...data } = updatePostSchema.parse(req.body);

        // If assetIds provided, update the associations
        if (assetIds) {
            await prisma.postAsset.deleteMany({
                where: { postId: id },
            });
        }

        const post = await prisma.contentPost.update({
            where: { id },
            data: {
                ...data,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
                postedAt: data.postedAt ? new Date(data.postedAt) : undefined,
                assets: assetIds
                    ? {
                        create: assetIds.map((assetId, index) => ({
                            assetId,
                            orderIndex: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                assets: {
                    include: {
                        asset: true,
                    },
                    orderBy: {
                        orderIndex: 'asc',
                    },
                },
            },
        });

        res.json({
            ok: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /posts/:id
router.delete('/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.contentPost.delete({
            where: { id },
        });

        res.json({
            ok: true,
            data: { id },
        });
    } catch (error) {
        next(error);
    }
});

// POST /posts/:id/mark-posted
router.post('/posts/:id/mark-posted', async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await prisma.contentPost.update({
            where: { id },
            data: {
                status: 'POSTED',
                postedAt: new Date(),
            },
            include: {
                assets: {
                    include: {
                        asset: true,
                    },
                },
            },
        });

        res.json({
            ok: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
