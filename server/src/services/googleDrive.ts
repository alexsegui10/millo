import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

const CREDENTIALS_PATH = path.join(__dirname, '../../google-credentials.json');

export class GoogleDriveService {
    private drive;
    private folderId: string;

    constructor() {
        this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

        logger.info(`🔍 Checking Google Drive credentials at: ${CREDENTIALS_PATH}`);
        logger.info(`🔍 Folder ID from env: ${this.folderId || 'NOT SET'}`);

        // Check if credentials file exists
        if (!fs.existsSync(CREDENTIALS_PATH)) {
            logger.warn('⚠️  Google Drive credentials not found. Using local storage.');
            logger.warn(`⚠️  Expected path: ${CREDENTIALS_PATH}`);
            throw new Error('Google Drive credentials not configured');
        }

        logger.info('✅ Credentials file found');

        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: CREDENTIALS_PATH,
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });

            this.drive = google.drive({ version: 'v3', auth });
            logger.info('✅ Google Drive service initialized');
            logger.info(`📁 Uploads will go to folder ID: ${this.folderId}`);
        } catch (error) {
            logger.error('Failed to initialize Google Drive:', error);
            throw error;
        }
    }

    /**
     * Upload a file to Google Drive
     * @param filePath Local path to the file
     * @param fileName Name for the file in Drive
     * @param mimeType MIME type of the file
     * @returns Object with file ID and public URL
     */
    async uploadFile(filePath: string, fileName: string, mimeType: string) {
        try {
            const fileMetadata = {
                name: fileName,
                parents: this.folderId ? [this.folderId] : [],
            };

            const media = {
                mimeType,
                body: fs.createReadStream(filePath),
            };

            logger.info(`📤 Uploading ${fileName} to Google Drive...`);

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media,
                fields: 'id, webViewLink, webContentLink',
            });

            const fileId = response.data.id!;

            // Make the file publicly accessible
            await this.drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            // Generate direct download URL
            const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

            logger.info(`✅ File uploaded successfully: ${fileId}`);

            return {
                id: fileId,
                url: directUrl,
                webViewLink: response.data.webViewLink || '',
            };
        } catch (error) {
            logger.error('Failed to upload file to Google Drive:', error);
            throw error;
        }
    }

    /**
     * Delete a file from Google Drive
     * @param fileId The ID of the file to delete
     */
    async deleteFile(fileId: string) {
        try {
            await this.drive.files.delete({ fileId });
            logger.info(`🗑️  Deleted file from Google Drive: ${fileId}`);
        } catch (error) {
            logger.error(`Failed to delete file ${fileId}:`, error);
            throw error;
        }
    }

    /**
     * Extract file ID from a Google Drive URL
     * @param url Google Drive URL
     * @returns File ID or null
     */
    static extractFileId(url: string): string | null {
        const match = url.match(/[?&]id=([^&]+)/);
        return match ? match[1] : null;
    }
}
