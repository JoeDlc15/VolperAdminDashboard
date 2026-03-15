import React, { useState, useEffect } from 'react';
import {
    Search,
    FileText,
    Eye,
    Calendar,
    Users,
    Hash,
    Loader2,
    Filter
} from 'lucide-react';
import { getAdminQuotations, getAdminQuotationById } from '../services/adminApi';
import Sidebar from '../components/Sidebar';
import QuotationDetailSidebar from '../components/QuotationDetailSidebar';

const Quotations = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [fetchingQuote, setFetchingQuote] = useState(false);

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        setLoading(true);
        const data = await getAdminQuotations();
        setQuotations(data || []);
        setLoading(false);
    };

    const handleViewQuote = async (id) => {
        setFetchingQuote(true);
        const quote = await getAdminQuotationById(id);
        setSelectedQuote(quote);
        setFetchingQuote(false);
    };

    const filtered = quotations.filter(q => {
        const matchesSearch =
            q.company.toLowerCase().includes(search.toLowerCase()) ||
            q.contact.toLowerCase().includes(search.toLowerCase()) ||
            q.email.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "all" || q.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light dark:text-primary-dark">
                            <FileText size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Registro de Cotizaciones</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Listado completo de solicitudes</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Filtro de Estado */}
                        <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/30">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${statusFilter === "all" ? 'bg-white dark:bg-slate-700 text-primary shadow-lg shadow-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setStatusFilter("pending")}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${statusFilter === "pending" ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-lg shadow-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Pendientes
                            </button>
                            <button
                                onClick={() => setStatusFilter("processed")}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${statusFilter === "processed" ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-lg shadow-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Respondidas
                            </button>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar empresa o cliente..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-xl pl-12 pr-4 text-sm font-bold w-72 transition-all outline-none"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-primary mb-4" size={48} />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando cotizaciones...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 glass-surface rounded-[3rem] border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 mb-8 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                                <FileText size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">No hay cotizaciones</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 px-8 text-center max-w-sm leading-loose">No se encontraron solicitudes que coincidan con tus criterios de búsqueda o filtros.</p>
                        </div>
                    ) : (
                        <div className="glass-surface rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Registro</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa / Contacto</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email / Contacto</th>
                                            <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Estado</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/30">
                                        {filtered.map((q) => (
                                            <tr key={q.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                            #{q.id}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{new Date(q.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-primary transition-colors line-clamp-1">{q.company}</p>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{q.contact}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{q.email}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{q.phone}</p>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border ${q.status === 'pending'
                                                        ? 'bg-amber-100/80 text-amber-600 border-amber-200/50'
                                                        : 'bg-emerald-100/80 text-emerald-600 border-emerald-200/50'
                                                        }`}>
                                                        {q.status === 'pending' ? 'Pendiente' : 'Enviada'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => handleViewQuote(q.id)}
                                                        className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-primary rounded-2xl transition-all shadow-md active:scale-90"
                                                        title="Ver Detalles"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <QuotationDetailSidebar
                quote={selectedQuote}
                onClose={() => setSelectedQuote(null)}
            />
        </div>
    );
};

export default Quotations;
