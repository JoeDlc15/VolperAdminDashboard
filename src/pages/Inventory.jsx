import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    TrendingUp,
    TrendingDown,
    RotateCcw,
    Package,
    X,
    Save,
    Loader2,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Filter,
    Calendar,
    ArrowRightLeft
} from 'lucide-react';
import { getAdminProducts, getAdminMovements, createMovement } from '../services/adminApi';
import Sidebar from '../components/Sidebar';

const MOVEMENT_TYPES = {
    entrada: { label: "Entrada", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20", icon: TrendingUp },
    salida: { label: "Salida", color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20", icon: TrendingDown },
    ajuste: { label: "Ajuste", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20", icon: RotateCcw },
    devolucion: { label: "Devolución", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20", icon: RotateCcw }
};

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("stock"); // stock | kardex
    const [showMovementForm, setShowMovementForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [filterProduct, setFilterProduct] = useState("");

    const [movForm, setMovForm] = useState({
        productId: "",
        variantId: "",
        movementType: "entrada",
        quantity: 1,
        unitCost: 0,
        reason: "",
        reference: "",
        supplier: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [prods, movs] = await Promise.all([
            getAdminProducts(),
            getAdminMovements()
        ]);
        setProducts(prods || []);
        setMovements(movs || []);
        setLoading(false);
    };

    const handleSaveMovement = async () => {
        if (!movForm.productId || !movForm.variantId || !movForm.quantity) return;
        setSaving(true);

        const qty = movForm.movementType === 'salida' ? -Math.abs(Number(movForm.quantity)) : Math.abs(Number(movForm.quantity));

        const result = await createMovement({
            ...movForm,
            quantity: qty
        });

        if (result.success) {
            setShowMovementForm(false);
            setMovForm({ productId: "", variantId: "", movementType: "entrada", quantity: 1, unitCost: 0, reason: "", reference: "", supplier: "" });
            fetchData();
        } else {
            alert('Error al registrar movimiento: ' + (result.error || 'Intente nuevamente'));
        }
        setSaving(false);
    };

    const filteredProducts = products.flatMap(p =>
        p.variants.map(v => ({
            ...v,
            productName: p.name,
            category: p.category?.name || 'S/C',
            imageUrl: p.images?.[0]?.url,
            productId: p.id
        }))
    ).filter(v =>
        v.productName.toLowerCase().includes(search.toLowerCase()) ||
        v.sku.toLowerCase().includes(search.toLowerCase())
    );

    const filteredMovements = movements.filter(m =>
        (!filterProduct || m.productId === parseInt(filterProduct)) &&
        (m.product?.name.toLowerCase().includes(search.toLowerCase()) || !search)
    );

    const lowStockItems = filteredProducts.filter(v => v.stock <= v.minStock);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Inventario & Kardex</h2>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab("stock")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "stock" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Stock Actual
                            </button>
                            <button
                                onClick={() => setActiveTab("kardex")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "kardex" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Movimientos
                            </button>
                        </div>
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
                            onClick={() => setShowMovementForm(true)}
                            className="h-11 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6 flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <ArrowRightLeft size={16} /> Registrar Movimiento
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {lowStockItems.length > 0 && activeTab === "stock" && (
                        <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <AlertTriangle className="text-rose-600 flex-shrink-0" size={20} />
                            <div>
                                <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Alerta de Stock Bajo</p>
                                <p className="text-[10px] font-bold text-rose-500/80 uppercase">Hay {lowStockItems.length} productos operando por debajo del mínimo establecido.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "stock" ? (
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto / Variant</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Stock</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Mínimo</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {filteredProducts.map((v) => (
                                        <tr key={v.sku} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${v.stock <= v.minStock ? 'bg-rose-50/30' : ''}`}>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                                                        {v.imageUrl ? <img src={v.imageUrl} className="w-full h-full object-cover" /> : <Package size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{v.productName}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.name || 'Estándar'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{v.sku}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <p className={`text-sm font-black ${v.stock <= v.minStock ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{v.stock} <span className="text-[10px] font-bold text-slate-400">{v.unit}</span></p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <p className="text-sm font-bold text-slate-400">{v.minStock} {v.unit}</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {v.stock <= v.minStock ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                                                        <AlertTriangle size={10} /> Reabastecer
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                        Saludable
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha / Hora</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Cantidad</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Balance</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Referencia</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {filteredMovements.map((mov) => {
                                        const typeInfo = MOVEMENT_TYPES[mov.movementType] || MOVEMENT_TYPES.ajuste;
                                        const TypeIcon = typeInfo.icon;
                                        return (
                                            <tr key={mov.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar size={14} />
                                                        <span className="text-xs font-bold">{new Date(mov.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-0.5">{mov.product?.name}</p>
                                                    <p className="text-[10px] font-black text-primary tracking-widest">{mov.variant?.sku}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${typeInfo.color}`}>
                                                        <TypeIcon size={10} /> {typeInfo.label}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-5 text-right font-black text-sm ${mov.quantity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <p className="text-xs font-black text-slate-900 dark:text-white">{mov.resultingStock}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase">Antes: {mov.previousStock}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-xs text-slate-400 font-bold uppercase truncate max-w-[150px]">
                                                    {mov.reference || mov.reason || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal para nuevo movimiento */}
            {showMovementForm && (
                <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Registrar Movimiento</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Actualiza el stock y genera historial</p>
                            </div>
                            <button onClick={() => setShowMovementForm(false)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(MOVEMENT_TYPES).map(([type, info]) => {
                                    const Icon = info.icon;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setMovForm({ ...movForm, movementType: type })}
                                            className={`p-4 rounded-2xl border-2 flex flex-col gap-2 transition-all ${movForm.movementType === type ? 'border-primary bg-primary/5 dark:bg-primary/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                                        >
                                            <Icon size={20} className={movForm.movementType === type ? 'text-primary' : 'text-slate-400'} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${movForm.movementType === type ? 'text-primary' : 'text-slate-500'}`}>{info.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Producto & Variante</label>
                                    <select
                                        value={`${movForm.productId}-${movForm.variantId}`}
                                        onChange={(e) => {
                                            const [pId, vId] = e.target.value.split('-');
                                            setMovForm({ ...movForm, productId: pId, variantId: vId });
                                        }}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                    >
                                        <option value="">Seleccionar SKU...</option>
                                        {products.map(p =>
                                            p.variants.map(v => (
                                                <option key={v.id} value={`${p.id}-${v.id}`}>{p.name} - {v.sku} ({v.name || 'Estándar'})</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Cantidad</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={movForm.quantity}
                                            onChange={e => setMovForm({ ...movForm, quantity: e.target.value })}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-black transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Referencia</label>
                                        <input
                                            type="text"
                                            placeholder="Factura, OS, etc."
                                            value={movForm.reference}
                                            onChange={e => setMovForm({ ...movForm, reference: e.target.value })}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                            <button
                                onClick={() => setShowMovementForm(false)}
                                className="flex-1 h-14 bg-white dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveMovement}
                                disabled={saving}
                                className="flex-1 h-14 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Registrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
