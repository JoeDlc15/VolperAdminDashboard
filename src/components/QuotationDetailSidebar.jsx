import React from 'react';
import {
    X,
    Mail,
    Phone,
    Building2,
    Users as UsersIcon,
    Calendar,
    Hash
} from 'lucide-react';

const QuotationDetailSidebar = ({ quote, onClose }) => {
    if (!quote) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                {/* Cabecera Sidebar */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Detalle de Cotización</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Hash size={12} className="text-primary" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {quote.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-2xl border border-slate-100 dark:border-slate-700 transition-all shadow-sm hover:scale-110"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido Sidebar */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Información del Cliente */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Información del Solicitante</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Building2 size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Empresa</span>
                                </div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{quote.company}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <UsersIcon size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Contacto</span>
                                </div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{quote.contact}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Mail size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Correo</span>
                                </div>
                                <p className="text-sm font-black text-slate-900 dark:text-white lowercase">{quote.email}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Phone size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Teléfono</span>
                                </div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{quote.phone}</p>
                            </div>
                        </div>
                    </section>

                    {/* Lista de Productos */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Productos Solicitados</h4>
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                {quote.items?.length || 0} Items
                            </span>
                        </div>
                        <div className="space-y-4">
                            {quote.items?.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 leading-tight">{item.productName}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SKU: {item.sku}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Unitario: ${parseFloat(item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{item.quantity}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unidades</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fecha de Solicitud</p>
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{new Date(quote.createdAt).toLocaleDateString()} - {new Date(quote.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado Actual</p>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${quote.status === 'pending' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
                                    {quote.status === 'pending' ? 'Pendiente de Respuesta' : 'Cotización Enviada'}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Acciones Sidebar */}
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                    <button className="flex-1 h-14 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                        Responder Cotización
                    </button>
                    <button
                        onClick={onClose}
                        className="h-14 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-black uppercase tracking-widest text-xs rounded-2xl px-8 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetailSidebar;
