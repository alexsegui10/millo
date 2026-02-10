import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createIdeaSchema, updateIdeaSchema } from '../utils/validation';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /niches/:nicheId/ideas
router.get('/niches/:nicheId/ideas', async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const { status } = req.query;

        const where: any = { nicheId };

        if (status && ['NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].includes(status as string)) {
            where.status = status;
        }

        const ideas = await prisma.idea.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            ok: true,
            data: ideas,
        });
    } catch (error) {
        next(error);
    }
});

// POST /niches/:nicheId/ideas
router.post('/niches/:nicheId/ideas', async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const data = createIdeaSchema.parse(req.body);

        const idea = await prisma.idea.create({
            data: {
                ...data,
                nicheId,
            },
        });

        res.status(201).json({
            ok: true,
            data: idea,
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /ideas/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateIdeaSchema.parse(req.body);

        const idea = await prisma.idea.update({
            where: { id },
            data,
        });

        res.json({
            ok: true,
            data: idea,
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /ideas/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.idea.delete({
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
