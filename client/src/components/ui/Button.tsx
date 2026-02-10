import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: ReactNode;
    icon?: string;
}

export function Button({ variant = 'primary', children, icon, className = '', ...props }: ButtonProps) {
    const baseStyles = 'flex items-center justify-center gap-2 rounded-lg font-semibold transition-all';

    const variantStyles = {
        primary: 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25 active:scale-[0.99]',
        secondary: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm',
        ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
            {children}
        </button>
    );
}
