import { useEffect, useState } from 'react';
import { listAssets, deleteAsset, createAsset } from '../../lib/apiClient';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { Asset } from '../../types';

interface AssetsTabProps {
    nicheId: string;
}

export function AssetsTab({ nicheId }: AssetsTabProps) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [filter, setFilter] = useState({ type: '', tag: '', q: '' });

    useEffect(() => {
        loadAssets();
    }, [nicheId, filter]);

    const loadAssets = async () => {
        setLoading(true);
        const res = await listAssets(nicheId, filter);
        if (res.ok && res.data) setAssets(res.data);
        setLoading(false);
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const res = await createAsset(nicheId, file);
            if (res.ok) {
                loadAssets();
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteAsset(id);
        loadAssets();
    };

    if (loading) {
        return <div className="text-center py-8">Cargando assets...</div>;
    }

    return (
        <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <div className="flex gap-2">
                    <select
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    >
                        <option value="">Todos los Tipos</option>
                        <option value="IMAGE">Imágenes</option>
                        <option value="VIDEO">Videos</option>
                    </select>
                    <input
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-48"
                        placeholder="Buscar..."
                        value={filter.q}
                        onChange={(e) => setFilter({ ...filter, q: e.target.value })}
                    />
                </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
                <FileUpload onUpload={handleUpload} uploading={uploading} />
            </div>

            {/* Assets Grid */}
            {assets.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                        photo_library
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">No hay assets aún</p>
                    <p className="text-sm text-gray-500 mt-1">Sube tu primera imagen o video</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative">
                                {asset.type === 'IMAGE' ? (
                                    <img src={`http://localhost:3000${asset.url}`} alt="Asset" className="w-full h-full object-cover" />
                                ) : (
                                    <video src={`http://localhost:3000${asset.url}`} className="w-full h-full object-cover" controls />
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-md">
                                        {asset.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3">
                                {asset.notes && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                        {asset.notes}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(`http://localhost:3000${asset.url}`)}
                                        className="flex-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs font-medium transition-colors"
                                    >
                                        Copy Link
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(asset.id)}
                                        className="px-2 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Eliminar Recurso"
                message="¿Estás seguro de que quieres eliminar este asset? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                variant="danger"
            />
        </>
    );
}
