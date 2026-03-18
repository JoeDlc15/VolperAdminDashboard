const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'vscode-browser-req': 'true',
        'Bypass-Tunnel-Reminder': 'true'
    };
};

export const getAdminQuotations = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/cotizaciones`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener cotizaciones');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return [];
    }
};

export const getAdminQuotationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/cotizaciones/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener la cotización');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return null;
    }
};

export const loginAdmin = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Auth API Error:', error);
        return { success: false, message: 'Error de conexión' };
    }
};

// --- Product Management ---

export const getAdminProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener productos');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return [];
    }
};

export const updateVariant = async (sku, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/variantes/${sku}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al actualizar variante');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return null;
    }
};

// --- MOVIMIENTOS DE INVENTARIO (KARDEX) ---

export const getAdminMovements = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/movements`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener movimientos');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return [];
    }
};

export const createMovement = async (movementData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/movements`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(movementData)
        });
        if (!response.ok) throw new Error('Error al registrar movimiento');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return { success: false, error: error.message };
    }
};

// --- GESTIÓN DE CLIENTES ---

export const getAdminCustomers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/customers`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener clientes');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return [];
    }
};

export const createCustomer = async (customerData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/customers`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(customerData)
        });
        if (!response.ok) throw new Error('Error al crear cliente');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return null;
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(customerData)
        });
        if (!response.ok) throw new Error('Error al actualizar cliente');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return null;
    }
};

// --- GESTIÓN DE CATEGORÍAS ---

export const getAdminCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener categorías');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return [];
    }
};

export const createAdminCategory = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al crear categoría');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return null;
    }
};

export const updateAdminCategory = async (id, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al actualizar categoría');
        return await response.json();
    } catch (error) {
        console.error('Admin API Error:', error);
        return null;
    }
};

export const deleteAdminCategory = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al eliminar categoría');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        return { error: error.message };
    }
};

export const importAdminProducts = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/admin/products/import`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al importar productos');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
};

export const createAdminProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear producto');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
};

export const updateAdminProduct = async (id, productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar producto');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
};

export const deleteAdminProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al eliminar producto');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
};

export const addAdminVariant = async (productId, variantData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/variants`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(variantData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al agregar variante');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
};

export const deleteAdminVariant = async (sku) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/variants/${sku}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al eliminar variante');
        return data;
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
};
