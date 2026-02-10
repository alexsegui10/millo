import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Dropdown, DropdownItem } from '../components/ui/Dropdown';
import type { Model, ModelStatus } from '../types';

export function ModelsListPage() {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        status: 'ACTIVE' as ModelStatus,
        notes: '',
    });

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        setLoading(true);
        const response = await api.get<Model[]>('/models');
        if (response.ok && response.data) {
            setModels(response.data);
        }
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await api.post<Model>('/models', formData);
        if (response.ok) {
            setShowCreateModal(false);
            setFormData({ fullName: '', status: 'ACTIVE', notes: '' });
            loadModels();
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModel) return;
        const response = await api.patch<Model>(`/models/${selectedModel.id}`, formData);
        if (response.ok) {
            setShowEditModal(false);
            setSelectedModel(null);
            setFormData({ fullName: '', status: 'ACTIVE', notes: '' });
            loadModels();
        }
    };

    const handleDelete = async () => {
        if (!selectedModel) return;
        const response = await api.delete(`/models/${selectedModel.id}`);
        if (response.ok) {
            setShowDeleteModal(false);
            setSelectedModel(null);
            loadModels();
        }
    };

    const openEditModal = (model: Model) => {
        setSelectedModel(model);
        setFormData({
            fullName: model.fullName,
            status: model.status,
            notes: model.notes || '',
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (model: Model) => {
        setSelectedModel(model);
        setShowDeleteModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-[#64748b]">Loading models...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-text-main dark:text-white">
                            Models Directory
                        </h1>
                        <p className="text-text-secondary dark:text-gray-400 mt-1">
                            Manage your talent roster, track status, and monitor performance.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="px-4 py-2.5">
                            <span className="material-symbols-outlined text-[20px]">file_download</span>
                            <span>Export CSV</span>
                        </Button>
                        <Button
                            variant="primary"
                            className="px-5 py-2.5"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Crear modelo</span>
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1a2230] p-2 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#2d3748] mb-6">
                    <div className="relative flex-1 w-full max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-500">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background-light dark:bg-background-dark/50 border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a2230] focus:ring-0 text-sm text-text-main dark:text-white placeholder-text-secondary dark:placeholder-gray-500 transition-all"
                            placeholder="Search models by name, email..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#2d3748] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#e2e8f0] dark:border-[#2d3748] bg-gray-50/50 dark:bg-white/5">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[35%]">
                                        Model Details
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[15%]">
                                        Status
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[20%]">
                                        Niches Linked
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[20%]">
                                        Created
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[10%] text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#2d3748]">
                                {models.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                                                    group_off
                                                </span>
                                                <p className="text-gray-600 dark:text-gray-400 font-medium">No models yet</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                                    Create your first model to get started
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    models.map((model) => (
                                        <tr
                                            key={model.id}
                                            className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[#0d121b] dark:text-white font-semibold">
                                                            {model.fullName.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Link
                                                            to={`/models/${model.id}`}
                                                            className="text-sm font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors"
                                                        >
                                                            {model.fullName}
                                                        </Link>
                                                        {model.notes && (
                                                            <span className="text-xs text-text-secondary dark:text-gray-500 truncate max-w-[200px]">
                                                                {model.notes}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge status={model.status} variant="dot" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center justify-center size-8 rounded-lg bg-gray-100 dark:bg-white/5 text-sm font-bold text-text-main dark:text-gray-200">
                                                        {model.nicheCount || 0}
                                                    </span>
                                                    <span className="text-xs text-text-secondary dark:text-gray-500">
                                                        {model.nicheCount === 1 ? 'Account' : 'Accounts'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-text-main dark:text-gray-300">
                                                        {new Date(model.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Dropdown
                                                    trigger={
                                                        <button className="p-2 rounded-lg text-text-secondary hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400 transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    }
                                                >
                                                    <DropdownItem icon="edit" onClick={() => openEditModal(model)}>
                                                        Editar Modelo
                                                    </DropdownItem>
                                                    <DropdownItem icon="delete" onClick={() => openDeleteModal(model)} variant="danger">
                                                        Eliminar Modelo
                                                    </DropdownItem>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Crear Modelo Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Nuevo Modelo"
            >
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="full-name">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                            </div>
                            <input
                                autoFocus
                                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                id="full-name"
                                placeholder="e.g. Jane Doe"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="status">
                            Current Status
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">toggle_on</span>
                            </div>
                            <select
                                className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm appearance-none cursor-pointer"
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as ModelStatus })}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING">Pending Onboarding</option>
                                <option value="PAUSED">Paused</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="notes">
                            Internal Notes <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                        </label>
                        <textarea
                            className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm resize-none"
                            id="notes"
                            placeholder="Add specific notes about niches, content requirements, or account restrictions..."
                            rows={4}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancelarar
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all flex items-center gap-2"
                            type="submit"
                        >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Editar Modelo Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedModel(null);
                    setFormData({ fullName: '', status: 'ACTIVE', notes: '' });
                }}
                title="Editar Modelo"
            >
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as ModelStatus })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedModel(null);
                                setFormData({ fullName: '', status: 'ACTIVE', notes: '' });
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Update Model
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Eliminar Modelo Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedModel(null);
                }}
                title="Eliminar Modelo"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete <strong>{selectedModel?.fullName}</strong>?
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        This action will delete all associated Niches, Posts, Assets, and Metrics. This cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setSelectedModel(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar Modelo
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
