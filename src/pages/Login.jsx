import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/adminApi';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const username = credentials.username.toLowerCase().trim();
        const result = await loginAdmin(username, credentials.password);

        if (result.token) {
            localStorage.setItem('adminToken', result.token);
            localStorage.setItem('adminUser', JSON.stringify(result.user));
            navigate('/');
        } else {
            setError(result.error || result.message || 'Credenciales incorrectas');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10">
                        <ShoppingBasket size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                        Volper <span className="text-primary italic">Seal</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gestión Administrativa</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 p-4 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 animate-in fade-in zoom-in duration-300">
                                <AlertCircle size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="USUARIO"
                                    required
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-6 text-sm font-black tracking-widest transition-all outline-none"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="CONTRASEÑA"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-6 text-sm font-black tracking-widest transition-all outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-300"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} Volper Seal Industrial. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
