import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
    LayoutDashboard,
    FileText,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Package,
    Users,
    ArrowRight,
    Users as UsersIcon,
    Clock,
    CheckCircle2,
    Eye,
    Calendar,
    Hash,
    Loader2,
    ChevronRight
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { getAdminQuotations, getAdminProducts, getAdminCustomers, getAdminQuotationById } from '../services/adminApi';
import Sidebar from '../components/Sidebar';
import QuotationDetailSidebar from '../components/QuotationDetailSidebar';

const COLORS = ['#10b981', '#f59e0b', '#64748b', '#3b82f6'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [fetchingQuote, setFetchingQuote] = useState(false);

    useEffect(() => {
        fetchData();

        // Escuchar el evento WebSocket también aquí para actualizar los datos
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const SOCKET_URL = API_BASE_URL.replace('/api', '');
        const socket = io(SOCKET_URL);

        socket.on('new-quote', () => {
            // Refrescar las cotizaciones cuando entra una nueva
            fetchQuotationsOnly();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchQuotationsOnly = async () => {
        const q = await getAdminQuotations();
        setQuotations(q || []);
    };

    const fetchData = async () => {
        setLoading(true);
        const [q, p, c] = await Promise.all([
            getAdminQuotations(),
            getAdminProducts(),
            getAdminCustomers()
        ]);
        setQuotations(q || []);
        setProducts(p || []);
        setCustomers(c || []);
        setLoading(false);
    };

    const handleViewQuote = async (id) => {
        setFetchingQuote(true);
        const quote = await getAdminQuotationById(id);
        setSelectedQuote(quote);
        setFetchingQuote(false);
    };

    // Estadísticas para gráficos
    const quoteStats = [
        { name: 'Respondida', value: quotations.filter(q => q.status === 'processed').length },
        { name: 'Pendiente', value: quotations.filter(q => q.status === 'pending').length },
        { name: 'Cerrada', value: 0 }, // Placeholder
        { name: 'En Proceso', value: 0 }, // Placeholder
    ];

    const allVariants = products.flatMap(p =>
        p.variants.map(v => ({
            ...v,
            productName: p.name,
            productId: p.id
        }))
    );

    const lowStockItems = allVariants.filter(v => v.stock <= v.minStock).slice(0, 5);

    const cards = [
        { label: 'Cotizaciones Totales', value: quotations.length, icon: FileText, color: 'text-primary' },
        { label: 'Pendientes', value: quotations.filter(q => q.status === 'pending').length, icon: Clock, color: 'text-amber-500' },
        { label: 'Productos Activos', value: products.length, icon: Package, color: 'text-emerald-500' },
        { label: 'Clientes Registrados', value: customers.length, icon: UsersIcon, color: 'text-indigo-500' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando Panel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Bienvenido al Panel</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumen general de tu negocio</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Tarjetas de Resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {cards.map((card, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{card.label}</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{card.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                                    <card.icon size={24} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Cotizaciones Recientes */}
                        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Cotizaciones Recientes</h3>
                                <button onClick={() => navigate('/cotizaciones')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 flex items-center gap-1.5 transition-all">
                                    Ver todas <ArrowRight size={12} />
                                </button>
                            </div>
                            <div className="flex-1 divide-y divide-slate-50 dark:divide-slate-800/50">
                                {quotations.slice(0, 5).map((q) => (
                                    <div key={q.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{q.company}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.contact}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${q.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {q.status === 'pending' ? 'Pendiente' : 'Respondida'}
                                            </span>
                                            <button
                                                onClick={() => handleViewQuote(q.id)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gráfico de Estado */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 flex flex-col">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8">Estado de Cotizaciones</h3>
                            <div className="flex-1 h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={quoteStats}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {quoteStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{quotations.length}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                                </div>
                            </div>
                            <div className="mt-8 space-y-3">
                                {quoteStats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                            <span className="text-slate-500">{stat.name}</span>
                                        </div>
                                        <span className="text-slate-900 dark:text-white">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stock Bajo */}
                    <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/50 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center text-rose-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">Alerta de Stock Bajo</h3>
                            </div>
                            <button onClick={() => navigate('/inventario')} className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                                Ver inventario <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {lowStockItems.length === 0 ? (
                                <p className="text-center py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Todo el inventario está en niveles óptimos.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {lowStockItems.map((item, idx) => (
                                        <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate leading-tight">{item.productName}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-rose-600">{item.stock} {item.unit}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase">Mín: {item.minStock}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Sidebar de Detalles de Cotización */}
            <QuotationDetailSidebar
                quote={selectedQuote}
                onClose={() => setSelectedQuote(null)}
            />
        </div>
    );
};

export default Dashboard;
