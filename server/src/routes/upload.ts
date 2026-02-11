import { Router } from 'express';
import { upload } from '../middleware/upload';
import { CloudinaryService } from '../services/cloudinary';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

const router = Router();

// Initialize Cloudinary service
let cloudinaryService: CloudinaryService | null = null;
try {
    cloudinaryService = new CloudinaryService();
} catch (error) {
    logger.warn('Cloudinary not configured, using local storage');
}

router.use(authMiddleware);

// POST /upload - Generic file upload
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                ok: false,
                error: { message: 'No file uploaded', code: 'NO_FILE' }
            });
        }

        let fileUrl: string;

        // Try to upload to Cloudinary, fallback to local storage
        if (cloudinaryService) {
            try {
                // Determine folder based on usage if provided in query, default to millo/uploads
                const folder = req.query.folder ? `millo/${req.query.folder}` : 'millo/uploads';

                const result = await cloudinaryService.uploadFile(file.path, folder);
                fileUrl = result.url;

                // Delete local temporary file
                fs.unlinkSync(file.path);
                logger.info(`✅ Generic upload to Cloudinary: ${file.filename}`);
            } catch (error) {
                logger.error('Failed to upload to Cloudinary, using local storage:', error);
                fileUrl = `/uploads/${file.filename}`;
            }
        } else {
            // Use local storage
            fileUrl = `/uploads/${file.filename}`;
            logger.info(`💾 Saved locally: ${file.filename}`);
        }

        res.status(201).json({
            ok: true,
            data: {
                url: fileUrl,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            }
        });
    } catch (error) {
        // Cleanup file if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
});

export default router;
