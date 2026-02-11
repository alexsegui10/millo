import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
                        block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 
                        border border-slate-200 dark:border-slate-700 rounded-lg 
                        text-slate-900 dark:text-white placeholder-slate-400 
                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                        transition-all sm:text-sm resize-none
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
