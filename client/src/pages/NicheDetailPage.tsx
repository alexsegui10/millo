import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNiche, updateNiche, uploadFile } from '../lib/apiClient';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { AssetsTab } from '../components/tabs/AssetsTab';
import { PostsTab } from '../components/tabs/PostsTab';
import { IdeasTab } from '../components/tabs/IdeasTab';
import { MetricsTab } from '../components/tabs/MetricsTab';
import type { Niche, NicheStatus } from '../types';

export function NicheDetailPage() {
    const { nicheId } = useParams<{ nicheId: string }>();
    const [niche, setNiche] = useState<Niche | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('assets');
    const [showEditModal, setShowEditModal] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editFormData, setEditFormData] = useState({
        nicheName: '',
        instagramHandle: '',
        imageUrl: '',
        bio: '',
        status: 'ACTIVE' as NicheStatus,
    });

    useEffect(() => {
        if (nicheId) {
            loadNiche();
        }
    }, [nicheId]);

    const loadNiche = async () => {
        if (!nicheId) return;
        setLoading(true);
        const res = await getNiche(nicheId);
        if (res.ok && res.data) {
            setNiche(res.data);
            setEditFormData({
                nicheName: res.data.nicheName,
                instagramHandle: res.data.instagramHandle,
                imageUrl: res.data.imageUrl || '',
                bio: res.data.bio || '',
                status: res.data.status,
            });
        }
        setLoading(false);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nicheId) return;

        // Sanitize data: convert empty strings to undefined
        const sanitize = (val: string) => val.trim() === '' ? undefined : val.trim();

        const payload = {
            ...editFormData,
            nicheName: editFormData.nicheName.trim(),
            instagramHandle: editFormData.instagramHandle.trim(),
            imageUrl: sanitize(editFormData.imageUrl),
            bio: sanitize(editFormData.bio),
        };

        const res = await updateNiche(nicheId, payload);
        if (res.ok && res.data) {
            setNiche(res.data);
            setShowEditModal(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const res = await uploadFile(file, 'millo/avatars');
            if (res.ok && res.data) {
                setEditFormData({ ...editFormData, imageUrl: res.data.url });
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

    if (!niche) {
        return <div className="p-8 text-center text-gray-500">Niche not found</div>;
    }

    const tabs = [
        {
            id: 'assets',
            label: 'Assets',
            icon: 'photo_library',
            content: <AssetsTab nicheId={niche.id} />,
        },
        {
            id: 'posts',
            label: 'Posts',
            icon: 'post_add',
            content: <PostsTab nicheId={niche.id} />,
        },
        {
            id: 'ideas',
            label: 'Ideas',
            icon: 'lightbulb',
            content: <IdeasTab nicheId={niche.id} />,
        },
        {
            id: 'metrics',
            label: 'Metrics',
            icon: 'analytics',
            content: <MetricsTab nicheId={niche.id} />,
        },
    ];

    return (
        <div className="px-4 md:px-8 py-6">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/models" className="hover:text-primary">Models</Link>
                <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                {niche.model && (
                    <>
                        <Link to={`/models/${niche.model.id}`} className="hover:text-primary">
                            {niche.model.fullName}
                        </Link>
                        <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                    </>
                )}
                <span className="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-none">{niche.nicheName}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                {/* Avatar */}
                <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 self-center md:self-auto">
                    {niche.imageUrl ? (
                        <img
                            src={niche.imageUrl}
                            alt={niche.nicheName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined text-4xl">image</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 justify-center md:justify-start">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{niche.nicheName}</h1>
                        <Badge status={niche.status} variant="dot" />
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">@{niche.instagramHandle}</p>
                    {niche.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto md:mx-0">{niche.bio}</p>
                    )}
                </div>

                <div className="w-full md:w-auto flex justify-center md:block">
                    <Button variant="secondary" onClick={() => setShowEditModal(true)} className="w-full md:w-auto justify-center">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                        Editar Nicho
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Editar Nicho"
            >
                <form onSubmit={handleUpdate} className="p-6 space-y-5">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors flex items-center justify-center">
                                {editFormData.imageUrl ? (
                                    <img
                                        src={editFormData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 group-hover:text-primary">
                                        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                                        <p className="text-[10px] mt-1">Cambiar Foto</p>
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
                        value={editFormData.nicheName}
                        onChange={(e) => setEditFormData({ ...editFormData, nicheName: e.target.value })}
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
                                value={editFormData.instagramHandle}
                                onChange={(e) => setEditFormData({ ...editFormData, instagramHandle: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <Textarea
                        label="Bio"
                        rows={3}
                        value={editFormData.bio}
                        onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    />

                    <Select
                        label="Estado"
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as NicheStatus })}
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="PAUSED">Pausado</option>
                        <option value="ARCHIVED">Archivado</option>
                    </Select>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={uploadingImage}
                            className="flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
