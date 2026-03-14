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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Registro de Cotizaciones</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Listado completo de solicitudes</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Filtro de Estado */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === "all" ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setStatusFilter("pending")}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === "pending" ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm' : 'text-slate-400'}`}
                            >
                                Pendientes
                            </button>
                            <button
                                onClick={() => setStatusFilter("processed")}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === "processed" ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-400'}`}
                            >
                                Respondidas
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar empresa o cliente..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-xl pl-12 pr-4 text-sm font-bold w-64 transition-all outline-none"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-primary mb-4" size={48} />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando cotizaciones...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">No hay cotizaciones</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 px-8 text-center max-w-xs leading-relaxed">No se encontraron solicitudes con los filtros aplicados.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Fecha</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa / Contacto</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email / Teléfono</th>
                                            <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filtered.map((q) => (
                                            <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                                                            #{q.id}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{new Date(q.createdAt).toLocaleDateString()}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(q.createdAt).toLocaleTimeString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{q.company}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.contact}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{q.email}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">{q.phone}</p>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${q.status === 'pending'
                                                            ? 'bg-amber-100 text-amber-600 border border-amber-200'
                                                            : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                                        }`}>
                                                        {q.status === 'pending' ? 'Pendiente' : 'Enviada'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => handleViewQuote(q.id)}
                                                        className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/20 group"
                                                    >
                                                        <Eye size={18} className="group-hover:scale-110 transition-transform" />
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
