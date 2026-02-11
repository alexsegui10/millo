import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModel, listNichesByModel, createNiche, deleteNiche, uploadFile } from '../lib/apiClient';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import type { Model, Niche, NicheStatus } from '../types';

export function ModelDetailPage() {
    const { modelId } = useParams<{ modelId: string }>();
    const [model, setModel] = useState<Model | null>(null);
    const [niches, setNiches] = useState<Niche[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        nicheName: '',
        instagramHandle: '',
        imageUrl: '',
        bio: '',
        status: 'ACTIVE' as NicheStatus,
    });

    useEffect(() => {
        if (modelId) {
            loadData();
        }
    }, [modelId]);

    const loadData = async () => {
        if (!modelId) return;
        setLoading(true);
        const [modelRes, nichesRes] = await Promise.all([
            getModel(modelId),
            listNichesByModel(modelId),
        ]);
        if (modelRes.ok && modelRes.data) setModel(modelRes.data);
        if (nichesRes.ok && nichesRes.data) setNiches(nichesRes.data);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modelId) return;
        const res = await createNiche(modelId, formData);
        if (res.ok) {
            setShowCreateModal(false);
            setFormData({ nicheName: '', instagramHandle: '', imageUrl: '', bio: '', status: 'ACTIVE' });
            loadData();
        }
    };

    const handleDelete = async (id: string) => {
        await deleteNiche(id);
        loadData();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const res = await uploadFile(file, 'millo/avatars');
            if (res.ok && res.data) {
                setFormData({ ...formData, imageUrl: res.data.url });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!model) {
        return <div className="p-8 text-center text-gray-500">Modelo no encontrado</div>;
    }

    return (
        <>
            <div className="px-8 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link to="/models" className="hover:text-primary">Modelos</Link>
                    <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                    <span className="text-gray-900 dark:text-white font-medium">{model.fullName}</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{model.fullName}</h1>
                            <Badge status={model.status} variant="dot" />
                        </div>
                        {model.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{model.notes}</p>
                        )}
                    </div>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)} className="px-5 py-2.5">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Crear Nicho
                    </Button>
                </div>

                {/* Niches Grid */}
                {niches.length === 0 ? (
                    <Card className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                            camera_alt
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">No hay nichos aún</p>
                        <p className="text-sm text-gray-500 mt-1">Crea la primera cuenta de Instagram para este modelo</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {niches.map((niche) => (
                            <Card key={niche.id} hover className="flex flex-col">
                                <div className="flex items-start gap-4 mb-3">
                                    {/* Avatar Image */}
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                        {niche.imageUrl ? (
                                            <img
                                                src={niche.imageUrl}
                                                alt={niche.nicheName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="material-symbols-outlined text-3xl">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    to={`/niches/${niche.id}`}
                                                    className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary transition-colors block truncate"
                                                >
                                                    {niche.nicheName}
                                                </Link>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{niche.instagramHandle}</p>
                                            </div>
                                            <Badge status={niche.status} />
                                        </div>
                                    </div>
                                </div>

                                {niche.bio && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{niche.bio}</p>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                                            {niche._count?.posts || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Posts</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                                            {niche._count?.assets || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Assets</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Link
                                        to={`/niches/${niche.id}`}
                                        className="flex-1 text-center px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
                                    >
                                        Ver Detalles
                                    </Link>
                                    <button
                                        onClick={() => setDeleteConfirm(niche.id)}
                                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Niche Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Crear Nuevo Nicho"
            >
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors flex items-center justify-center">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 group-hover:text-primary">
                                        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                                        <p className="text-[10px] mt-1">Subir Foto</p>
                                    </div>
                                )}
                            </div>
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    <Input
                        label="Nombre del Nicho"
                        autoFocus
                        placeholder="Ej: Modelo Fitness"
                        type="text"
                        value={formData.nicheName}
                        onChange={(e) => setFormData({ ...formData, nicheName: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Usuario Instagram
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">@</span>
                            <input
                                className="block w-full pl-7 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                placeholder="usuario"
                                type="text"
                                value={formData.instagramHandle}
                                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <Textarea
                        label="Bio (Opcional)"
                        placeholder="Describe este nicho..."
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />

                    <Select
                        label="Estado"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as NicheStatus })}
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="PAUSED">Pausado</option>
                    </Select>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm transition-all flex items-center gap-2"
                            type="submit"
                            disabled={uploadingImage}
                        >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            Crear Nicho
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Eliminar Nicho"
                message="¿Estás seguro de que quieres eliminar este nicho? Esto también eliminará todos los posts, assets y métricas asociados."
                confirmText="Eliminar"
                variant="danger"
            />
        </>
    );
}
