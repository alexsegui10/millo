import { ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: string;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative ${activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.icon && (
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="w-full">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
}
