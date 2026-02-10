import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createModelSchema, updateModelSchema } from '../utils/validation';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

// GET /models
router.get('/', async (req, res, next) => {
    try {
        const models = await prisma.model.findMany({
            include: {
                niches: {
                    select: {
                        id: true,
                    },
                },
                _count: {
                    select: {
                        niches: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            ok: true,
            data: models.map((model) => ({
                ...model,
                nicheCount: model._count.niches,
            })),
        });
    } catch (error) {
        next(error);
    }
});

// POST /models
router.post('/', async (req, res, next) => {
    try {
        const data = createModelSchema.parse(req.body);

        const model = await prisma.model.create({
            data,
            include: {
                _count: {
                    select: {
                        niches: true,
                    },
                },
            },
        });

        res.status(201).json({
            ok: true,
            data: {
                ...model,
                nicheCount: model._count.niches,
            },
        });
    } catch (error) {
        next(error);
    }
});

// GET /models/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const model = await prisma.model.findUnique({
            where: { id },
            include: {
                niches: {
                    include: {
                        _count: {
                            select: {
                                posts: true,
                                assets: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        niches: true,
                    },
                },
            },
        });

        if (!model) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Model not found',
                    code: 'NOT_FOUND',
                },
            });
        }

        res.json({
            ok: true,
            data: {
                ...model,
                nicheCount: model._count.niches,
            },
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /models/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateModelSchema.parse(req.body);

        const model = await prisma.model.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        niches: true,
                    },
                },
            },
        });

        res.json({
            ok: true,
            data: {
                ...model,
                nicheCount: model._count.niches,
            },
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /models/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.model.delete({
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

// GET /models/:modelId/niches - Get all niches for a specific model
router.get('/:modelId/niches', async (req, res, next) => {
    try {
        const { modelId } = req.params;

        const niches = await prisma.niche.findMany({
            where: { modelId },
            include: {
                model: { select: { id: true, fullName: true } },
                _count: {
                    select: {
                        posts: true,
                        assets: true,
                        ideas: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            ok: true,
            data: niches,
        });
    } catch (error) {
        next(error);
    }
});

// POST /models/:modelId/niches - Create niche for a specific model
router.post('/:modelId/niches', async (req, res, next) => {
    try {
        const { modelId } = req.params;
        const { nicheName, instagramHandle, bio, status } = req.body;

        if (!nicheName || !instagramHandle) {
            return res.status(400).json({
                ok: false,
                error: { message: 'nicheName and instagramHandle are required', code: 'VALIDATION_ERROR' }
            });
        }

        const niche = await prisma.niche.create({
            data: {
                modelId,
                nicheName,
                instagramHandle,
                bio: bio || '',
                status: status || 'ACTIVE',
            },
            include: {
                model: { select: { id: true, fullName: true } },
                _count: {
                    select: { posts: true, assets: true, ideas: true }
                }
            },
        });

        res.status(201).json({
            ok: true,
            data: niche,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
