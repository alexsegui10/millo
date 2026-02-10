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
    nicheId: string;
    onUpload: (file: File) => Promise<void>;
}

export function MediaSelector({
    isOpen,
    onClose,
    onSelect,
    assets,
    usedAssetIds = [],
    nicheId,
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
                                        <button
                                            key={asset.id}
                                            onClick={() => {
                                                onSelect(asset.id);
                                                onClose();
                                            }}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${isUsed
                                                    ? 'border-yellow-400 hover:border-yellow-500'
                                                    : 'border-green-400 hover:border-green-500'
                                                }`}
                                        >
                                            {asset.type === 'IMAGE' ? (
                                                <img
                                                    src={`http://localhost:3000${asset.url}`}
                                                    alt="Asset"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={`http://localhost:3000${asset.url}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${isUsed ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
                                                }`}>
                                                {isUsed ? 'Usado' : 'Nuevo'}
                                            </div>
                                            {asset.type === 'VIDEO' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <span className="material-symbols-outlined text-white text-4xl">
                                                        play_circle
                                                    </span>
                                                </div>
                                            )}
                                        </button>
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
