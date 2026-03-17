import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../services/adminApi';
import Sidebar from '../components/Sidebar';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        displayOrder: 999
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const data = await getAdminCategories();
        setCategories(data || []);
        setLoading(false);
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setForm({
                name: category.name,
                description: category.description || '',
                displayOrder: category.displayOrder
            });
        } else {
            setEditingCategory(null);
            setForm({
                name: '',
                description: '',
                displayOrder: 999
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        let result;
        if (editingCategory) {
            result = await updateAdminCategory(editingCategory.id, form);
        } else {
            result = await createAdminCategory(form);
        }

        if (result) {
            setMessage({ type: 'success', text: `Categoría ${editingCategory ? 'actualizada' : 'creada'} correctamente` });
            setShowModal(false);
            fetchCategories();
        } else {
            setMessage({ type: 'error', text: 'Error al procesar la solicitud' });
        }
        setFormLoading(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            const result = await deleteAdminCategory(id);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                fetchCategories();
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al eliminar categoría' });
            }
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && categories.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando Categorías...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestión de Categorías</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Clasificación de productos del catálogo</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-xl pl-12 pr-4 text-sm font-bold w-64 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="h-11 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} /> Nueva Categoría
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {message && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm ${message.type === 'success' ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100/50' : 'bg-rose-50/80 text-rose-600 border border-rose-100/50'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <div className="glass-surface rounded-[2.5rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Orden</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre / ID</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Productos</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/30">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                                #{category.displayOrder}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{category.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 tracking-widest">ID: {category.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold text-primary-light dark:text-primary-dark">/{category.slug}</span>
                                        </td>
                                        <td className="px-8 py-5 max-w-xs transition-all duration-300">
                                            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight line-clamp-2 leading-relaxed">
                                                {category.description || '---'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-xl">
                                                {category._count?.products || 0}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal para Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Organización de productos</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre de la Categoría</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                        placeholder="Ej: Sellos Hidráulicos"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Descripción</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        className="w-full min-h-[100px] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold transition-all outline-none resize-none"
                                        placeholder="Descripción breve de la categoría..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Orden de Visualización</label>
                                    <input
                                        type="number"
                                        value={form.displayOrder}
                                        onChange={e => setForm({ ...form, displayOrder: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-black transition-all outline-none"
                                        placeholder="999"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 h-14 bg-white dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 h-14 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                                >
                                    {formLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
