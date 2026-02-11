import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { logger } from '../utils/logger';

export class CloudinaryService {
    constructor() {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            logger.warn('⚠️  Cloudinary credentials not configured. Using local storage.');
            throw new Error('Cloudinary not configured');
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        logger.info('✅ Cloudinary service initialized');
        logger.info(`☁️  Cloud name: ${cloudName}`);
    }

    /**
     * Upload a file to Cloudinary
     * @param filePath Local path to the file
     * @param folder Folder in Cloudinary (default: 'millo')
     * @returns Object with public URL and ID
     */
    async uploadFile(filePath: string, folder: string = 'millo') {
        try {
            logger.info(`📤 Uploading ${filePath} to Cloudinary (Calidad 100%)...`);

            // Upload file - Cloudinary stores original without modification
            const result = await cloudinary.uploader.upload(filePath, {
                folder,
                resource_type: 'auto',
                type: 'upload',
            });

            // Generate URL with q_100 to deliver highest quality (no compression)
            const publicId = result.public_id;
            const resourceType = result.resource_type; // 'image' or 'video'

            // Build URL with quality 100 transformation
            let optimizedUrl: string;
            if (resourceType === 'video') {
                // For videos, use original without transformations
                optimizedUrl = result.secure_url;
            } else {
                // For images, ensure quality 100
                optimizedUrl = cloudinary.url(publicId, {
                    quality: 100,
                    secure: true
                });
            }

            logger.info(`✅ File uploaded successfully: ${result.public_id}`);
            logger.info(`📊 Size: ${(result.bytes / 1024 / 1024).toFixed(2)} MB | Format: ${result.format}`);

            return {
                id: result.public_id,
                url: optimizedUrl, // URL with q_100 for no compression
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
            };
        } catch (error) {
            logger.error('Failed to upload file to Cloudinary:', error);
            throw error;
        }
    }

    /**
     * Delete a file from Cloudinary
     * @param publicId Public ID of the file
     */
    async deleteFile(publicId: string) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            logger.info(`🗑️  Deleted from Cloudinary: ${publicId} (${result.result})`);
        } catch (error) {
            logger.error(`Failed to delete file ${publicId}:`, error);
            throw error;
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param url Cloudinary URL
     * @returns Public ID or null
     */
    static extractPublicId(url: string): string | null {
        // URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/filename.ext
        const match = url.match(/\/v\d+\/(.+)\.\w+$/);
        return match ? match[1] : null;
    }
}
