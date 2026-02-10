import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SearchProvider } from '../../context/SearchContext';

export function AppLayout() {
    return (
        <SearchProvider>
            <div className="flex h-screen w-full">
                <Sidebar />
                <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark relative">
                    <Navbar />
                    <div className="flex-1 overflow-y-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SearchProvider>
    );
}
