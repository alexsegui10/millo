import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { logout } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { User } from '../types';

export function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        setLoading(true);
        const res = await api.get<{ data: { user: User } }>('/auth/me');
        if (res.ok && res.data) {
            setUser(res.data.data.user);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="px-8 py-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Configuración</h1>

            <div className="max-w-2xl space-y-6">
                <Card>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <div className="text-base text-gray-900 dark:text-white font-medium">
                                {user?.fullName}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <div className="text-base text-gray-900 dark:text-white font-medium">
                                {user?.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                            <span className="inline-flex px-2 py-1 bg-primary/10 text-primary rounded text-sm font-bold">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Application</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">Sign Out</div>
                            <div className="text-sm text-gray-500">Log out of your account on this device</div>
                        </div>
                        <Button variant="secondary" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                            Log Out
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
