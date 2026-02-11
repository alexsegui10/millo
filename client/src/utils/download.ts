/**
 * Download a file from a URL
 * Works for both local and Cloudinary URLs
 */
export const downloadFile = async (url: string, filename?: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        // Create a temporary download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        // Extract filename from URL if not provided
        if (!filename) {
            const urlParts = url.split('/');
            filename = urlParts[urlParts.length - 1].split('?')[0];
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error al descargar el archivo');
    }
};
