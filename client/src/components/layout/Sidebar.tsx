import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 flex flex-col border-r border-[#e7ebf3] dark:border-[#1f2937] bg-white dark:bg-[#151c2b] 
                    fixed top-0 left-0 h-full w-72 z-40 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:w-64
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                            OH
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-semibold text-[#0d121b] dark:text-white leading-tight">OFM Hub</h1>
                            <p className="text-[#4c669a] text-xs font-normal">Agency Console</p>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto">
                    <Link
                        to="/"
                        onClick={onClose} // Close on mobile navigation
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isActive('/') && location.pathname === '/'
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white'
                            } transition-colors group`}
                    >
                        <span className="material-symbols-outlined text-[20px] font-medium group-hover:scale-110 transition-transform">
                            dashboard
                        </span>
                        <span className="text-sm font-semibold">Panel de Control</span>
                    </Link>

                    <Link
                        to="/studio"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isActive('/studio')
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white'
                            } transition-colors group`}
                    >
                        <span className="material-symbols-outlined text-[20px] font-medium group-hover:scale-110 transition-transform">
                            view_kanban
                        </span>
                        <span className="text-sm font-semibold">Studio/Agenda</span>
                    </Link>

                    <Link
                        to="/models"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isActive('/models')
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white'
                            } transition-colors group`}
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                            group
                        </span>
                        <span className="text-sm font-medium">Modelos</span>
                    </Link>

                    <Link
                        to="/niches"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isActive('/niches')
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white'
                            } transition-colors group`}
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                            camera_alt
                        </span>
                        <span className="text-sm font-medium">Nichos</span>
                    </Link>

                    <Link
                        to="/content"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isActive('/content')
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white'
                            } transition-colors group`}
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                            post_add
                        </span>
                        <span className="text-sm font-medium">Contenido</span>
                    </Link>

                    <Link
                        to="/analytics"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isActive('/analytics')
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white'
                            } transition-colors group`}
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                            analytics
                        </span>
                        <span className="text-sm font-medium">Analíticas</span>
                    </Link>

                    <div className="mt-4 px-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                        Configuración
                    </div>
                    <Link
                        to="/settings"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#64748b] hover:bg-[#f8f9fc] dark:hover:bg-[#1f2937] hover:text-[#0d121b] dark:hover:text-white transition-colors group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                            settings
                        </span>
                        <span className="text-sm font-medium">Ajustes</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#e7ebf3] dark:border-[#1f2937]">
                    <Link
                        to="/models?action=create"
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 rounded-xl h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Añadir Modelo
                    </Link>
                </div>
            </aside>
        </>
    );
}
