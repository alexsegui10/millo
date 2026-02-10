import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPostsByNiche, createPost, deletePost, markPosted, listAssets, getUsedAssets, createAsset } from '../../lib/apiClient';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { MediaSelector } from '../ui/MediaSelector';
import type { ContentPost, PostType, PostStatus, Asset } from '../../types';

interface PostsTabProps {
    nicheId: string;
}

export function PostsTab({ nicheId }: PostsTabProps) {
    const [posts, setPosts] = useState<ContentPost[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [usedAssetIds, setUsedAssetIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMediaSelector, setShowMediaSelector] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [filter, setFilter] = useState({ status: '', type: '' });
    const [formData, setFormData] = useState({
        type: 'POST' as PostType,
        status: 'DRAFT' as PostStatus,
        caption: '',
        assetIds: [] as string[],
    });

    useEffect(() => {
        loadPosts();
    }, [nicheId, filter]);

    useEffect(() => {
        if (showCreateModal || showMediaSelector) {
            loadAssets();
            loadUsedAssets();
        }
    }, [showCreateModal, showMediaSelector]);

    const loadPosts = async () => {
        setLoading(true);
        const res = await listPostsByNiche(nicheId, filter);
        console.log('📋 Posts cargados:', res.data);
        if (res.ok && res.data) setPosts(res.data);
        setLoading(false);
    };

    const loadAssets = async () => {
        const res = await listAssets(nicheId);
        if (res.ok && res.data) setAssets(res.data);
    };

    const loadUsedAssets = async () => {
        const res = await getUsedAssets(nicheId);
        if (res.ok && res.data) setUsedAssetIds(res.data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación: requiere descripción o al menos un asset
        if (!formData.caption?.trim() && formData.assetIds.length === 0) {
            alert('Debes añadir una descripción o seleccionar al menos una imagen/video');
            return;
        }

        console.log('=== CREANDO POST ===');
        console.log('formData:', formData);
        const res = await createPost(nicheId, formData);
        console.log('respuesta:', res);
        console.log('post creado:', res.data);
        if (res.ok) {
            setShowCreateModal(false);
            setFormData({
                type: 'POST',
                status: 'DRAFT',
                caption: '',
                assetIds: [],
            });
            loadPosts();
        }
    };

    const handleDelete = async (id: string) => {
        await deletePost(id);
        loadPosts();
    };

    const handleMarkPosted = async (id: string) => {
        await markPosted(id);
        loadPosts();
    };

    const handleSelectAsset = (assetId: string) => {
        if (!formData.assetIds.includes(assetId)) {
            setFormData({ ...formData, assetIds: [...formData.assetIds, assetId] });
        }
        setShowMediaSelector(false);
    };

    const handleUploadInModal = async (file: File) => {
        const res = await createAsset(nicheId, file);
        if (res.ok) {
            await loadAssets();
            await loadUsedAssets();
        }
    };

    const removeAsset = (assetId: string) => {
        setFormData({ ...formData, assetIds: formData.assetIds.filter(id => id !== assetId) });
    };

    const getAssetUrl = (assetId: string) => {
        const asset = assets.find(a => a.id === assetId);
        return asset ? `http://localhost:3000${asset.url}` : '';
    };

    const getAssetType = (assetId: string) => {
        const asset = assets.find(a => a.id === assetId);
        return asset?.type || 'IMAGE';
    };

    if (loading) {
        return <div className="text-center py-8">Cargando publicaciones...</div>;
    }

    return (
        <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <div className="flex gap-2">
                    <select
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="DRAFT">Borrador</option>
                        <option value="POSTED">Publicado</option>
                    </select>
                    <select
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    >
                        <option value="">Todos los Tipos</option>
                        <option value="REEL">Reel</option>
                        <option value="POST">Publicación</option>
                        <option value="STORY">Historia</option>
                    </select>
                </div>
                <Button variant="primary" onClick={() => setShowCreateModal(true)} className="px-4 py-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Nueva Publicación
                </Button>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                        post_add
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">No hay publicaciones aún</p>
                    <p className="text-sm text-gray-500 mt-1">Crea tu primera publicación</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {posts.map((post) => {
                        const firstAsset = post.assets?.[0]?.asset;
                        return (
                            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Media Preview */}
                                <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
                                    {firstAsset ? (
                                        firstAsset.type === 'IMAGE' ? (
                                            <img
                                                src={`http://localhost:3000${firstAsset.url}`}
                                                alt="Post"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={`http://localhost:3000${firstAsset.url}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                                        </div>
                                    )}
                                    {/* Type Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 text-white rounded text-xs font-medium">
                                            <span className="material-symbols-outlined text-[14px]">
                                                {post.type === 'REEL' ? 'movie' : post.type === 'STORY' ? 'auto_stories' : 'image'}
                                            </span>
                                            {post.type === 'REEL' ? 'Reel' : post.type === 'STORY' ? 'Historia' : 'Post'}
                                        </span>
                                    </div>
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <Badge status={post.status} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
                                        {post.caption || 'Sin descripción'}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/posts/${post.id}`}
                                            className="flex-1 px-3 py-2 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Ver Detalles
                                        </Link>
                                        {post.status !== 'POSTED' && (
                                            <button
                                                onClick={() => handleMarkPosted(post.id)}
                                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                title="Marcar como Publicado"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteConfirm(post.id)}
                                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Crear Nueva Publicación">
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Tipo</label>
                            <select
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as PostType })}
                            >
                                <option value="POST">Publicación</option>
                                <option value="REEL">Reel</option>
                                <option value="STORY">Historia</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Estado</label>
                            <select
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
                            >
                                <option value="DRAFT">Borrador</option>
                                <option value="POSTED">Publicado</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Descripción</label>
                        <textarea
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none"
                            placeholder="Descripción de la publicación..."
                            rows={4}
                            value={formData.caption}
                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold">Media</label>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowMediaSelector(true)}
                                className="text-sm"
                            >
                                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                                Seleccionar Media
                            </Button>
                        </div>
                        {formData.assetIds.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {formData.assetIds.map((assetId, idx) => {
                                    const url = getAssetUrl(assetId);
                                    const type = getAssetType(assetId);
                                    return (
                                        <div key={assetId} className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                                            {type === 'IMAGE' ? (
                                                <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <video src={url} className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeAsset(assetId)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                            <div className="absolute bottom-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs">
                                                {idx + 1}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Sin media seleccionado</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            Crear Publicación
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Media Selector Modal */}
            <MediaSelector
                isOpen={showMediaSelector}
                onClose={() => setShowMediaSelector(false)}
                onSelect={handleSelectAsset}
                assets={assets}
                usedAssetIds={usedAssetIds}
                nicheId={nicheId}
                onUpload={handleUploadInModal}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Eliminar Publicación"
                message="¿Estás seguro de que quieres eliminar esta publicación?"
                confirmText="Eliminar"
                variant="danger"
            />
        </>
    );
}
