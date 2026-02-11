import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col border-r border-[#e7ebf3] dark:border-[#1f2937] bg-white dark:bg-[#151c2b]">
            <div className="p-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                    OH
                </div>
                <div className="flex flex-col">
                    <h1 className="text-base font-semibold text-[#0d121b] dark:text-white leading-tight">OFM Hub</h1>
                    <p className="text-[#4c669a] text-xs font-normal">Agency Console</p>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto">
                <Link
                    to="/"
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
                    to="/models"
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
                    className="w-full flex items-center justify-center gap-2 rounded-xl h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Añadir Modelo
                </Link>
            </div>
        </aside>
    );
}
