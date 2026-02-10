// Helper function to validate file extensions for assets
const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const VALID_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];

export const getAssetTypeFromUrl = (url: string): 'IMAGE' | 'VIDEO' | null => {
    const extension = url.toLowerCase().substring(url.lastIndexOf('.'));

    if (VALID_IMAGE_EXTENSIONS.includes(extension)) {
        return 'IMAGE';
    }

    if (VALID_VIDEO_EXTENSIONS.includes(extension)) {
        return 'VIDEO';
    }

    return null;
};

export const isValidAssetUrl = (url: string, type: 'IMAGE' | 'VIDEO'): boolean => {
    const extension = url.toLowerCase().substring(url.lastIndexOf('.'));

    if (type === 'IMAGE') {
        return VALID_IMAGE_EXTENSIONS.includes(extension);
    }

    if (type === 'VIDEO') {
        return VALID_VIDEO_EXTENSIONS.includes(extension);
    }

    return false;
};

export const VALID_EXTENSIONS = {
    IMAGE: VALID_IMAGE_EXTENSIONS,
    VIDEO: VALID_VIDEO_EXTENSIONS,
};
