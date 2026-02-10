import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="px-4 py-2">
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        className={`px-4 py-2 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''
                            }`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
