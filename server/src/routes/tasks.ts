import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Schema Validation
const createTaskSchema = z.object({
    text: z.string().trim().min(1),
    type: z.enum(['DAILY', 'ONE_OFF']).default('ONE_OFF'),
});

const updateTaskSchema = z.object({
    isDone: z.boolean(),
});

// GET /tasks - List all tasks (optionally filter by type/date)
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const { type } = req.query;

        // For DAILY tasks, we might want to reset 'isDone' if the last update was yesterday?
        // For now, let's just return them as is. Frontend handles the "reset" visualization or we do it via cron.
        // A simpler approach for MVP: Client manually unchecks or we auto-uncheck on fetch if date < today.
        // Let's implement auto-reset for DAILY tasks if they were checked before today.

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch tasks
        const tasks = await prisma.task.findMany({
            where: type ? { type: type as any } : undefined,
            orderBy: { createdAt: 'desc' },
        });

        // Auto-reset DAILY tasks logic (Server-side lazy reset)
        const updatedTasks = await Promise.all(tasks.map(async (task) => {
            if (task.type === 'DAILY' && task.isDone && task.updatedAt < today) {
                return prisma.task.update({
                    where: { id: task.id },
                    data: { isDone: false },
                });
            }
            return task;
        }));

        res.json({ ok: true, data: updatedTasks });
    } catch (error) {
        next(error);
    }
});

// POST /tasks - Create a new task
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const body = createTaskSchema.parse(req.body);
        const task = await prisma.task.create({
            data: {
                text: body.text,
                type: body.type,
            },
        });
        res.json({ ok: true, data: task });
    } catch (error) {
        next(error);
    }
});

// PATCH /tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = updateTaskSchema.parse(req.body);

        const task = await prisma.task.update({
            where: { id },
            data: { isDone: body.isDone },
        });

        res.json({ ok: true, data: task });
    } catch (error) {
        next(error);
    }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id } });
        res.json({ ok: true, data: { id } });
    } catch (error) {
        next(error);
    }
});

export default router;
