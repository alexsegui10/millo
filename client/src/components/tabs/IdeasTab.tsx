import { useEffect, useState } from 'react';
import { listIdeas, createIdea, updateIdea, deleteIdea } from '../../lib/apiClient';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { Idea, IdeaStatus } from '../../types';

interface IdeasTabProps {
    nicheId: string;
}

export function IdeasTab({ nicheId }: IdeasTabProps) {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [filter, setFilter] = useState({ status: '' });
    const [formData, setFormData] = useState({
        hook: '',
        description: '',
        format: '',
        status: 'NEW' as IdeaStatus,
    });

    useEffect(() => {
        loadIdeas();
    }, [nicheId, filter]);

    const loadIdeas = async () => {
        setLoading(true);
        const res = await listIdeas(nicheId, filter);
        if (res.ok && res.data) setIdeas(res.data);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createIdea(nicheId, formData);
        if (res.ok) {
            setShowCreateModal(false);
            setFormData({ hook: '', description: '', format: '', status: 'NEW' });
            loadIdeas();
        }
    };

    const handleDelete = async (id: string) => {
        await deleteIdea(id);
        loadIdeas();
    };

    const handleStatusChange = async (id: string, status: IdeaStatus) => {
        await updateIdea(id, { status });
        loadIdeas();
    };



    const groupedIdeas = {
        NEW: ideas.filter((i) => i.status === 'NEW'),
        IN_PROGRESS: ideas.filter((i) => i.status === 'IN_PROGRESS'),
        COMPLETED: ideas.filter((i) => i.status === 'COMPLETED'),
        REJECTED: ideas.filter((i) => i.status === 'REJECTED'),
    };

    if (loading) {
        return <div className="text-center py-8">Cargando ideas...</div>;
    }

    return (
        <>
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <select
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    value={filter.status}
                    onChange={(e) => setFilter({ status: e.target.value })}
                >
                    <option value="">Todos</option>
                    <option value="NEW">Nuevas</option>
                    <option value="IN_PROGRESS">En Progreso</option>
                    <option value="COMPLETED">Completadas</option>
                    <option value="REJECTED">Rechazadas</option>
                </select>
                <Button variant="primary" onClick={() => setShowCreateModal(true)} className="px-4 py-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Nueva Idea
                </Button>
            </div>

            {/* Kanban Board */}
            {ideas.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                        lightbulb
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">No hay ideas aún</p>
                    <p className="text-sm text-gray-500 mt-1">Empieza a proponer ideas de contenido</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.entries(groupedIdeas) as [IdeaStatus, Idea[]][]).map(([status, statusIdeas]) => (
                        <div key={status} className="flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                    {status === 'NEW' ? 'NUEVAS' :
                                        status === 'IN_PROGRESS' ? 'EN PROGRESO' :
                                            status === 'COMPLETED' ? 'COMPLETADAS' : 'RECHAZADAS'}
                                </h3>
                                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                    {statusIdeas.length}
                                </span>
                            </div>
                            <div className="space-y-3 flex-1">
                                {statusIdeas.map((idea) => (
                                    <div
                                        key={idea.id}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                            {idea.hook}
                                        </p>
                                        {idea.description && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 whitespace-pre-wrap">
                                                {idea.description}
                                            </p>
                                        )}
                                        {idea.format && (
                                            <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs mb-3">
                                                {idea.format}
                                            </span>
                                        )}
                                        <div className="flex gap-2 mt-3">
                                            <select
                                                className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded"
                                                value={idea.status}
                                                onChange={(e) => handleStatusChange(idea.id, e.target.value as IdeaStatus)}
                                            >
                                                <option value="NEW">Nueva</option>
                                                <option value="IN_PROGRESS">En Progreso</option>
                                                <option value="COMPLETED">Completada</option>
                                                <option value="REJECTED">Rechazada</option>
                                            </select>
                                            <button
                                                onClick={() => setDeleteConfirm(idea.id)}
                                                className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Crear Nueva Idea">
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Gancho (Hook)</label>
                        <input
                            autoFocus
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            placeholder="Título o gancho principal para la idea..."
                            type="text"
                            value={formData.hook}
                            onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Descripción (Opcional)</label>
                        <textarea
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none"
                            placeholder="Describe la idea en detalle..."
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Formato (Opcional)</label>
                        <input
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            placeholder="ej., Reel, Carrusel, Tutorial..."
                            type="text"
                            value={formData.format}
                            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Estado</label>
                        <select
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as IdeaStatus })}
                        >
                            <option value="NEW">Nueva</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="COMPLETED">Completada</option>
                            <option value="REJECTED">Rechazada</option>
                        </select>
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
                            Crear Idea
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Eliminar Idea"
                message="¿Estás seguro de que quieres eliminar esta idea?"
                confirmText="Eliminar"
                variant="danger"
            />
        </>
    );
}
