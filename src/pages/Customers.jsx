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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Users size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Directorio de Clientes</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-xl pl-12 pr-4 text-sm font-bold w-64 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={() => { setEditingCustomer(null); setForm(emptyCustomer); setShowForm(true); }}
                            className="h-11 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} /> Nuevo Cliente
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <Users size={40} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Sin resultados</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 px-8 text-center max-w-xs leading-relaxed">No hemos encontrado clientes que coincidan con tu búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map(customer => (
                                <div key={customer.id} className="group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                                    <div className="relative flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                            <span className="text-xl font-black">{customer.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate leading-none mb-1">{customer.name}</h3>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{customer.company || 'Individuo'}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingCustomer(customer); setForm({ ...customer }); setShowForm(true); }}
                                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg hover:text-primary transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative space-y-3">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Mail size={14} className="flex-shrink-0" />
                                            <span className="text-xs font-bold truncate">{customer.email || 'Sin email'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Phone size={14} className="flex-shrink-0" />
                                            <span className="text-xs font-bold">{customer.phone || 'Sin teléfono'}</span>
                                        </div>
                                        {customer.address && (
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <MapPin size={14} className="flex-shrink-0" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">{customer.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Tag size={12} className="text-slate-300" />
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Añadido: {new Date(customer.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:gap-2 transition-all">
                                            Ver Historial <ChevronDown size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal para cliente */}
            {showForm && (
                <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    {editingCustomer ? 'Editar Perfil' : 'Nuevo Cliente'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completa los datos del directorio</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Empresa</label>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Dirección Corta</label>
                                    <input
                                        type="text"
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                        placeholder="Lima, Perú"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Notas / Observaciones</label>
                                    <textarea
                                        rows={3}
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 h-14 bg-white dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all font-black"
                            >
                                Descartar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 h-14 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Guardar Cliente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
