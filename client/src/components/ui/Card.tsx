import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
    return (
        <div
            className={`bg-white dark:bg-[#151c2b] rounded-xl p-5 shadow-sm border border-[#e7ebf3] dark:border-[#1f2937] ${hover ? 'hover:shadow-md transition-shadow' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
}

interface StatCardProps {
    icon: string;
    iconColor: string;
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
}

export function StatCard({ icon, iconColor, label, value, trend, trendUp }: StatCardProps) {
    return (
        <Card hover>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 ${iconColor} rounded-lg`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                {trend && (
                    <span
                        className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${trendUp
                                ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[14px] mr-1">
                            {trendUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-[#64748b] text-sm font-medium mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-[#0d121b] dark:text-white">{value}</h3>
        </Card>
    );
}
