import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, icon, children, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">{icon}</span>
                        </div>
                    )}
                    <select
                        ref={ref}
                        className={`
                            block w-full py-3 bg-slate-50 dark:bg-slate-800 
                            border border-slate-200 dark:border-slate-700 rounded-lg 
                            text-slate-900 dark:text-white 
                            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                            transition-all sm:text-sm appearance-none cursor-pointer
                            ${icon ? 'pl-10' : 'px-4'}
                            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                            ${className}
                        `}
                        {...props}
                    >
                        {children}
                    </select>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
