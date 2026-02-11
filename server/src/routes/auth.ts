import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../utils/validation';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid credentials',
                    code: 'INVALID_CREDENTIALS',
                },
            });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        console.log(`[Login Info] User: ${email}, Found: true, PassValid: ${isValid}`);

        if (!isValid) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid credentials',
                    code: 'INVALID_CREDENTIALS',
                },
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }

        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: '7d',
        });

        res.json({
            ok: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('[Login Error]', error);
        next(error);
    }
});

// GET /auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'User not found',
                    code: 'NOT_FOUND',
                },
            });
        }

        res.json({
            ok: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
