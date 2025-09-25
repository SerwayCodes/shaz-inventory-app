// assets/api.js

const API_BASE_URL = 'http://localhost:3000/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Product-related API calls
export const productsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  create: (productData) => 
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  update: (id, productData) => 
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  delete: (id) => 
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Stock transactions API calls
export const stockAPI = {
  getTransactions: () => apiCall('/stock-transactions'),
  addTransaction: (transactionData) => 
    apiCall('/stock-transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),
};

// Sales API calls
export const salesAPI = {
  getSales: () => apiCall('/sales'),
};

// Authentication API calls
export const authAPI = {
  login: (credentials) => 
    apiCall('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};