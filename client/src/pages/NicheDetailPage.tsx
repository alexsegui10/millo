import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNiche } from '../lib/apiClient';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { AssetsTab } from '../components/tabs/AssetsTab';
import { PostsTab } from '../components/tabs/PostsTab';
import { IdeasTab } from '../components/tabs/IdeasTab';
import { MetricsTab } from '../components/tabs/MetricsTab';
import type { Niche } from '../types';

export function NicheDetailPage() {
    const { nicheId } = useParams<{ nicheId: string }>();
    const [niche, setNiche] = useState<Niche | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('assets');

    useEffect(() => {
        if (nicheId) {
            loadNiche();
        }
    }, [nicheId]);

    const loadNiche = async () => {
        if (!nicheId) return;
        setLoading(true);
        const res = await getNiche(nicheId);
        if (res.ok && res.data) setNiche(res.data);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!niche) {
        return <div className="p-8 text-center text-gray-500">Niche not found</div>;
    }

    const tabs = [
        {
            id: 'assets',
            label: 'Assets',
            icon: 'photo_library',
            content: <AssetsTab nicheId={niche.id} />,
        },
        {
            id: 'posts',
            label: 'Posts',
            icon: 'post_add',
            content: <PostsTab nicheId={niche.id} />,
        },
        {
            id: 'ideas',
            label: 'Ideas',
            icon: 'lightbulb',
            content: <IdeasTab nicheId={niche.id} />,
        },
        {
            id: 'metrics',
            label: 'Metrics',
            icon: 'analytics',
            content: <MetricsTab nicheId={niche.id} />,
        },
    ];

    return (
        <div className="px-8 py-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/models" className="hover:text-primary">Models</Link>
                <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                {niche.model && (
                    <>
                        <Link to={`/models/${niche.model.id}`} className="hover:text-primary">
                            {niche.model.fullName}
                        </Link>
                        <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                    </>
                )}
                <span className="text-gray-900 dark:text-white font-medium">{niche.nicheName}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">{niche.nicheName}</h1>
                        <Badge status={niche.status} variant="dot" />
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">@{niche.instagramHandle}</p>
                    {niche.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{niche.bio}</p>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}
