import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';

import Inventory from './pages/Inventory';
import Customers from './pages/Customers';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <Router>
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
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
