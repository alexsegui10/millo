import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from './Button';

interface FileUploadProps {
    accept?: string;
    maxSize?: number; // in MB
    onUpload: (file: File) => Promise<void>;
    uploading?: boolean;
    multiple?: boolean;
}

export function FileUpload({
    accept = 'image/*,video/*',
    maxSize = 100,
    onUpload,
    uploading = false,
    multiple = false
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
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

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(Array.from(files));
        }
    };

    const handleFiles = (files: File[]) => {
        // Filter by size
        const validFiles = files.filter(file => {
            if (file.size > maxSize * 1024 * 1024) {
                alert(`El archivo ${file.name} excede el límite de ${maxSize}MB`);
                return false;
            }
            return true;
        });

        // Limit to 1 if not multiple
        const filesProcess = multiple ? validFiles : validFiles.slice(0, 1);

        const newPreviews: { file: File; url: string }[] = [];

        filesProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => [...prev, { file, url: e.target?.result as string }]);
            };
            reader.readAsDataURL(file);
            newPreviews.push({ file, url: '' }); // URL will be updated async
        });
    };

    const handleUpload = async () => {
        if (previews.length === 0) return;

        for (const { file } of previews) {
            await onUpload(file);
        }

        // Reset after successful upload
        setPreviews([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancel = () => {
        setPreviews([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {previews.length === 0 ? (
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
                                Arrastra y suelta tu{multiple ? 's archivos' : ' archivo'} aquí
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
                        multiple={multiple}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previews.map((preview, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square group">
                                {preview.file.type.startsWith('image/') ? (
                                    <img src={preview.url || URL.createObjectURL(preview.file)} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <video src={preview.url || URL.createObjectURL(preview.file)} className="w-full h-full object-cover" />
                                )}
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                    {preview.file.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium">{previews.length} archivo{previews.length !== 1 ? 's' : ''} seleccionado{previews.length !== 1 ? 's' : ''}</p>
                            <p>{(previews.reduce((acc, curr) => acc + curr.file.size, 0) / 1024 / 1024).toFixed(2)} MB total</p>
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
                                {uploading ? 'Subiendo...' : 'Subir Todo'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
