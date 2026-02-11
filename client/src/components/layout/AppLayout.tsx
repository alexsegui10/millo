import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SearchProvider } from '../../context/SearchContext';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SearchProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark relative w-full min-w-0">
                    <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SearchProvider>
    );
}
