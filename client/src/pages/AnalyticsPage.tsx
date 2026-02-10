import { useState } from 'react';

export function AnalyticsPage() {
    const [range, setRange] = useState<7 | 30 | 90>(7);
    const [loading] = useState(false);

    // TODO: Fetch real analytics data when backend endpoint is available

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Analytics</h1>
            </div>

            {/* Range Selector */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setRange(7)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${range === 7
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-[#1f2937] text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                >
                    7 Days
                </button>
                <button
                    onClick={() => setRange(30)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${range === 30
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-[#1f2937] text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                >
                    30 Days
                </button>
                <button
                    onClick={() => setRange(90)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${range === 90
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-[#1f2937] text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                >
                    90 Days
                </button>
            </div>

            {/* Empty State */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">analytics</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Analytics Data Yet</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Add metrics to your niches and posts to see detailed analytics here. Track reach, impressions, follower growth, and post performance.
                </p>
            </div>
        </div>
    );
}
