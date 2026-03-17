import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Quotations from './pages/Quotations';
import Categories from './pages/Categories';
import NotificationToast from './components/NotificationToast';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/login" />;
    return children;
};

// Componente Wrapper para Layout con Notificaciones global
const AppLayout = ({ children }) => {
    const location = useLocation();
    const { theme } = useTheme();
    const isAuthenticated = localStorage.getItem('adminToken');
    const isLoginPage = location.pathname === '/login';

    return (
        <div className={theme}>
            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                {children}
                {isAuthenticated && !isLoginPage && <NotificationToast />}
            </div>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
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
                        <Route path="/categorias" element={
                            <ProtectedRoute>
                                <Categories />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </AppLayout>
            </Router>
        </ThemeProvider>
    );
}

export default App;
