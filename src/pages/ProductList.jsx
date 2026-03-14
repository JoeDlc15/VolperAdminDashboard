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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Catálogo de Productos</h2>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-11 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-xl pl-12 pr-4 text-sm font-bold w-64 transition-all outline-none"
                            />
                        </div>
                        <button className="h-11 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20">
                            <Plus size={16} /> Nuevo Producto
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-16"></th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Referencia</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Variantes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredProducts.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <tr
                                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-5 text-center">
                                                {expandedProduct === product.id ? <ChevronUp className="text-primary" size={18} /> : <ChevronDown className="text-slate-300" size={18} />}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                                                        {product.images?.length > 0 ? (
                                                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package size={24} />
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{product.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full">
                                                    {product.category?.name || 'S/C'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center text-xs font-bold text-slate-400">
                                                {product.reference || 'N/A'}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">{product.variants?.length || 0}</span>
                                            </td>
                                        </tr>
                                        {expandedProduct === product.id && (
                                            <tr className="bg-slate-50/30 dark:bg-slate-900/30">
                                                <td colSpan="5" className="px-8 py-8">
                                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-500">
                                                        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Variantes / Medidas</h4>
                                                            <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-xl transition-all border border-primary/20">
                                                                <Plus size={14} /> Agregar Variante
                                                            </button>
                                                        </div>

                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU / Cód. Barras</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pieza / Medida</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Precio</th>
                                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                                    {product.variants?.map((v) => (
                                                                        <tr key={v.sku} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">
                                                                                    {v.sku}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">
                                                                                    {v.dimensions?.map(d => d.dimensionValue).join(' x ') || 'Sin medidas'}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <div className="flex flex-col">
                                                                                    <span className={`text-sm font-black ${v.stock < 10 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                                                                                        {v.stock} Uds.
                                                                                    </span>
                                                                                    {v.stock < 10 && <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest leading-none mt-1">Stock Crítico</span>}
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <p className="text-sm font-black text-slate-900 dark:text-white">
                                                                                    ${Number(v.price).toFixed(2)}
                                                                                </p>
                                                                            </td>
                                                                            <td className="px-8 py-5">
                                                                                <div className="flex items-center justify-end gap-2">
                                                                                    {editingVariant === v.sku ? (
                                                                                        <div className="flex items-center gap-3 animate-in zoom-in-95 duration-200">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={editForm.stock}
                                                                                                    onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                                                                                                    className="w-16 h-10 bg-slate-50 dark:bg-slate-700 border-2 border-primary/20 rounded-xl px-2 text-xs font-black outline-none"
                                                                                                    placeholder="Stock"
                                                                                                />
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={editForm.price}
                                                                                                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                                                                    className="w-20 h-10 bg-slate-50 dark:bg-slate-700 border-2 border-primary/20 rounded-xl px-2 text-xs font-black outline-none"
                                                                                                    placeholder="Precio"
                                                                                                />
                                                                                            </div>
                                                                                            <button
                                                                                                onClick={() => handleUpdateVariant(v.sku)}
                                                                                                className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 transition-transform"
                                                                                            >
                                                                                                <Save size={16} />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => setEditingVariant(null)}
                                                                                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:scale-110 transition-transform"
                                                                                            >
                                                                                                <X size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <>
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    setEditingVariant(v.sku);
                                                                                                    setEditForm({ price: v.price, stock: v.stock });
                                                                                                }}
                                                                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                                                            >
                                                                                                <Edit2 size={16} />
                                                                                            </button>
                                                                                            <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                                                                                <X size={16} className="rotate-45" /> {/* Placeholder for Delete */}
                                                                                            </button>
                                                                                        </>
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
