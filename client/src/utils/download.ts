/**
 * Download a file from a URL
 * Works for both local and Cloudinary URLs
 */
export const downloadFile = async (url: string, filename?: string) => {
    try {
        // Check if iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS) {
            // iOS doesn't support the download attribute or blob downloads well
            // Best practice is to open in new tab and let user save manually
            window.open(url, '_blank');
            return;
        }

        const response = await fetch(url);
        const blob = await response.blob();

        // Create a temporary download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        if (filename) {
            link.download = filename;
        } else {
            // Extract filename from URL if not provided
            const urlParts = url.split('/');
            link.download = urlParts[urlParts.length - 1].split('?')[0];
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);
    } catch (error) {
        console.error('Error downloading file:', error);
        // Fallback: just open the URL
        window.open(url, '_blank');
    }
};
