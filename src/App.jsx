import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Quotations from './pages/Quotations';
import NotificationToast from './components/NotificationToast';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/login" />;
    return children;
};

// Componente Wrapper para Layout con Notificaciones global
const AppLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950">
            {children}
            {/* Montar notificaciones sólo si no estamos en el login */}
            {window.location.pathname !== '/login' && <NotificationToast />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/productos" element={
                        <ProtectedRoute>
                            <ProductList />
                        </ProtectedRoute>
                    } />
                    <Route path="/inventario" element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    } />
                    <Route path="/clientes" element={
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    } />
                    <Route path="/cotizaciones" element={
                        <ProtectedRoute>
                            <Quotations />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
