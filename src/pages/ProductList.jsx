import React, { useState, useEffect } from 'react';
import {
    Search,
    Package,
    Plus,
    ChevronDown,
    ChevronUp,
    Edit2,
    Save,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { getAdminProducts, updateAdminProduct, updateVariant } from '../services/adminApi';
import Sidebar from '../components/Sidebar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);
    const [editForm, setEditForm] = useState({ price: '', stock: '' });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const data = await getAdminProducts();
        setProducts(data || []);
        setLoading(false);
    };

    const handleUpdateVariant = async (sku) => {
        setLoading(true);
        const success = await updateVariant(sku, {
            price: parseFloat(editForm.price),
            stock: parseInt(editForm.stock)
        });

        if (success) {
            setMessage({ type: 'success', text: 'Variante actualizada correctamente' });
            setEditingVariant(null);
            fetchProducts();
        } else {
            setMessage({ type: 'error', text: 'Error al actualizar la variante' });
        }
        setLoading(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando Productos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Catálogo de Productos</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Gestión de inventario y precios</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-xl pl-12 pr-4 text-sm font-bold w-64 transition-all outline-none"
                            />
                        </div>
                        <button className="h-11 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                            <Plus size={16} /> Nuevo Producto
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
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-16"></th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Referencia</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Variantes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/30">
                                {filteredProducts.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <tr
                                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                                            className={`group cursor-pointer transition-all duration-300 ${expandedProduct === product.id ? 'bg-primary/[0.03] dark:bg-primary/[0.02]' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'}`}
                                        >
                                            <td className="px-6 py-5 text-center">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${expandedProduct === product.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'text-slate-300 group-hover:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50'}`}>
                                                    {expandedProduct === product.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        {product.images?.length > 0 ? (
                                                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package size={24} />
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{product.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors group-hover:border-primary/20">
                                                    {product.category?.name || 'S/C'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400/80">
                                                {product.reference || '---'}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-xs font-black text-primary-light dark:text-primary-dark bg-primary/10 px-3.5 py-1.5 rounded-xl border border-primary/10 group-hover:scale-110 inline-block transition-transform">{product.variants?.length || 0}</span>
                                            </td>
                                        </tr>
                                        {expandedProduct === product.id && (
                                            <tr className="bg-slate-50/50 dark:bg-slate-950/20">
                                                <td colSpan="5" className="px-8 py-8">
                                                    <div className="glass-surface rounded-[2rem] overflow-hidden shadow-lg animate-in slide-in-from-top-4 duration-500">
                                                        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Variantes de Producto</h4>
                                                            <button className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white uppercase tracking-widest hover:bg-primary px-4 py-2.5 rounded-xl transition-all border border-primary/30 active:scale-95 shadow-lg shadow-primary/5">
                                                                <Plus size={14} /> Agregar Variante
                                                            </button>
                                                        </div>

                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/10">
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU / Cód. Barras</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre de Pieza</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pieza / Medida</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Precio</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                                                    {product.variants?.map((v) => (
                                                                        <tr key={v.sku} className="group/var hover:bg-white dark:hover:bg-slate-800/60 transition-colors">
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                                                                                    {v.sku}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                                                                                    {v.name}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                                                                                    {v.dimensions?.map(d => d.dimensionValue).join(' x ') || 'Estándar'}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <div className="flex flex-col">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className={`text-sm font-black ${v.stock < 10 ? 'text-rose-500 animate-pulse-slow' : 'text-slate-900 dark:text-white'}`}>
                                                                                            {v.stock}
                                                                                        </span>
                                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{v.unit}</span>
                                                                                    </div>
                                                                                    {v.stock < 10 && <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest leading-none mt-1">Crítico</span>}
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                                                                    ${Number(v.price).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <div className="flex items-center justify-end gap-2">
                                                                                    {editingVariant === v.sku ? (
                                                                                        <div className="flex items-center gap-3 animate-in zoom-in-95 duration-200 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-primary/20">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={editForm.stock}
                                                                                                    onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                                                                                                    className="w-16 h-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 text-xs font-black outline-none focus:border-primary/50 transition-all"
                                                                                                    placeholder="Stock"
                                                                                                />
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={editForm.price}
                                                                                                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                                                                    className="w-24 h-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 text-xs font-black outline-none focus:border-primary/50 transition-all"
                                                                                                    placeholder="Precio"
                                                                                                />
                                                                                            </div>
                                                                                            <button
                                                                                                onClick={() => handleUpdateVariant(v.sku)}
                                                                                                className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                                                                                                title="Guardar"
                                                                                            >
                                                                                                <Save size={16} />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => setEditingVariant(null)}
                                                                                                className="p-2 bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300 rounded-xl hover:scale-110 active:scale-95 transition-all"
                                                                                                title="Cancelar"
                                                                                            >
                                                                                                <X size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-1 opacity-0 group-hover/var:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/var:translate-x-0">
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    setEditingVariant(v.sku);
                                                                                                    setEditForm({ price: v.price, stock: v.stock });
                                                                                                }}
                                                                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                                                            >
                                                                                                <Edit2 size={16} />
                                                                                            </button>
                                                                                            <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all">
                                                                                                <X size={16} className="rotate-45" />
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductList;
