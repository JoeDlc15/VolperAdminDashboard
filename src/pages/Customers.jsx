import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Users,
    X,
    Save,
    Loader2,
    Mail,
    Phone,
    Building2,
    MapPin,
    Star,
    ChevronDown,
    ChevronUp,
    Eye,
    Tag
} from 'lucide-react';
import { getAdminCustomers, createCustomer, updateCustomer } from '../services/adminApi';
import Sidebar from '../components/Sidebar';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyCustomer = { name: "", email: "", phone: "", company: "", address: "", notes: "" };
    const [form, setForm] = useState(emptyCustomer);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        const data = await getAdminCustomers();
        setCustomers(data || []);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!form.name) return;
        setSaving(true);

        let result;
        if (editingCustomer) {
            result = await updateCustomer(editingCustomer.id, form);
        } else {
            result = await createCustomer(form);
        }

        if (result) {
            setShowForm(false);
            setEditingCustomer(null);
            setForm(emptyCustomer);
            fetchCustomers();
        } else {
            alert('Error al guardar cliente');
        }
        setSaving(false);
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light dark:text-primary-dark">
                            <Users size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Directorio de Clientes</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Gestión de contactos y empresas</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-xl pl-12 pr-4 text-sm font-bold w-64 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={() => { setEditingCustomer(null); setForm(emptyCustomer); setShowForm(true); }}
                            className="h-11 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} /> Nuevo Cliente
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-56 glass-surface rounded-[2.5rem] animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 glass-surface rounded-[3rem] border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 mb-8 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                                <Users size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Sin resultados</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 px-8 text-center max-w-sm leading-loose">No hemos encontrado clientes que coincidan con tu búsqueda en el directorio.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filtered.map(customer => (
                                <div key={customer.id} className="group glass-surface p-7 rounded-[2.8rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden flex flex-col h-full border-slate-100 dark:border-slate-800/60">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 group-hover:scale-150 transition-all duration-700 pointer-events-none" />

                                    <div className="relative flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-400 dark:from-primary-dark dark:to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-2xl font-black">{customer.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate group-hover:text-primary transition-colors leading-tight mb-1">{customer.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <Building2 size={12} className="text-primary-light" />
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{customer.company || 'Cliente Final'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative space-y-4 flex-1">
                                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-white/50 dark:hover:bg-slate-900/50 transition-all">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                                <Mail size={16} />
                                            </div>
                                            <span className="text-xs font-bold truncate tracking-tight">{customer.email || 'Sin registro'}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-white/50 dark:hover:bg-slate-900/50 transition-all">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                                <Phone size={16} />
                                            </div>
                                            <span className="text-xs font-black tracking-tight">{customer.phone || 'N/A'}</span>
                                        </div>
                                        {customer.address && (
                                            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-white/50 dark:hover:bg-slate-900/50 transition-all">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                                    <MapPin size={16} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest truncate">{customer.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Activo desde {new Date(customer.createdAt).getFullYear()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setEditingCustomer(customer); setForm({ ...customer }); setShowForm(true); }}
                                                className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm group-hover:scale-110 active:scale-95 border border-transparent hover:border-primary/20"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-primary rounded-xl transition-all shadow-sm group-hover:scale-110 active:scale-95 border border-transparent"
                                                title="Ver Historial"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal para cliente */}
            {showForm && (
                <div className="fixed inset-0 z-[100] p-6 flex items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setShowForm(false)} />

                    <div className="glass-surface w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border-white/20 dark:border-slate-800/80">
                        <div className="p-10 border-b border-white/10 dark:border-slate-800/50 flex items-center justify-between bg-white/40 dark:bg-slate-900/40">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    {editingCustomer ? 'Editar Perfil' : 'Nuevo Cliente'}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 opacity-80">Identificación y contacto industrial</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-all hover:rotate-90 shadow-md">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 bg-white/20 dark:bg-slate-950/20">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="col-span-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block group-focus-within:text-primary transition-colors">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/40 rounded-2xl px-6 text-sm font-bold transition-all outline-none focus:bg-white dark:focus:bg-slate-800 shadow-inner"
                                        placeholder="Ej: Constructora Volper"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Email Trabajo</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/40 rounded-2xl px-6 text-sm font-bold transition-all outline-none focus:bg-white dark:focus:bg-slate-800 shadow-inner"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Teléfono / WhatsApp</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="w-full h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/40 rounded-2xl px-6 text-sm font-bold transition-all outline-none focus:bg-white dark:focus:bg-slate-800 shadow-inner"
                                        placeholder="+51 999 999 999"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Razón Social / Empresa</label>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className="w-full h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/40 rounded-2xl px-6 text-sm font-bold transition-all outline-none focus:bg-white dark:focus:bg-slate-800 shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Ubicación</label>
                                    <input
                                        type="text"
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        className="w-full h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/40 rounded-2xl px-6 text-sm font-bold transition-all outline-none focus:bg-white dark:focus:bg-slate-800 shadow-inner"
                                        placeholder="Lima, Perú"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Notas Internas</label>
                                    <textarea
                                        rows={3}
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        className="w-full bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/40 rounded-[2rem] p-6 text-sm font-bold transition-all outline-none resize-none focus:bg-white dark:focus:bg-slate-800 shadow-inner"
                                        placeholder="Detalles importantes del cliente..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-white/10 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/60 flex gap-5">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-[11px] rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all font-black transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-2 h-16 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 ring-4 ring-primary/5"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {editingCustomer ? 'Actualizar Registro' : 'Crear Registro'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
