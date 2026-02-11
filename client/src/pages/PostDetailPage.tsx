import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost, upsertPostMetrics, listPostMetrics } from '../lib/apiClient';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { downloadFile } from '../utils/download';
import type { ContentPost, PostMetric } from '../types';

export function PostDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<ContentPost | null>(null);
    const [metrics, setMetrics] = useState<PostMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMetricModal, setShowMetricModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [metricFormData, setMetricFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0,
        followersGained: 0,
    });

    useEffect(() => {
        if (postId) loadData();
    }, [postId]);

    const loadData = async () => {
        if (!postId) return;
        setLoading(true);
        const [postRes, metricsRes] = await Promise.all([
            getPost(postId),
            listPostMetrics(postId),
        ]);
        if (postRes.ok && postRes.data) setPost(postRes.data);
        if (metricsRes.ok && metricsRes.data) setMetrics(metricsRes.data);
        setLoading(false);
    };

    const handleMetricUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postId) return;
        const res = await upsertPostMetrics(postId, metricFormData);
        if (res.ok) {
            setShowMetricModal(false);
            setMetricFormData({
                date: new Date().toISOString().split('T')[0],
                views: 0, likes: 0, comments: 0, saves: 0, shares: 0, followersGained: 0
            });
            loadData();
        }
    };

    const handleDelete = async () => {
        if (!postId) return;
        await deletePost(postId);
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!post) {
        return <div className="p-8 text-center text-gray-500">Publicación no encontrada</div>;
    }

    const latestMetric = metrics[0];
    const savesRate = latestMetric && latestMetric.views > 0
        ? ((latestMetric.saves / latestMetric.views) * 100).toFixed(2)
        : '0.00';
    const followersPerK = latestMetric && latestMetric.views > 0
        ? (latestMetric.followersGained / (latestMetric.views / 1000)).toFixed(2)
        : '0.00';

    return (
        <div className="px-8 py-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link to={`/niches/${post.nicheId}`} className="text-sm text-gray-500 hover:text-primary">
                            {post.niche?.nicheName || 'Nicho'}
                        </Link>
                        <span className="text-gray-300">&gt;</span>
                        <span className="text-sm text-gray-500">Detalles de Publicación</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            {post.type} - {post.caption ? post.caption.substring(0, 30) + '...' : 'Sin descripción'}
                        </h1>
                        <Badge status={post.status} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setShowMetricModal(true)}>
                        <span className="material-symbols-outlined text-[18px]">add_chart</span>
                        Añadir Métrica
                    </Button>
                    <button onClick={() => setDeleteConfirm(true)} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
                        Eliminar Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Post Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Información de la Publicación</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-500 uppercase">Descripción</label>
                                <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">
                                    {post.caption || 'Sin descripción'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-500 uppercase">Fecha Publicado</label>
                                <p className="text-gray-900 dark:text-white mt-1">
                                    {post.postedAt ? new Date(post.postedAt).toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Linked Assets */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Media Vinculado ({post.assets?.length || 0})</h2>

                        {post.assets && post.assets.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {post.assets.map((pa) => (
                                    <div key={pa.asset.id} className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                        {pa.asset.type === 'IMAGE' ? (
                                            <img
                                                src={pa.asset.url.startsWith('http') ? pa.asset.url : `http://localhost:3000${pa.asset.url}`}
                                                alt="Asset"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={pa.asset.url.startsWith('http') ? pa.asset.url : `http://localhost:3000${pa.asset.url}`}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                onClick={() => {
                                                    const url = pa.asset.url.startsWith('http') ? pa.asset.url : `http://localhost:3000${pa.asset.url}`;
                                                    downloadFile(url);
                                                }}
                                                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md transition-colors"
                                                title="Descargar"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">download</span>
                                            </button>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                            {pa.orderIndex + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Sin media vinculado</p>
                        )}
                    </div>

                    {/* Metrics History */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Historial de Métricas</h2>

                        {metrics.length > 0 ? (
                            <div className="space-y-3">
                                {metrics.map((metric) => (
                                    <div key={metric.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium">
                                                {new Date(metric.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">Vistas:</span>
                                                <span className="ml-2 font-semibold">{metric.views.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Likes:</span>
                                                <span className="ml-2 font-semibold">{metric.likes.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Guardados:</span>
                                                <span className="ml-2 font-semibold">{metric.saves.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Comentarios:</span>
                                                <span className="ml-2 font-semibold">{metric.comments.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Compartidos:</span>
                                                <span className="ml-2 font-semibold">{metric.shares.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Seguidores:</span>
                                                <span className="ml-2 font-semibold">{metric.followersGained.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No hay métricas registradas aún</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Latest Metrics */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Últimas Métricas</h2>
                        {latestMetric ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vistas</span>
                                    <span className="font-semibold">{latestMetric.views.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Likes</span>
                                    <span className="font-semibold">{latestMetric.likes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Guardados</span>
                                    <span className="font-semibold">{latestMetric.saves.toLocaleString()}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Sin métricas aún</p>
                        )}
                    </div>

                    {/* Calculated KPIs */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4">KPIs Calculados</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tasa de Guardado</span>
                                <span className="font-semibold">{savesRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Seguidores por 1K Vistas</span>
                                <span className="font-semibold">{followersPerK}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteConfirm && (
                <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Eliminar Publicación">
                    <div className="p-6 space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            ¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setDeleteConfirm(false)}>
                                Cancelar
                            </Button>
                            <button onClick={handleDelete} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Add Metric Modal */}
            <Modal isOpen={showMetricModal} onClose={() => setShowMetricModal(false)} title="Añadir Métrica">
                <form onSubmit={handleMetricUpsert} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Vistas</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={metricFormData.views}
                                onChange={(e) => setMetricFormData({ ...metricFormData, views: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Likes</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={metricFormData.likes}
                                onChange={(e) => setMetricFormData({ ...metricFormData, likes: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Comentarios</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={metricFormData.comments}
                                onChange={(e) => setMetricFormData({ ...metricFormData, comments: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Compartidos</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={metricFormData.shares}
                                onChange={(e) => setMetricFormData({ ...metricFormData, shares: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Guardados</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={metricFormData.saves}
                                onChange={(e) => setMetricFormData({ ...metricFormData, saves: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Seguidores Ganados</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={metricFormData.followersGained}
                                onChange={(e) => setMetricFormData({ ...metricFormData, followersGained: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowMetricModal(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar Métrica
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
