// Enhanced Inventory Data Structure

// Raw Materials (items purchased from suppliers)
export const rawMaterials = [
  { id: 1, productId: 'RM-001', name: 'Glass Tube', description: 'Standard glass tube for manufacturing', category: 'Raw Material', stock: 500, minStock: 100, unit: 'pcs', price: 50, supplierId: 1, status: 'active', location: 'Warehouse A' },
  { id: 2, productId: 'RM-002', name: 'Outlet Tube', description: 'Single outlet tube component', category: 'Component', stock: 200, minStock: 50, unit: 'pcs', price: 25, supplierId: 1, status: 'active', location: 'Warehouse A' },
  { id: 3, productId: 'RM-003', name: 'Neck Joint', description: 'Additional neck joint for customization', category: 'Component', stock: 100, minStock: 30, unit: 'pcs', price: 35, supplierId: 2, status: 'active', location: 'Warehouse B' },
  { id: 4, productId: 'RM-004', name: 'Flask Cap', description: 'Standard cap for flask opening', category: 'Component', stock: 300, minStock: 80, unit: 'pcs', price: 15, supplierId: 2, status: 'active', location: 'Warehouse B' },
  { id: 5, productId: 'RM-005', name: 'Bubble Wrap', description: 'Protective bubble wrap', category: 'Packaging', stock: 500, minStock: 100, unit: 'sqm', price: 2, supplierId: 3, status: 'active', location: 'Warehouse C' }
]

// Finished Goods (products ready for sale)
export const finishedGoods = [
  { id: 1, productId: 'FG-001', name: 'Round Bottom Flask', description: 'Standard round-bottom receiving flask', category: 'Flask', stock: 100, minStock: 20, unit: 'pcs', price: 150, status: 'active', location: 'Finished Goods Warehouse', components: [{ productId: 'RM-001', quantity: 1 }, { productId: 'RM-002', quantity: 2 }] },
  { id: 2, productId: 'FG-002', name: 'Three-Neck Flask', description: 'Round bottom flask with 3 necks', category: 'Flask', stock: 75, minStock: 15, unit: 'pcs', price: 250, status: 'active', location: 'Finished Goods Warehouse', components: [{ productId: 'RM-001', quantity: 1 }, { productId: 'RM-003', quantity: 3 }] },
  { id: 3, productId: 'FG-003', name: 'Five-Neck Flask', description: 'Round bottom flask with 5 necks', category: 'Flask', stock: 50, minStock: 10, unit: 'pcs', price: 350, status: 'active', location: 'Finished Goods Warehouse', components: [{ productId: 'RM-001', quantity: 1 }, { productId: 'RM-003', quantity: 5 }] }
]

// Stock Movements (inward/outward transactions)
export const stockMovements = [
  { id: 1, type: 'inward', productId: 'RM-001', productName: 'Glass Tube', quantity: 100, date: '2024-01-15', reference: 'PO-001', approvedBy: 'Admin User', authorizedBy: 'Admin User', notes: 'Received from supplier', status: 'completed' },
  { id: 2, type: 'outward', productId: 'FG-001', productName: 'Round Bottom Flask', quantity: 50, date: '2024-01-20', reference: 'SO-001', approvedBy: 'Admin User', authorizedBy: 'Admin User', dispatchedBy: 'Amit Patel', notes: 'Dispatched to customer', status: 'completed' },
  { id: 3, type: 'inward', productId: 'RM-002', productName: 'Outlet Tube', quantity: 200, date: '2024-01-18', reference: 'PO-002', approvedBy: 'Admin User', authorizedBy: 'Admin User', notes: 'Stock replenishment', status: 'completed' }
]

// Suppliers with enhanced details
export const suppliers = [
  { 
    id: 1, 
    name: 'Glass Components Ltd', 
    email: 'contact@glasscomponents.com', 
    phone: '+91-9876543210', 
    address: 'Mumbai, India', 
    gst: 'GST123456789',
    products: ['Glass Tube', 'Outlet Tube'], 
    status: 'active', 
    paymentTerms: 'Net 30',
    totalOrders: 15,
    totalSpent: 125000,
    lastOrderDate: '2024-01-28'
  },
  { 
    id: 2, 
    name: 'Precision Glass Works', 
    email: 'info@precisionglass.com', 
    phone: '+91-9876543211', 
    address: 'Delhi, India', 
    gst: 'GST987654321',
    products: ['Neck Joint', 'Flask Cap'], 
    status: 'active', 
    paymentTerms: 'Net 45',
    totalOrders: 12,
    totalSpent: 98000,
    lastOrderDate: '2024-01-17'
  },
  { 
    id: 3, 
    name: 'Packaging Solutions Inc', 
    email: 'sales@packagingsolutions.com', 
    phone: '+91-9876543212', 
    address: 'Bangalore, India', 
    gst: 'GST456789123',
    products: ['Bubble Wrap', 'Cardboard Box'], 
    status: 'active', 
    paymentTerms: 'Net 30',
    totalOrders: 8,
    totalSpent: 45000,
    lastOrderDate: '2024-01-21'
  }
]

// Purchase Orders with file attachments
export const purchaseOrders = [
  {
    id: 1,
    orderNumber: 'PO-2024-001',
    supplierId: 1,
    supplierName: 'Glass Components Ltd',
    date: '2024-01-10',
    items: [
      { productId: 'RM-001', productName: 'Glass Tube', quantity: 100, unitPrice: 50, total: 5000, receivedQuantity: 100, damagedQuantity: 0, excessQuantity: 0 }
    ],
    totalAmount: 5000,
    status: 'completed', // pending, in_progress, completed
    expectedDelivery: '2024-01-20',
    receivedDate: '2024-01-18',
    receivedBy: 'Amit Patel',
    inspectedBy: 'Rajesh Kumar',
    inspectionDate: '2024-01-18',
    inspectionStatus: 'passed', // pending, passed, failed
    orderFile: null, // File upload for order document
    invoiceFile: null, // File upload for supplier invoice
    notes: 'Order placed for production requirement',
    damages: [] // Array of damaged items
  },
  {
    id: 2,
    orderNumber: 'PO-2024-002',
    supplierId: 1,
    supplierName: 'Glass Components Ltd',
    date: '2024-01-15',
    items: [
      { productId: 'RM-002', productName: 'Outlet Tube', quantity: 200, unitPrice: 25, total: 5000, receivedQuantity: 220, damagedQuantity: 5, excessQuantity: 15 }
    ],
    totalAmount: 5000,
    status: 'in_progress',
    expectedDelivery: '2024-01-25',
    receivedDate: '2024-01-23',
    receivedBy: 'Amit Patel',
    inspectedBy: null,
    inspectionDate: null,
    inspectionStatus: 'pending',
    orderFile: null,
    invoiceFile: null,
    notes: 'Excess items received - 15 units extra',
    damages: [
      { productId: 'RM-002', productName: 'Outlet Tube', quantity: 5, reason: 'Transport damage', status: 'reported' }
    ]
  },
  {
    id: 3,
    orderNumber: 'PO-2024-003',
    supplierId: 2,
    supplierName: 'Precision Glass Works',
    date: '2024-01-12',
    items: [
      { productId: 'RM-003', productName: 'Neck Joint', quantity: 75, unitPrice: 35, total: 2625, receivedQuantity: 75, damagedQuantity: 0, excessQuantity: 0 },
      { productId: 'RM-004', productName: 'Flask Cap', quantity: 100, unitPrice: 15, total: 1500, receivedQuantity: 100, damagedQuantity: 0, excessQuantity: 0 }
    ],
    totalAmount: 4125,
    status: 'completed',
    expectedDelivery: '2024-01-22',
    receivedDate: '2024-01-20',
    receivedBy: 'Amit Patel',
    inspectedBy: 'Rajesh Kumar',
    inspectionDate: '2024-01-20',
    inspectionStatus: 'passed',
    orderFile: null,
    invoiceFile: null,
    notes: 'All items received in good condition',
    damages: []
  }
]

// Customer Orders with file attachments and invoice generation
export const customerOrders = [
  {
    id: 1,
    orderNumber: 'CO-2024-001',
    customerId: 1,
    customerName: 'ABC Laboratories',
    date: '2024-01-10',
    items: [
      { productId: 'FG-001', productName: 'Round Bottom Flask', quantity: 50, unitPrice: 150, total: 7500, deliveredQuantity: 50, damagedQuantity: 5 }
    ],
    totalAmount: 7500,
    status: 'delivered', // pending, in_production, ready, delivered
    deliveryDate: '2024-01-25',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-01-10',
    orderFile: null, // Customer order document
    invoiceFile: null, // Generated invoice
    deliveryChallanFile: null, // Delivery challan
    notes: 'Customer order for laboratory equipment',
    productionStatus: 'completed',
    componentsCheck: { available: true, missingItems: [] },
    damages: [
      { productId: 'FG-001', productName: 'Round Bottom Flask', quantity: 5, reason: 'Transport damage', status: 'replaced' }
    ]
  },
  {
    id: 2,
    orderNumber: 'CO-2024-002',
    customerId: 2,
    customerName: 'XYZ Research Institute',
    date: '2024-01-12',
    items: [
      { productId: 'FG-002', productName: 'Three-Neck Flask', quantity: 100, unitPrice: 250, total: 25000, deliveredQuantity: 100, damagedQuantity: 0 }
    ],
    totalAmount: 25000,
    status: 'delivered',
    deliveryDate: '2024-02-05',
    invoiceNumber: 'INV-2024-002',
    invoiceDate: '2024-01-12',
    orderFile: null,
    invoiceFile: null,
    deliveryChallanFile: null,
    notes: 'Bulk order for research facility',
    productionStatus: 'completed',
    componentsCheck: { available: true, missingItems: [] },
    damages: []
  },
  {
    id: 3,
    orderNumber: 'CO-2024-003',
    customerId: 1,
    customerName: 'ABC Laboratories',
    date: '2024-01-20',
    items: [
      { productId: 'FG-001', productName: 'Round Bottom Flask', quantity: 30, unitPrice: 150, total: 4500, producedQuantity: 30, deliveredQuantity: 0, goodQuantity: 0, damagedQuantity: 0, excessQuantity: 0 }
    ],
    totalAmount: 4500,
    status: 'ready',
    deliveryDate: '2024-02-10',
    invoiceNumber: 'INV-2024-003',
    invoiceDate: '2024-01-20',
    orderFile: null,
    invoiceFile: null,
    deliveryChallanFile: null,
    notes: 'Follow-up order - Ready for delivery',
    productionStatus: 'completed',
    componentsCheck: { available: true, missingItems: [] },
    damages: [],
    replacementOrderId: null,
    cancelledAt: null,
    cancelledBy: null
  },
  {
    id: 4,
    orderNumber: 'CO-2024-004',
    customerId: 2,
    customerName: 'XYZ Research Institute',
    date: '2024-01-25',
    items: [
      { productId: 'FG-002', productName: 'Three-Neck Flask', quantity: 25, unitPrice: 250, total: 6250, producedQuantity: 30, deliveredQuantity: 0, goodQuantity: 0, damagedQuantity: 0, excessQuantity: 5 }
    ],
    totalAmount: 6250,
    status: 'in_transit',
    deliveryDate: '2024-02-15',
    invoiceNumber: 'INV-2024-004',
    invoiceDate: '2024-01-25',
    orderFile: null,
    invoiceFile: null,
    deliveryChallanFile: null,
    notes: 'Order with excess items - In transit',
    productionStatus: 'completed',
    componentsCheck: { available: true, missingItems: [] },
    damages: [],
    replacementOrderId: null,
    cancelledAt: null,
    cancelledBy: null,
    deliveredBy: 'Delivery Team',
    deliveryDate: '2024-02-01'
  }
]

// Customers
export const customers = [
  { 
    id: 1, 
    name: 'ABC Laboratories', 
    email: 'procurement@abclabs.com', 
    phone: '+91-9876543301', 
    address: 'Pune, India', 
    gst: 'GST123456789', 
    status: 'active', 
    creditLimit: 500000,
    totalOrders: 8,
    totalSpent: 125000,
    lastOrderDate: '2024-01-20'
  },
  { 
    id: 2, 
    name: 'XYZ Research Institute', 
    email: 'orders@xyzresearch.com', 
    phone: '+91-9876543302', 
    address: 'Hyderabad, India', 
    gst: 'GST987654321', 
    status: 'active', 
    creditLimit: 750000,
    totalOrders: 5,
    totalSpent: 98000,
    lastOrderDate: '2024-01-12'
  },
  { 
    id: 3, 
    name: 'Global Pharma Solutions', 
    email: 'purchase@globalpharma.com', 
    phone: '+91-9876543303', 
    address: 'Chennai, India', 
    gst: 'GST456789123', 
    status: 'active', 
    creditLimit: 1000000,
    totalOrders: 3,
    totalSpent: 75000,
    lastOrderDate: '2024-01-15'
  }
]

// Damaged Items Tracking
export const damagedItems = [
  { id: 1, productId: 'FG-001', productName: 'Round Bottom Flask', quantity: 5, reason: 'Transport damage', date: '2024-01-25', location: 'Delivery', status: 'replaced', orderNumber: 'CO-2024-001' },
  { id: 2, productId: 'RM-002', productName: 'Outlet Tube', quantity: 5, reason: 'Transport damage from supplier', date: '2024-01-23', location: 'Warehouse A', status: 'reported', orderNumber: 'PO-2024-002' },
  { id: 3, productId: 'FG-001', productName: 'Round Bottom Flask', quantity: 2, reason: 'Quality defect', date: '2024-01-18', location: 'Production', status: 'scrap' }
]

// Helper functions
export const getRawMaterials = () => rawMaterials
export const getFinishedGoods = () => finishedGoods
export const getStockMovements = () => stockMovements
export const getSuppliers = () => suppliers
export const getPurchaseOrders = () => purchaseOrders
export const getCustomerOrders = () => customerOrders
export const getCustomers = () => customers
export const getDamagedItems = () => damagedItems

// Get product by ID
export const getProductById = (productId) => {
  const allProducts = [...rawMaterials, ...finishedGoods]
  return allProducts.find(p => p.productId === productId)
}

// Check component availability for production
export const checkComponentAvailability = (productId, requiredQuantity) => {
  const product = getProductById(productId)
  if (!product || !product.components) return { available: false, missingItems: [] }
  
  const missingItems = []
  for (const component of product.components) {
    const componentProduct = getProductById(component.productId)
    if (!componentProduct || componentProduct.stock < (component.quantity * requiredQuantity)) {
      missingItems.push({
        productId: component.productId,
        productName: componentProduct?.name || component.productId,
        required: component.quantity * requiredQuantity,
        available: componentProduct?.stock || 0
      })
    }
  }
  
  return {
    available: missingItems.length === 0,
    missingItems
  }
}

// Update raw material stock
export const updateRawMaterialStock = (productId, quantity) => {
  const material = rawMaterials.find(rm => rm.productId === productId)
  if (material) {
    material.stock = Math.max(0, material.stock + quantity)
  }
}

// Update finished goods stock
export const updateFinishedGoodsStock = (productId, quantity) => {
  const product = finishedGoods.find(fg => fg.productId === productId)
  if (product) {
    product.stock = Math.max(0, product.stock + quantity)
  }
}

// Add new raw material
export const addRawMaterial = (material) => {
  rawMaterials.push(material)
}

// Add new finished good
export const addFinishedGood = (product) => {
  finishedGoods.push(product)
}

