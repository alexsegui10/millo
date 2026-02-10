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

    const getStatusColor = (status: IdeaStatus) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200';
            case 'IN_PROGRESS':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200';
            case 'COMPLETED':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200';
            case 'REJECTED':
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700';
        }
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
                    <option value="">All Status</option>
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
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
                    <p className="text-gray-600 dark:text-gray-400">No ideas yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start brainstorming content ideas</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.entries(groupedIdeas) as [IdeaStatus, Idea[]][]).map(([status, statusIdeas]) => (
                        <div key={status} className="flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                    {status.replace('_', ' ')}
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
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
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
                                                <option value="NEW">New</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="REJECTED">Rejected</option>
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
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Nueva Idea">
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Hook</label>
                        <input
                            autoFocus
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            placeholder="Main hook or title for the idea..."
                            type="text"
                            value={formData.hook}
                            onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Description (Optional)</label>
                        <textarea
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none"
                            placeholder="Describe the idea in detail..."
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Format (Optional)</label>
                        <input
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            placeholder="e.g., Reel, Carousel, Tutorial..."
                            type="text"
                            value={formData.format}
                            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Status</label>
                        <select
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as IdeaStatus })}
                        >
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="REJECTED">Rejected</option>
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
                            Create Idea
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
                message="Are you sure you want to delete this idea?"
                confirmText="Eliminar"
                variant="danger"
            />
        </>
    );
}
