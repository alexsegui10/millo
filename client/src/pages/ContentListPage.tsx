import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useSearch } from '../context/SearchContext';

interface PostWithNiche {
    id: string;
    type: string;
    status: string;
    hook?: string;
    theme?: string;
    scheduledAt?: string;
    postedAt?: string;
    niche?: {
        id: string;
        nicheName: string;
        model: {
            id: string;
            fullName: string;
        };
    };
}

export function ContentListPage() {
    const [posts, setPosts] = useState<PostWithNiche[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [niches, setNiches] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        nicheId: '',
        type: 'REEL' as 'REEL' | 'POST' | 'STORY',
        hook: '',
        theme: '',
        status: 'DRAFT',
    });
    const { query } = useSearch();

    useEffect(() => {
        loadPosts();
        loadNiches();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get<PostWithNiche[]>('/content/posts');
            if (res.ok && res.data) {
                setPosts(res.data);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
        setLoading(false);
    };

    const loadNiches = async () => {
        try {
            const res = await api.get<any[]>('/niches');
            if (res.ok && res.data) {
                setNiches(res.data.filter((n: any) => n.status === 'ACTIVE'));
            }
        } catch (error) {
            console.error('Error loading niches:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post(`/niches/${formData.nicheId}/posts`, {
                type: formData.type,
                hook: formData.hook,
                theme: formData.theme,
                status: formData.status,
            });
            console.log('Create post response:', res);
            if (res.ok) {
                setShowCreateModal(false);
                setFormData({
                    nicheId: '',
                    type: 'REEL',
                    hook: '',
                    theme: '',
                    status: 'DRAFT',
                });
                await loadPosts(); // Await to ensure it completes
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesStatus = !statusFilter || post.status === statusFilter;
        const matchesType = !typeFilter || post.type === typeFilter;
        const matchesBuscar =
            !query ||
            (post.hook && post.hook.toLowerCase().includes(query.toLowerCase())) ||
            (post.theme && post.theme.toLowerCase().includes(query.toLowerCase())) ||
            (post.niche?.nicheName && post.niche.nicheName.toLowerCase().includes(query.toLowerCase()));
        return matchesStatus && matchesType && matchesBuscar;
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
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">All Contenido</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                    + New Post
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
                        <option value="DRAFT">Draft</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="POSTED">Posted</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Type</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
                    >
                        <option value="">All</option>
                        <option value="REEL">Reel</option>
                        <option value="POST">Post</option>
                        <option value="STORY">Story</option>
                    </select>
                </div>
            </div>

            {/* Contenido Table */}
            {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">post_add</span>
                    <p className="text-gray-500 dark:text-gray-400">
                        {statusFilter || typeFilter || query ? 'No posts match your filters' : 'No posts yet. Create your first one!'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Hook / Theme</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Niche</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="py-4 px-6">
                                        <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900 dark:text-white">{post.hook || post.theme || '-'}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{post.niche?.nicheName || '-'}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-bold rounded ${post.status === 'POSTED'
                                                ? 'bg-green-100 text-green-700'
                                                : post.status === 'SCHEDULED'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                        {post.postedAt
                                            ? new Date(post.postedAt).toLocaleDateString()
                                            : post.scheduledAt
                                                ? new Date(post.scheduledAt).toLocaleDateString()
                                                : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            to={`/posts/${post.id}`}
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

            {/* Create Post Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setFormData({
                        nicheId: '',
                        type: 'REEL',
                        hook: '',
                        theme: '',
                        status: 'DRAFT',
                    });
                }}
                title="Crear Nueva Publicación"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Niche *
                        </label>
                        <select
                            value={formData.nicheId}
                            onChange={(e) => setFormData({ ...formData, nicheId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            required
                        >
                            <option value="">Select a niche...</option>
                            {niches.map((niche) => (
                                <option key={niche.id} value={niche.id}>
                                    {niche.nicheName} (@{niche.instagramHandle}) - {niche.model?.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contenido Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            required
                        >
                            <option value="REEL">Reel</option>
                            <option value="POST">Post</option>
                            <option value="STORY">Story</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Hook
                        </label>
                        <input
                            type="text"
                            value={formData.hook}
                            onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            placeholder="Eye-catching hook for your content"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Theme
                        </label>
                        <textarea
                            value={formData.theme}
                            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            placeholder="Main theme or concept"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowCreateModal(false);
                                setFormData({
                                    nicheId: '',
                                    type: 'REEL',
                                    hook: '',
                                    theme: '',
                                    status: 'DRAFT',
                                });
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Create Post
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
