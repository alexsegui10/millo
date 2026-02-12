import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FileUpload } from './FileUpload';
import type { Asset } from '../../types';

interface MediaSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (assetId: string) => void;
    assets: Asset[];
    usedAssetIds?: string[];
    onUpload: (file: File) => Promise<void>;
    type?: 'REEL' | 'POST' | 'STORY';
    allowMultiple?: boolean;
    selectedAssetIds?: string[];
}

export function MediaSelector({
    isOpen,
    onClose,
    onSelect,
    assets,
    usedAssetIds = [],
    onUpload,
    type = 'POST',
    allowMultiple = false,
    selectedAssetIds = []
}: MediaSelectorProps) {
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Filter assets based on type
    const filteredAssets = assets.filter(asset => {
        if (type === 'REEL') return asset.type === 'VIDEO';
        if (type === 'POST') return asset.type === 'IMAGE';
        return true; // STORY can be both
    });

    // Sort by date (newest first) and separate by usage
    const sortedAssets = [...filteredAssets].sort((a, b) =>
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
        <Modal isOpen={isOpen} onClose={onClose} title={`Seleccionar Media (${type === 'REEL' ? 'Video' : type === 'POST' ? 'Fotos' : 'Todo'})`}>
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
                    <FileUpload
                        onUpload={handleUploadComplete}
                        uploading={uploading}
                        accept={type === 'REEL' ? 'video/*' : type === 'POST' ? 'image/*' : 'image/*,video/*'}
                        multiple={allowMultiple}
                    />
                ) : (
                    <div className="space-y-4">
                        {sortedAssets.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No hay {type === 'REEL' ? 'videos' : 'imágenes'} disponibles.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                                {sortedAssets.map((asset) => {
                                    const isUsed = usedAssetIds.includes(asset.id);
                                    const isSelected = selectedAssetIds.includes(asset.id);
                                    return (
                                        <div
                                            key={asset.id}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${isSelected
                                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                                : isUsed
                                                    ? 'border-yellow-400'
                                                    : 'border-green-400 hover:border-green-500'
                                                }`}
                                        >
                                            <div
                                                onClick={() => {
                                                    onSelect(asset.id);
                                                    if (!allowMultiple) {
                                                        onClose();
                                                    }
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

                                            {isSelected && (
                                                <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1 shadow-md">
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                </div>
                                            )}

                                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold pointer-events-none ${isUsed ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
                                                }`}>
                                                {isUsed ? 'Usado' : 'Nuevo'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {allowMultiple && (
                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Button variant="primary" onClick={onClose}>
                                    Listo ({selectedAssetIds.length})
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
