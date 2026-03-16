import React from 'react';
import { X, Building2, User, Mail, Phone, Calendar, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

const QuotationDetailSidebar = ({ quote, onClose }) => {
    if (!quote) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end transition-all duration-500">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className="relative w-full max-w-lg bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Detalle de Cotización</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">CÓDIGO: {quote.maskId || `#${quote.id}`}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group"
                    >
                        <X size={20} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">

                    {/* Client Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="text-primary-light" size={16} />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información del Solicitante</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Building2 size={10} /> Empresa
                                </p>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{quote.company || 'No especificada'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <User size={10} /> Contacto
                                </p>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{quote.contact}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Mail size={10} /> Correo
                                </p>
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate lowercase">{quote.email}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Phone size={10} /> Teléfono
                                </p>
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{quote.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Products Requested Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Package className="text-primary-light" size={16} />
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Productos Solicitados</h4>
                            </div>
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                                {quote.items?.length || 0} Items
                            </span>
                        </div>

                        <div className="space-y-3">
                            {quote.items?.map((item, idx) => {
                                const stockNum = Number(item.currentStock || 0);
                                const quantNum = Number(item.quantity || 0);
                                const isStockCritical = stockNum <= 0;
                                const isStockLow = stockNum < quantNum && !isStockCritical;

                                return (
                                    <div key={idx} className={`p-5 rounded-3xl border transition-all ${isStockCritical ? 'bg-red-50/50 border-red-100' : isStockLow ? 'bg-amber-50/50 border-amber-100' : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 mr-4">
                                                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">{item.productName}</h5>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-mono">SKU: {item.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{quantNum}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unidades</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                                            <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isStockCritical ? 'text-red-500' : isStockLow ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {isStockCritical ? <AlertTriangle size={10} /> : isStockLow ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                                                Stock: {stockNum} {isStockCritical ? '(Agotado)' : isStockLow ? '(Insuficiente)' : '(Disponible)'}
                                            </span>

                                            {item.price > 0 && (
                                                <span className="text-[10px] font-black text-primary-light">
                                                    Ref: ${item.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Section */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-light shadow-sm">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Fecha de Solicitud</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white">
                                    {new Date(quote.createdAt).toLocaleDateString()} - {new Date(quote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado Actual</p>
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border ${quote.status === 'pending'
                                ? 'bg-amber-100/80 text-amber-600 border-amber-200/50'
                                : 'bg-emerald-100/80 text-emerald-600 border-emerald-200/50'
                                }`}>
                                {quote.status === 'pending' ? 'Pendiente de Respuesta' : 'Completada'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                    <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                        Responder Cotización
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        Cerrar
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default QuotationDetailSidebar;
