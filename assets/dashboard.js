// assets/script.js

import { productsAPI, stockAPI, salesAPI } from './api.js';

// Global variables
let allProducts = [];
let allCategories = [];
let allSuppliers = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  loadDashboardData();
  loadProducts();
  loadCategories();
  loadSuppliers();
});

// Load dashboard statistics
async function loadDashboardData() {
  try {
    // Load products for total count
    const products = await productsAPI.getAll();
    document.getElementById('totalProducts').textContent = products.length;
    
    // Load stock transactions for today
    const transactions = await stockAPI.getTransactions();
    const today = new Date().toISOString().split('T')[0];
    
    const stockInToday = transactions.filter(t => 
      t.transaction_type === 'in' && 
      t.transaction_date.startsWith(today)
    ).length;
    
    const stockOutToday = transactions.filter(t => 
      t.transaction_type === 'out' && 
      t.transaction_date.startsWith(today)
    ).length;
    
    document.getElementById('stockInToday').textContent = stockInToday;
    document.getElementById('stockOutToday').textContent = stockOutToday;
    
    // Load sales for today
    const sales = await salesAPI.getSales();
    const salesToday = sales.filter(s => 
      s.sale_date.startsWith(today)
    );
    
    const totalSales = salesToday.reduce((sum, sale) => sum + sale.total_amount, 0);
    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
    
    // Load recent activities
    loadRecentActivities(transactions.slice(0, 3));
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    alert('Failed to load dashboard data');
  }
}

// Load products into the table
async function loadProducts() {
  try {
    allProducts = await productsAPI.getAll();
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';
    
    allProducts.forEach(product => {
      const row = document.createElement('tr');
      
      // Determine stock status
      let statusClass = '';
      let statusText = '';
      
      if (product.current_stock <= 0) {
        statusClass = 'out-of-stock';
        statusText = 'Out of Stock';
      } else if (product.current_stock < product.min_stock_level) {
        statusClass = 'low-stock';
        statusText = 'Low Stock';
      } else {
        statusClass = 'in-stock';
        statusText = 'In Stock';
      }
      
      row.innerHTML = `
        <td>${product.sku}</td>
        <td>${product.name}</td>
        <td>${product.category_name|| 'Uncategorized'}</td>
        <td>${product.min_stock_level|| 0}</td>
        <td>$${product.price ? product.price : '0.00'}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
          <button class="action-btn btn-success" onclick="editProduct(${product.product_id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn btn-danger" onclick="deleteProduct(${product.product_id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Failed to load products');
  }
}

// Load categories for dropdown
async function loadCategories() {
  // In a real app, you would have a categories API endpoint
  // For now, we'll use a hardcoded list or extend your server
  allCategories = [
    { category_id: 1, name: 'Electronics' },
    { category_id: 2, name: 'Sports' },
    { category_id: 3, name: 'Home Appliances' },
    { category_id: 4, name: 'Fashion' },
  ];
  
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '<option value="">Select Category</option>';
  
  allCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.category_id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

// Load suppliers for dropdown
async function loadSuppliers() {
  // In a real app, you would have a suppliers API endpoint
  // For now, we'll use a hardcoded list or extend your server
  allSuppliers = [
    { supplier_id: 1, name: 'Supplier A' },
    { supplier_id: 2, name: 'Supplier B' },
    { supplier_id: 3, name: 'Supplier C' },
  ];
  
  const supplierSelect = document.getElementById('supplier');
  supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
  
  allSuppliers.forEach(supplier => {
    const option = document.createElement('option');
    option.value = supplier.supplier_id;
    option.textContent = supplier.name;
    supplierSelect.appendChild(option);
  });
}

// Load recent activities
function loadRecentActivities(activities) {
  const activitiesContainer = document.getElementById('recentActivities');
  activitiesContainer.innerHTML = '';
  
  activities.forEach(activity => {
    const activityEl = document.createElement('div');
    activityEl.style.display = 'flex';
    activityEl.style.alignItems = 'center';
    activityEl.style.padding = '10px 0';
    activityEl.style.borderBottom = '1px solid var(--light-gray)';
    
    let iconBackground = '';
    let iconColor = '';
    let iconClass = '';
    let activityText = '';
    
    if (activity.transaction_type === 'in') {
      iconBackground = '#e6f7ee';
      iconColor = '#00a65a';
      iconClass = 'fas fa-arrow-down';
      activityText = `<strong>Stock In:</strong> ${activity.quantity} units of ${activity.product_name} added`;
    } else if (activity.transaction_type === 'out') {
      iconBackground = '#ffe6e6';
      iconColor = '#f72585';
      iconClass = 'fas fa-arrow-up';
      activityText = `<strong>Stock Out:</strong> ${activity.quantity} units of ${activity.product_name} sold`;
    } else {
      iconBackground = '#fff4e6';
      iconColor = '#f8961e';
      iconClass = 'fas fa-exclamation-triangle';
      activityText = `<strong>System Alert:</strong> ${activity.notes}`;
    }
    
    activityEl.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${iconBackground};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
      ">
        <i class="${iconClass}" style="color: ${iconColor}"></i>
      </div>
      <div>
        <p>${activityText}</p>
        <small>${formatDate(activity.transaction_date)}</small>
      </div>
    `;
    
    activitiesContainer.appendChild(activityEl);
  });
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Add product form submission
document.getElementById('addProductForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const productData = {
    sku: document.getElementById('sku').value,
    name: document.getElementById('productName').value,
    category_id: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value),
    cost: 0, // You might want to add a cost field
    description: document.getElementById('description').value,
    // Add other fields as needed
  };
  
  try {
    await productsAPI.create(productData);
    closeModal();
    loadProducts();
    loadDashboardData(); // Refresh stats
    alert('Product added successfully!');
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Failed to add product');
  }
});

// Edit product
function editProduct(productId) {
  // Implementation for editing a product
  alert(`Edit product with ID: ${productId}`);
  // You would typically open a modal with the product data pre-filled
}
window.editProduct = editProduct;

// Delete product
async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsAPI.delete(productId);
      loadProducts();
      loadDashboardData(); // Refresh stats
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }
}
window.deleteProduct = deleteProduct;
// Filter products based on search input
function filterProducts() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.getElementById('productsTableBody').getElementsByTagName('tr');
  
  for (let i = 0; i < rows.length; i++) {
    const name = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
    const category = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
    
    if (name.includes(searchValue) || category.includes(searchValue)) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}

// Modal functions (unchanged)
function openModal() {
  document.getElementById('addProductModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('addProductModal').style.display = 'none';
  document.getElementById('addProductForm').reset();
}