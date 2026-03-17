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
    AlertCircle,
    RotateCcw,
    Upload
} from 'lucide-react';
import { getAdminProducts, updateVariant, importAdminProducts } from '../services/adminApi';
import Sidebar from '../components/Sidebar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);
    const [editType, setEditType] = useState('full'); // 'stock' | 'full'
    const [editForm, setEditForm] = useState({ price: '', stock: '', name: '' });
    const [message, setMessage] = useState(null);
    const [importModal, setImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResults, setImportResults] = useState(null);

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
            price: editType === 'full' ? parseFloat(editForm.price) : undefined,
            stock: parseInt(editForm.stock),
            name: editType === 'full' ? editForm.name : undefined
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

    const handleImport = async () => {
        if (!importFile) return;
        setImporting(true);
        try {
            const result = await importAdminProducts(importFile);
            setImportResults(result.stats);
            fetchProducts();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setImporting(false);
        }
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
                        <button
                            onClick={() => setImportModal(true)}
                            className="h-11 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <Upload size={16} /> Importar
                        </button>
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

                    {importModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="glass-surface w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Importación Masiva</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sube tu archivo CSV o XLSX</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setImportModal(false);
                                            setImportFile(null);
                                            setImportResults(null);
                                        }}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                {!importResults ? (
                                    <div className="space-y-6">
                                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center group hover:border-primary/30 transition-colors">
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={(e) => setImportFile(e.target.files[0])}
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="text-primary" size={32} />
                                                </div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                                                    {importFile ? importFile.name : 'Seleccionar Archivo'}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CSV o Excel (.xlsx)</p>
                                            </label>
                                        </div>

                                        <button
                                            onClick={handleImport}
                                            disabled={!importFile || importing}
                                            className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {importing ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Procesando...
                                                </>
                                            ) : (
                                                'Iniciar Importación'
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100/50 text-center">
                                                <p className="text-lg font-black text-emerald-600">{importResults.created}</p>
                                                <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">Creados</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100/50 text-center">
                                                <p className="text-lg font-black text-blue-600">{importResults.updated}</p>
                                                <p className="text-[8px] font-black text-blue-600/60 uppercase tracking-widest">Actualizados</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                                <p className="text-lg font-black text-slate-400">{importResults.skipped}</p>
                                                <p className="text-[8px] font-black text-slate-400/60 uppercase tracking-widest">Omitidos</p>
                                            </div>
                                        </div>

                                        {importResults.errors?.length > 0 && (
                                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100/50">
                                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3">Errores Encontrados:</p>
                                                <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                    {importResults.errors.map((err, i) => (
                                                        <p key={i} className="text-[10px] font-bold text-rose-500/80 leading-relaxed">• {err}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                setImportModal(false);
                                                setImportFile(null);
                                                setImportResults(null);
                                            }}
                                            className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                )}
                            </div>
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
                                                                                        <span className={`text-sm font-black ${v.stock <= 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/40 px-2 py-0.5 rounded-lg border border-rose-200 animate-pulse' : v.stock < 10 ? 'text-orange-500 animate-pulse-slow' : 'text-slate-900 dark:text-white'}`}>
                                                                                            {v.stock}
                                                                                        </span>
                                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{v.unit}</span>
                                                                                    </div>
                                                                                    {v.stock <= 0 ? (
                                                                                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest leading-none mt-1">Sin Stock</span>
                                                                                    ) : v.stock < 10 && (
                                                                                        <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest leading-none mt-1">Bajo Stock</span>
                                                                                    )}
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
                                                                                                {editType === 'full' && (
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        value={editForm.name}
                                                                                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                                                                        className="w-32 h-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 text-xs font-bold outline-none focus:border-primary/50"
                                                                                                        placeholder="Nombre"
                                                                                                    />
                                                                                                )}
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={editForm.stock}
                                                                                                    onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                                                                                                    className="w-20 h-9 bg-primary/5 dark:bg-primary/20 border-2 border-primary/30 rounded-xl px-2 text-xs font-black outline-none focus:border-primary transition-all"
                                                                                                    placeholder="Stock"
                                                                                                />
                                                                                                {editType === 'full' && (
                                                                                                    <input
                                                                                                        type="number"
                                                                                                        value={editForm.price}
                                                                                                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                                                                        className="w-20 h-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 text-xs font-black outline-none focus:border-primary/50"
                                                                                                        placeholder="Precio"
                                                                                                    />
                                                                                                )}
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
                                                                                                    setEditType('stock');
                                                                                                    setEditingVariant(v.sku);
                                                                                                    setEditForm({ price: v.price, stock: v.stock, name: v.name });
                                                                                                }}
                                                                                                className="flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-xl transition-all border border-primary/20"
                                                                                                title="Ajuste Rápido de Stock"
                                                                                            >
                                                                                                <RotateCcw size={12} /> Stock
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    setEditType('full');
                                                                                                    setEditingVariant(v.sku);
                                                                                                    setEditForm({ price: v.price, stock: v.stock, name: v.name });
                                                                                                }}
                                                                                                className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                                                                                title="Editar información completa"
                                                                                            >
                                                                                                <Edit2 size={16} />
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
