import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FileUpload } from './FileUpload';
import { downloadFile } from '../../utils/download';
import type { Asset } from '../../types';

interface MediaSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (assetId: string) => void;
    assets: Asset[];
    usedAssetIds?: string[];
    onUpload: (file: File) => Promise<void>;
}

export function MediaSelector({
    isOpen,
    onClose,
    onSelect,
    assets,
    usedAssetIds = [],
    onUpload
}: MediaSelectorProps) {
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Sort by date (newest first) and separate by usage
    const sortedAssets = [...assets].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleUploadComplete = async (file: File) => {
        setUploading(true);
        try {
            await onUpload(file);
            setShowUpload(false);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Media">
            <div className="p-6">
                {/* Toggle Upload */}
                <div className="mb-4 flex gap-2">
                    <Button
                        variant={!showUpload ? 'primary' : 'secondary'}
                        onClick={() => setShowUpload(false)}
                    >
                        Seleccionar Existente
                    </Button>
                    <Button
                        variant={showUpload ? 'primary' : 'secondary'}
                        onClick={() => setShowUpload(true)}
                    >
                        Subir Nuevo
                    </Button>
                </div>

                {showUpload ? (
                    <FileUpload onUpload={handleUploadComplete} uploading={uploading} />
                ) : (
                    <div className="space-y-4">
                        {assets.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No hay media disponible. Sube tu primer archivo.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                                {sortedAssets.map((asset) => {
                                    const isUsed = usedAssetIds.includes(asset.id);
                                    return (
                                        <div
                                            key={asset.id}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${isUsed
                                                ? 'border-yellow-400'
                                                : 'border-green-400 hover:border-green-500'
                                                }`}
                                        >
                                            <div
                                                onClick={() => {
                                                    onSelect(asset.id);
                                                    onClose();
                                                }}
                                                className="w-full h-full cursor-pointer"
                                            >
                                                {asset.type === 'IMAGE' ? (
                                                    <img
                                                        src={asset.url.startsWith('http') ? asset.url : `http://localhost:3000${asset.url}`}
                                                        alt="Asset"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <video
                                                        src={asset.url.startsWith('http') ? asset.url : `http://localhost:3000${asset.url}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {asset.type === 'VIDEO' && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                        <span className="material-symbols-outlined text-white text-4xl">
                                                            play_circle
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold pointer-events-none ${isUsed ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
                                                }`}>
                                                {isUsed ? 'Usado' : 'Nuevo'}
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const url = asset.url.startsWith('http') ? asset.url : `http://localhost:3000${asset.url}`;
                                                    downloadFile(url);
                                                }}
                                                className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                title="Descargar"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">download</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
