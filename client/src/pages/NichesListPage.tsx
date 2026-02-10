import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useSearch } from '../context/SearchContext';

interface NicheWithModel {
    id: string;
    nicheName: string;
    instagramHandle: string;
    status: string;
    model: {
        id: string;
        fullName: string;
    };
    _count: {
        assets: number;
        posts: number;
        ideas: number;
    };
}

export function NichesListPage() {
    const [niches, setNiches] = useState<NicheWithModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [models, setModels] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        modelId: '',
        nicheName: '',
        instagramHandle: '',
        bio: '',
        status: 'ACTIVE',
    });
    const { query } = useSearch();

    useEffect(() => {
        loadNiches();
        loadModels();
    }, []);

    const loadNiches = async () => {
        setLoading(true);
        try {
            console.log('Loading niches...');
            const res = await api.get<NicheWithModel[]>('/niches');
            console.log('Niches API response:', res);
            if (res.ok && res.data) {
                console.log('Setting niches to:', res.data);
                setNiches(res.data);
            } else {
                console.error('Failed to load niches:', res);
            }
        } catch (error) {
            console.error('Error loading niches:', error);
        }
        setLoading(false);
    };

    const loadModels = async () => {
        try {
            const res = await api.get<any[]>('/models');
            if (res.ok && res.data) {
                setModels(res.data.filter((m: any) => m.status === 'ACTIVE'));
            }
        } catch (error) {
            console.error('Error loading models:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post(`/models/${formData.modelId}/niches`, {
                nicheName: formData.nicheName,
                instagramHandle: formData.instagramHandle,
                bio: formData.bio,
                status: formData.status,
            });
            console.log('Create niche response:', res);
            if (res.ok) {
                setShowCreateModal(false);
                setFormData({
                    modelId: '',
                    nicheName: '',
                    instagramHandle: '',
                    bio: '',
                    status: 'ACTIVE',
                });
                await loadNiches(); // Await to ensure it completes
            }
        } catch (error) {
            console.error('Error creating niche:', error);
        }
    };

    const filteredNiches = niches.filter((niche) => {
        const matchesStatus = !statusFilter || niche.status === statusFilter;
        const matchesSearch =
            !query ||
            niche.nicheName.toLowerCase().includes(query.toLowerCase()) ||
            niche.instagramHandle.toLowerCase().includes(query.toLowerCase()) ||
            niche.model.fullName.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">All Niches</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                    + Nuevo Nicho
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 items-center mb-6">
                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
                    >
                        <option value="">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAUSED">Paused</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
            </div>

            {/* Niches Table */}
            {filteredNiches.length === 0 ? (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">category</span>
                    <p className="text-gray-500 dark:text-gray-400">
                        {statusFilter || query ? 'Sin nichos match your filters' : 'Sin nichos yet. Create your first one!'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Niche</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Model</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Posts</th>
                                <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Assets</th>
                                <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredNiches.map((niche) => (
                                <tr key={niche.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{niche.nicheName}</div>
                                            <div className="text-xs text-gray-500">@{niche.instagramHandle}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{niche.model.fullName}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-bold rounded ${niche.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : niche.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {niche.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400">{niche._count.posts}</td>
                                    <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400">{niche._count.assets}</td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            to={`/niches/${niche.id}`}
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            Open
                                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Crear Nicho Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setFormData({
                        modelId: '',
                        nicheName: '',
                        instagramHandle: '',
                        bio: '',
                        status: 'ACTIVE',
                    });
                }}
                title="Create Nuevo Nicho"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Model *
                        </label>
                        <select
                            value={formData.modelId}
                            onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            required
                        >
                            <option value="">Select a model...</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Niche Name *
                        </label>
                        <input
                            type="text"
                            value={formData.nicheName}
                            onChange={(e) => setFormData({ ...formData, nicheName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Instagram Handle *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                            <input
                                type="text"
                                value={formData.instagramHandle}
                                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                                className="w-full pl-8 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowCreateModal(false);
                                setFormData({
                                    modelId: '',
                                    nicheName: '',
                                    instagramHandle: '',
                                    bio: '',
                                    status: 'ACTIVE',
                                });
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Crear Nicho
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
