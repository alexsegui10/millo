import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1f2937] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {children}
                </div>
            )}
        </div>
    );
}

interface DropdownItemProps {
    onClick: () => void;
    icon?: string;
    children: React.ReactNode;
    variant?: 'default' | 'danger';
}

export function DropdownItem({ onClick, icon, children, variant = 'default' }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                }`}
        >
            {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
            {children}
        </button>
    );
}
