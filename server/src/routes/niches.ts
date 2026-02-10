import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createNicheSchema, updateNicheSchema } from '../utils/validation';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /niches - Get ALL niches (global) with model and counts
router.get('/', async (req, res, next) => {
    try {
        const niches = await prisma.niche.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                model: { select: { id: true, fullName: true } },
                _count: {
                    select: { assets: true, posts: true, ideas: true }
                }
            }
        });

        res.json({ ok: true, data: niches });
    } catch (error) {
        next(error);
    }
});

// GET /models/:modelId/niches
router.get('/models/:modelId/niches', async (req, res, next) => {
    try {
        const { modelId } = req.params;

        const niches = await prisma.niche.findMany({
            where: { modelId },
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
        });

        res.json({
            ok: true,
            data: niches,
        });
    } catch (error) {
        next(error);
    }
});

// POST /models/:modelId/niches
router.post('/models/:modelId/niches', async (req, res, next) => {
    try {
        const { modelId } = req.params;
        const data = createNicheSchema.parse(req.body);

        const niche = await prisma.niche.create({
            data: {
                ...data,
                modelId,
            },
            include: {
                _count: {
                    select: {
                        posts: true,
                        assets: true,
                    },
                },
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

// GET /niches/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const niche = await prisma.niche.findUnique({
            where: { id },
            include: {
                model: {
                    select: {
                        id: true,
                        fullName: true,
                        status: true,
                    },
                },
                _count: {
                    select: {
                        posts: true,
                        assets: true,
                        ideas: true,
                    },
                },
            },
        });

        if (!niche) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Niche not found',
                    code: 'NOT_FOUND',
                },
            });
        }

        res.json({
            ok: true,
            data: niche,
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /niches/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateNicheSchema.parse(req.body);

        const niche = await prisma.niche.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        posts: true,
                        assets: true,
                    },
                },
            },
        });

        res.json({
            ok: true,
            data: niche,
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /niches/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.niche.delete({
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

export default router;
