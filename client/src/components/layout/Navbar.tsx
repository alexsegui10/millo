import { useLocation, useNavigate, Link } from 'react-router-dom';
import { logout } from '../../lib/auth';
import { useSearch } from '../../context/SearchContext';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { query, setQuery } = useSearch();

    // Build breadcrumbs dynamically based on pathname
    const buildBreadcrumbs = () => {
        const path = location.pathname;
        const crumbs = [{ label: 'Panel', path: '/' }];

        if (path.startsWith('/models')) {
            crumbs.push({ label: 'Modelos', path: '/models' });
            const modelMatch = path.match(/\/models\/([^\/]+)/);
            if (modelMatch) {
                crumbs.push({ label: 'Detalle del Modelo', path: `/models/${modelMatch[1]}` });
            }
        }

        if (path.startsWith('/niches')) {
            if (!path.match(/\/niches\/[^\/]+/)) {
                crumbs.push({ label: 'Nichos', path: '/niches' });
            } else {
                const nicheMatch = path.match(/\/niches\/([^\/]+)/);
                if (nicheMatch) {
                    crumbs.push({ label: 'Nichos', path: '/niches' });
                    crumbs.push({ label: 'Detalle del Nicho', path: `/niches/${nicheMatch[1]}` });
                }
            }
        }

        if (path.startsWith('/posts')) {
            const postMatch = path.match(/\/posts\/([^\/]+)/);
            if (postMatch) {
                crumbs.push({ label: 'Contenido', path: '/content' });
                crumbs.push({ label: 'Detalle de Publicación', path: `/posts/${postMatch[1]}` });
            }
        }

        if (path === '/content') {
            crumbs.push({ label: 'Contenido', path: '/content' });
        }

        if (path === '/analytics') {
            crumbs.push({ label: 'Analíticas', path: '/analytics' });
        }

        if (path === '/settings') {
            crumbs.push({ label: 'Configuración', path: '/settings' });
        }

        return crumbs;
    };

    const breadcrumbs = buildBreadcrumbs();

    // Determine if search should be visible
    const showSearch = ['/models', '/niches', '/content'].some(p => location.pathname.startsWith(p)) || location.pathname === '/niches';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-[#151c2b]/80 backdrop-blur-sm border-b border-[#e7ebf3] dark:border-[#1f2937] z-10">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            {idx > 0 && <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>}
                            <Link
                                to={crumb.path}
                                className={idx === breadcrumbs.length - 1 ? "font-medium text-[#0d121b] dark:text-white" : "hover:text-primary"}
                            >
                                {crumb.label}
                            </Link>
                        </div>
                    ))}
                </div>
                <h2 className="text-xl font-bold text-[#0d121b] dark:text-white mt-1">
                    {breadcrumbs[breadcrumbs.length - 1]?.label}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {showSearch && (
                    <div className="relative hidden md:flex items-center w-64 h-10 rounded-xl bg-[#f0f2f5] dark:bg-[#1f2937]">
                        <span className="material-symbols-outlined text-[#64748b] ml-3 text-[20px]">search</span>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-[#64748b] dark:text-white"
                            placeholder="Buscar..."
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                )}

                <button className="relative p-2 rounded-xl text-[#64748b] hover:bg-[#f0f2f5] dark:hover:bg-[#1f2937] transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-[#151c2b]"></span>
                </button>

                <button
                    onClick={handleLogout}
                    className="h-10 px-4 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    title="Cerrar Sesión"
                >
                    <span className="material-symbols-outlined text-[18px] mr-1">logout</span>
                    Salir
                </button>
            </div>
        </header>
    );
}
