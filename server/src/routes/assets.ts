import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createAssetSchema, updateAssetSchema } from '../utils/validation';
import { upload } from '../middleware/upload';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /niches/:nicheId/assets
router.get('/niches/:nicheId/assets', async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const { type, tag, q } = req.query;

        const where: any = { nicheId };

        if (type && (type === 'IMAGE' || type === 'VIDEO')) {
            where.type = type;
        }

        if (tag) {
            where.tags = {
                has: tag as string,
            };
        }

        if (q) {
            where.OR = [
                { notes: { contains: q as string, mode: 'insensitive' } },
                { tags: { hasSome: [q as string] } },
            ];
        }

        const assets = await prisma.asset.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            ok: true,
            data: assets,
        });
    } catch (error) {
        next(error);
    }
});

// POST /niches/:nicheId/assets - Upload file to create asset
router.post('/niches/:nicheId/assets', upload.single('file'), async (req, res, next) => {
    try {
        const { nicheId } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                ok: false,
                error: { message: 'No file uploaded', code: 'NO_FILE' }
            });
        }

        // Determine asset type from mimetype
        const type = file.mimetype.startsWith('image/') ? 'IMAGE' : 'VIDEO';

        // File URL will be served from /uploads endpoint
        const fileUrl = `/uploads/${file.filename}`;

        const asset = await prisma.asset.create({
            data: {
                nicheId,
                type,
                url: fileUrl,
                notes: req.body.notes || '',
            },
        });

        res.status(201).json({
            ok: true,
            data: asset,
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /assets/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateAssetSchema.parse(req.body);

        const asset = await prisma.asset.update({
            where: { id },
            data,
        });

        res.json({
            ok: true,
            data: asset,
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /assets/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.asset.delete({
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
