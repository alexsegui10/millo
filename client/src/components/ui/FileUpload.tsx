import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from './Button';

interface FileUploadProps {
    accept?: string;
    maxSize?: number; // in MB
    onUpload: (file: File) => Promise<void>;
    uploading?: boolean;
}

export function FileUpload({
    accept = 'image/*,video/*',
    maxSize = 100,
    onUpload,
    uploading = false
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`El tamaño del archivo excede el límite de ${maxSize}MB`);
            return;
        }

        setSelectedFile(file);

        // Create preview for images/videos
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        await onUpload(selectedFile);

        // Reset after successful upload
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {!preview ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                        }`}
                >
                    <div className="flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-5xl text-gray-400">
                            cloud_upload
                        </span>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                Arrastra y suelta tu archivo aquí
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                o haz click para buscar
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Imágenes y videos hasta {maxSize}MB
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {selectedFile?.type.startsWith('image/') ? (
                            <img src={preview} alt="Preview" className="w-full h-auto max-h-96 object-contain" />
                        ) : (
                            <video src={preview} controls className="w-full h-auto max-h-96" />
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium">{selectedFile?.name}</p>
                            <p>{(selectedFile!.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={uploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? 'Subiendo...' : 'Subir'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
