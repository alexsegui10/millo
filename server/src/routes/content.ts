import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /content/posts - Get all posts (global) with niche and model info
router.get('/posts', authMiddleware, async (req, res, next) => {
    try {
        const posts = await prisma.contentPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                niche: {
                    include: {
                        model: { select: { id: true, fullName: true } }
                    }
                },
                _count: {
                    select: { assets: true, metrics: true }
                }
            }
        });

        res.json({ ok: true, data: posts });
    } catch (error: any) {
        next(error);
    }
});

export default router;
