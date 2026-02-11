import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Dropdown, DropdownItem } from '../components/ui/Dropdown';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
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
                    <p className="text-[#64748b]">Cargando modelos...</p>
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
                            Directorio de Modelos
                        </h1>
                        <p className="text-text-secondary dark:text-gray-400 mt-1">
                            Gestiona tu lista de talentos, rastrea estados y monitorea el rendimiento.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="px-4 py-2.5">
                            <span className="material-symbols-outlined text-[20px]">file_download</span>
                            <span>Exportar CSV</span>
                        </Button>
                        <Button
                            variant="primary"
                            className="px-5 py-2.5"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Crear Modelo</span>
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1a2230] p-2 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#2d3748] mb-6">
                    <div className="relative flex-1 w-full max-w-md">
                        <Input
                            icon="search"
                            className="bg-background-light dark:bg-background-dark/50 border-transparent focus:bg-white dark:focus:bg-[#1a2230]"
                            placeholder="Buscar modelos por nombre, email..."
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
                                        Detalles del Modelo
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[15%]">
                                        Estado
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[20%]">
                                        Nichos Vinculados
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[20%]">
                                        Creado
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 w-[10%] text-right">
                                        Acciones
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
                                                <p className="text-gray-600 dark:text-gray-400 font-medium">No hay modelos aún</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                                    Crea tu primer modelo para comenzar
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
                                                        {model.nicheCount === 1 ? 'Cuenta' : 'Cuentas'}
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
                title="Crear Nuevo Modelo"
            >
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    <Input
                        label="Nombre Completo"
                        icon="person"
                        autoFocus
                        placeholder="Ej: Maria Perez"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />

                    <Select
                        label="Estado Actual"
                        icon="toggle_on"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ModelStatus })}
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="PAUSED">Pausado</option>
                        <option value="ARCHIVED">Archivado</option>
                    </Select>

                    <Textarea
                        label="Notas Internas (Opcional)"
                        placeholder="Añade notas específicas, requerimientos o restricciones..."
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancelar
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
                    <Input
                        label="Nombre Completo *"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />

                    <Select
                        label="Estado"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ModelStatus })}
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="INACTIVE">Inactivo</option>
                    </Select>

                    <Textarea
                        label="Notas"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                    />

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
                            Actualizar Modelo
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
                        ¿Estás seguro de que deseas eliminar a <strong>{selectedModel?.fullName}</strong>?
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Esta acción eliminará todos los Nichos, Posts, Assets y Métricas asociados. Esta acción no se puede deshacer.
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
