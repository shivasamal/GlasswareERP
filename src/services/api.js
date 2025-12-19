// API Service Layer - Ready for backend integration
// Replace all TODO comments with actual API calls when backend is ready

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

// Raw Materials API
export const rawMaterialsAPI = {
  // Get all raw materials
  getAll: async () => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/raw-materials`).then(res => res.json())
    return { data: [], error: null }
  },

  // Update raw material stock
  updateStock: async (productId, quantityToAdd) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/raw-materials/${productId}/stock`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ quantityToAdd })
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  // Create new raw material
  create: async (materialData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/raw-materials`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(materialData)
    // }).then(res => res.json())
    return { success: true, data: materialData, error: null }
  },

  // Update raw material
  update: async (id, materialData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/raw-materials/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(materialData)
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  // Delete raw material
  delete: async (id) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/raw-materials/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json())
    return { success: true, error: null }
  }
}

// Purchase Orders API
export const purchaseOrdersAPI = {
  // Get all purchase orders
  getAll: async () => {
    // TODO: Replace with actual API call
    return { data: [], error: null }
  },

  // Create purchase order
  create: async (orderData) => {
    // TODO: Replace with actual API call
    return { success: true, data: orderData, error: null }
  },

  // Update purchase order
  update: async (id, orderData) => {
    // TODO: Replace with actual API call
    return { success: true, error: null }
  },

  // Save inspection
  saveInspection: async (id, inspectionData) => {
    // TODO: Replace with actual API call
    return { success: true, error: null }
  },

  // Process excess items
  processExcessItems: async (orderId, excessItems) => {
    // TODO: Replace with actual API call
    return { success: true, error: null }
  },

  // Download PDF
  downloadPDF: async (orderId) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/purchase-orders/${orderId}/pdf`, {
    //   method: 'GET',
    //   headers: { 'Accept': 'application/pdf' }
    // }).then(res => res.blob())
    return null
  }
}

// Customer Orders API
export const customerOrdersAPI = {
  getAll: async () => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders`).then(res => res.json())
    return { data: [], error: null }
  },

  create: async (orderData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // }).then(res => res.json())
    return { success: true, data: orderData, error: null }
  },

  update: async (id, orderData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  delete: async (id) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  // Update order status
  updateStatus: async (id, status) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${id}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  // Save delivery inspection
  saveDelivery: async (id, deliveryData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${id}/delivery`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(deliveryData)
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  // Create replacement order
  createReplacement: async (originalOrderId, replacementData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${originalOrderId}/replacement`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(replacementData)
    // }).then(res => res.json())
    return { success: true, data: replacementData, error: null }
  },

  // Cancel order and return to inventory
  cancel: async (id, cancellationData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${id}/cancel`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(cancellationData)
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  // Generate invoice PDF
  generateInvoice: async (orderId) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${orderId}/invoice`, {
    //   method: 'GET',
    //   headers: { 'Accept': 'application/pdf' }
    // }).then(res => res.blob())
    return { success: true, pdfUrl: '', error: null }
  },

  // Download order PDF
  downloadPDF: async (orderId) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/customer-orders/${orderId}/pdf`, {
    //   method: 'GET',
    //   headers: { 'Accept': 'application/pdf' }
    // }).then(res => res.blob())
    return null
  }
}

// Finished Goods API
export const finishedGoodsAPI = {
  getAll: async () => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/finished-goods`).then(res => res.json())
    return { data: [], error: null }
  },

  updateStock: async (productId, quantityToAdd) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/finished-goods/${productId}/stock`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ quantityToAdd })
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  create: async (productData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/finished-goods`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(productData)
    // }).then(res => res.json())
    return { success: true, data: productData, error: null }
  },

  update: async (id, productData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/finished-goods/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(productData)
    // }).then(res => res.json())
    return { success: true, error: null }
  },

  delete: async (id) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/finished-goods/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json())
    return { success: true, error: null }
  }
}

// Stock Movements API
export const stockMovementsAPI = {
  getAll: async () => {
    // TODO: Replace with actual API call
    return { data: [], error: null }
  },

  create: async (movementData) => {
    // TODO: Replace with actual API call
    return { success: true, data: movementData, error: null }
  }
}

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    // TODO: Replace with actual API call
    return { data: [], error: null }
  },

  create: async (supplierData) => {
    // TODO: Replace with actual API call
    return { success: true, data: supplierData, error: null }
  },

  update: async (id, supplierData) => {
    // TODO: Replace with actual API call
    return { success: true, error: null }
  }
}

// Reports API
export const reportsAPI = {
  getDashboardStats: async (period) => {
    // TODO: Replace with actual API call
    return { data: {}, error: null }
  },

  generatePDF: async (reportType, period) => {
    // TODO: Replace with actual API call
    return { success: true, pdfUrl: '', error: null }
  }
}

