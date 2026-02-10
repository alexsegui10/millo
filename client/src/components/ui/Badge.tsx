import type { ModelStatus, NicheStatus, PostStatus } from '../../types';

interface BadgeProps {
    status: ModelStatus | NicheStatus | PostStatus | string;
    variant?: 'default' | 'dot';
}

export function Badge({ status, variant = 'default' }: BadgeProps) {
    const getStatusLabel = (status: string) => {
        const translations: Record<string, string> = {
            'ACTIVE': 'Activo',
            'PAUSED': 'Pausado',
            'PENDING': 'Pendiente',
            'ARCHIVED': 'Archivado',
            'DRAFT': 'Borrador',
            'SCHEDULED': 'Programado',
            'POSTED': 'Publicado',
            'INACTIVE': 'Inactivo',
        };
        return translations[status] || status;
    };

    const getStatusColors = () => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20';
            case 'PAUSED':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'PENDING':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 border-gray-200 dark:border-gray-600';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
            case 'DRAFT':
                return 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border-slate-200 dark:border-slate-600';
            case 'SCHEDULED':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'POSTED':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            default:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
        }
    };

    const getDotColor = () => {
        switch (status) {
            case 'ACTIVE':
            case 'POSTED':
                return 'bg-green-500';
            case 'PAUSED':
            case 'SCHEDULED':
                return 'bg-amber-500';
            case 'PENDING':
            case 'DRAFT':
                return 'bg-gray-400';
            default:
                return 'bg-blue-500';
        }
    };

    if (variant === 'dot') {
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColors()} border`}>
                <span className={`size-1.5 rounded-full ${getDotColor()}`}></span>
                {getStatusLabel(status)}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColors()} border`}>
            {getStatusLabel(status)}
        </span>
    );
}
