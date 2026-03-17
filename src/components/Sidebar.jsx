import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    LogOut,
    User as UserIcon,
    ShoppingBasket,
    Package,
    ArrowRightLeft,
    Users,
    FileText,
    Tag,
    Sun,
    Moon
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Productos', path: '/productos' },
        { icon: Tag, label: 'Categorías', path: '/categorias' },
        { icon: ArrowRightLeft, label: 'Inventario', path: '/inventario' },
        { icon: Users, label: 'Clientes', path: '/clientes' },
        { icon: FileText, label: 'Cotizaciones', path: '/cotizaciones' },
    ];

    return (
        <aside className="w-full lg:w-72 glass-surface flex flex-col h-screen sticky top-0 transition-all duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3 mb-2 cursor-pointer group" onClick={() => window.open('http://localhost:5173', '_blank')}>
                    <div className="w-10 h-10 bg-primary/10 text-primary-light dark:text-primary-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBasket size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        Volper <span className="text-primary-light dark:text-primary-dark italic">Seal</span>
                    </h1>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] opacity-70">Panel Administrativo</p>
            </div>

            <nav className="flex-1 p-6 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full h-11 flex items-center gap-3 px-4 rounded-xl font-bold transition-all duration-200 group ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className={`${isActive ? 'scale-110' : 'group-hover:translate-x-0.5 transition-transform'}`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800/50">
                {/* Theme Toggle */}
                <div className="mb-6 flex items-center justify-between px-3 h-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Modo Visual</span>
                    <button
                        onClick={toggleTheme}
                        className="p-2 bg-white dark:bg-slate-700 text-slate-500 dark:text-yellow-400 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600 hover:scale-110 active:scale-95 transition-all"
                    >
                        {theme === 'dark' ? (
                            <Sun size={16} strokeWidth={2.5} />
                        ) : (
                            <Moon size={16} strokeWidth={2.5} />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-4 px-3 mb-6 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md">
                        <UserIcon size={20} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{adminUser?.username || 'Admin'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrador</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all uppercase text-[10px] tracking-widest border border-rose-100/50 dark:border-rose-900/30"
                >
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
