import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface DashboardData {
    kpis: {
        activeModels: number;
        activeNiches: number;
        postsLast7Days: number;
        followersGrowth7Days: number;
    };
    latestPosts: any[];
    topPosts: any[];
    alerts: {
        scheduledToday: number;
        nichesWithoutMetrics: number;
    };
}

export function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const res = await api.get<DashboardData>('/dashboard/summary');
            if (res.ok && res.data) {
                setData(res.data);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-8 text-center text-gray-500">Error al cargar el panel de control. Por favor intenta recargar la página.</div>;
    }

    return (
        <div className="p-8 hide-scrollbar">
            {/* Quick Actions */}
            <div className="flex gap-3 mb-6">
                <Link
                    to="/models"
                    className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                    + Añadir Modelo
                </Link>
                <Link
                    to="/niches"
                    className="px-5 py-2.5 bg-white dark:bg-[#1f2937] text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Explorar Nichos
                </Link>
                <Link
                    to="/content"
                    className="px-5 py-2.5 bg-white dark:bg-[#1f2937] text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Ver Contenido
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Modelos Activas" value={data.kpis.activeModels.toString()} icon="person" />
                <StatCard label="Nichos Activos" value={data.kpis.activeNiches.toString()} icon="category" />
                <StatCard label="Posts (7 días)" value={data.kpis.postsLast7Days.toString()} icon="post_add" />
                <StatCard
                    label="Crecimiento Seguidores (7d)"
                    value={`+${data.kpis.followersGrowth7Days}`}
                    icon="trending_up"
                    trend={data.kpis.followersGrowth7Days > 0 ? "positive" : "negative"}
                />
            </div>

            {/* Alerts */}
            {(data.alerts.scheduledToday > 0 || data.alerts.nichesWithoutMetrics > 0) && (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Alertas</h2>
                    <div className="space-y-3">
                        {data.alerts.scheduledToday > 0 && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-orange-500">schedule</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                    <strong>{data.alerts.scheduledToday}</strong> posts programados para hoy
                                </span>
                            </div>
                        )}
                        {data.alerts.nichesWithoutMetrics > 0 && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                    <strong>{data.alerts.nichesWithoutMetrics}</strong> nichos sin métricas (últimos 7 días)
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Latest Posts Table */}
            {data.latestPosts.length > 0 && (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Últimos Posts</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Gancho (Hook)</th>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Nicho</th>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Publicado</th>
                                    <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.latestPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="py-4 px-6">
                                            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{post.hook || '-'}</td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{post.niche?.nicheName || '-'}</td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                            {post.postedAt ? new Date(post.postedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link
                                                to={`/posts/${post.id}`}
                                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                            >
                                                Ver
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Posts by Saves Rate */}
            {data.topPosts.length > 0 && (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Posts (por Tasa de Guardado)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">Gancho (Hook)</th>
                                    <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Tasa Guardado</th>
                                    <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Vistas</th>
                                    <th className="py-3 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.topPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="py-4 px-6">
                                            <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{post.hook || '-'}</td>
                                        <td className="py-4 px-6 text-right font-bold text-green-600">
                                            {post.saves_rate?.toFixed(2) || '0.00'}%
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400">
                                            {post.views?.toLocaleString() || '0'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link
                                                to={`/posts/${post.id}`}
                                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                            >
                                                Ver
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Welcome message */}
            {!data.latestPosts.length && !data.topPosts.length && (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido a OFM Agency Hub</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.kpis.activeModels > 0
                            ? `Tienes ${data.kpis.activeModels} modelo(s) activa(s) y ${data.kpis.activeNiches} nicho(s) activo(s). ¡Empieza a crear contenido!`
                            : 'Empieza añadiendo tu primera modelo.'}
                    </p>
                </div>
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    trend,
}: {
    label: string;
    value: string;
    icon: string;
    trend?: 'positive' | 'negative';
}) {
    return (
        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className={`material-symbols-outlined text-2xl ${trend === 'positive' ? 'text-green-500' : trend === 'negative' ? 'text-red-500' : 'text-gray-400'}`}>
                    {icon}
                </span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{value}</div>
        </div>
    );
}
