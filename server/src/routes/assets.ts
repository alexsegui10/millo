import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createAssetSchema, updateAssetSchema } from '../utils/validation';
import { upload } from '../middleware/upload';
import { CloudinaryService } from '../services/cloudinary';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// Initialize Cloudinary service (will be null if not configured)
let cloudinaryService: CloudinaryService | null = null;
try {
    cloudinaryService = new CloudinaryService();
} catch (error) {
    logger.warn('Cloudinary not configured, using local storage');
}

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

        let fileUrl: string;
        let cloudinaryId: string | undefined;

        // Try to upload to Cloudinary, fallback to local storage
        if (cloudinaryService) {
            try {
                const result = await cloudinaryService.uploadFile(file.path);
                fileUrl = result.url;
                cloudinaryId = result.id;

                // Delete local temporary file
                fs.unlinkSync(file.path);
                logger.info(`✅ Uploaded to Cloudinary: ${file.filename}`);
            } catch (error) {
                logger.error('Failed to upload to Cloudinary, using local storage:', error);
                fileUrl = `/uploads/${file.filename}`;
            }
        } else {
            // Use local storage
            fileUrl = `/uploads/${file.filename}`;
            logger.info(`💾 Saved locally: ${file.filename}`);
        }

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

        const asset = await prisma.asset.findUnique({
            where: { id },
        });

        if (!asset) {
            return res.status(404).json({
                ok: false,
                error: { message: 'Asset not found', code: 'NOT_FOUND' }
            });
        }

        // Delete from Cloudinary if URL is a Cloudinary URL
        if (cloudinaryService && asset.url.includes('cloudinary.com')) {
            try {
                const publicId = CloudinaryService.extractPublicId(asset.url);
                if (publicId) {
                    await cloudinaryService.deleteFile(publicId);
                    logger.info(`🗑️  Deleted from Cloudinary: ${publicId}`);
                }
            } catch (error) {
                logger.error('Failed to delete from Cloudinary:', error);
                // Continue with database deletion even if Cloudinary deletion fails
            }
        } else if (asset.url.startsWith('/uploads/')) {
            // Delete local file
            const filePath = path.join(__dirname, '../../', asset.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                logger.info(`🗑️  Deleted local file: ${asset.url}`);
            }
        }

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
