import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    User as UserIcon,
    ShoppingBasket,
    Package,
    ArrowRightLeft,
    Users
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Productos', path: '/productos' },
        { icon: ArrowRightLeft, label: 'Inventario', path: '/inventario' },
        { icon: Users, label: 'Clientes', path: '/clientes' },
    ];

    return (
        <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => window.open('http://localhost:5173', '_blank')}>
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <ShoppingBasket size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        Volper <span className="text-primary italic">Seal</span>
                    </h1>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Panel Administrativo</p>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full h-12 flex items-center gap-4 px-4 rounded-xl font-bold transition-all ${location.pathname === item.path
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <item.icon size={20} /> {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 px-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <UserIcon size={20} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase">{adminUser?.username || 'Admin'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrador</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 transition-all uppercase text-xs tracking-widest"
                >
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
