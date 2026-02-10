import { useEffect, useState } from 'react';
import { listDailyMetrics, upsertDailyMetrics } from '../../lib/apiClient';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { StatCard } from '../ui/Card';
import type { AccountMetricsDaily } from '../../types';

interface MetricsTabProps {
    nicheId: string;
}

export function MetricsTab({ nicheId }: MetricsTabProps) {
    const [metrics, setMetrics] = useState<AccountMetricsDaily[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpsertModal, setShowUpsertModal] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        followers: 0,
        reach: 0,
        impressions: 0,
        profileVisits: 0,
    });

    useEffect(() => {
        loadMetrics();
    }, [nicheId]);

    const loadMetrics = async () => {
        setLoading(true);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const res = await listDailyMetrics(nicheId, {
            from: thirtyDaysAgo.toISOString().split('T')[0],
        });
        if (res.ok && res.data) setMetrics(res.data);
        setLoading(false);
    };

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await upsertDailyMetrics(nicheId, formData);
        if (res.ok) {
            setShowUpsertModal(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                followers: 0,
                reach: 0,
                impressions: 0,
                profileVisits: 0,
            });
            loadMetrics();
        }
    };

    const currentFollowers = metrics[0]?.followers || 0;
    const sevenDaysAgo = metrics[6]?.followers || 0;
    const growth7d = currentFollowers - sevenDaysAgo;
    const reach7d = metrics.slice(0, 7).reduce((sum, m) => sum + m.reach, 0);
    const impressions7d = metrics.slice(0, 7).reduce((sum, m) => sum + m.impressions, 0);

    if (loading) {
        return <div className="text-center py-8">Cargando métricas...</div>;
    }

    return (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon="group"
                    iconColor="bg-blue-50 dark:bg-blue-900/20 text-primary"
                    label="Seguidores Actuales"
                    value={currentFollowers.toLocaleString()}
                />
                <StatCard
                    icon="trending_up"
                    iconColor="bg-green-50 dark:bg-green-900/20 text-green-600"
                    label="Crecimiento (7 días)"
                    value={growth7d > 0 ? `+${growth7d.toLocaleString()}` : growth7d.toLocaleString()}
                    trend={growth7d > 0 ? `+${((growth7d / sevenDaysAgo) * 100).toFixed(1)}%` : '0%'}
                    trendUp={growth7d > 0}
                />
                <StatCard
                    icon="visibility"
                    iconColor="bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                    label="Alcance (7 días)"
                    value={reach7d.toLocaleString()}
                />
                <StatCard
                    icon="analytics"
                    iconColor="bg-orange-50 dark:bg-orange-900/20 text-orange-600"
                    label="Impresiones (7 días)"
                    value={impressions7d.toLocaleString()}
                />
            </div>

            {/* Toolbar */}
            <div className="flex justify-end mb-4">
                <Button variant="primary" onClick={() => setShowUpsertModal(true)} className="px-4 py-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Añadir Métrica Diaria
                </Button>
            </div>

            {/* Metrics Table */}
            {metrics.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                        analytics
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">No hay métricas aún</p>
                    <p className="text-sm text-gray-500 mt-1">Añade métricas diarias para seguir el rendimiento</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Seguidores
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Alcance
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Impresiones
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                                        Visitas al Perfil
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {metrics.map((metric) => (
                                    <tr key={metric.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                            {new Date(metric.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-semibold">
                                            {metric.followers.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                                            {metric.reach.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                                            {metric.impressions.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                                            {metric.profileVisits.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Upsert Modal */}
            <Modal
                isOpen={showUpsertModal}
                onClose={() => setShowUpsertModal(false)}
                title="Añadir/Actualizar Métrica Diaria"
            >
                <form onSubmit={handleUpsert} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Fecha</label>
                        <input
                            type="date"
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Seguidores</label>
                        <input
                            type="number"
                            min="0"
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.followers}
                            onChange={(e) => setFormData({ ...formData, followers: parseInt(e.target.value) || 0 })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Alcance</label>
                        <input
                            type="number"
                            min="0"
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.reach}
                            onChange={(e) => setFormData({ ...formData, reach: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Impresiones</label>
                        <input
                            type="number"
                            min="0"
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.impressions}
                            onChange={(e) => setFormData({ ...formData, impressions: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Visitas al Perfil</label>
                        <input
                            type="number"
                            min="0"
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.profileVisits}
                            onChange={(e) => setFormData({ ...formData, profileVisits: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowUpsertModal(false)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            Guardar Métrica
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
