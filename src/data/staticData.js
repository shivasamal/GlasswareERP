// Users and Roles
export const roles = [
  { id: 1, name: 'Admin', modules: ['dashboard', 'inventory', 'production', 'sales', 'purchase', 'hr', 'accounting', 'analytics'] },
  { id: 2, name: 'Inventory Manager', modules: ['dashboard', 'inventory', 'production'] },
  { id: 3, name: 'Sales Manager', modules: ['dashboard', 'sales', 'purchase'] },
  { id: 4, name: 'Production Manager', modules: ['dashboard', 'production', 'inventory'] },
  { id: 5, name: 'HR Manager', modules: ['dashboard', 'hr'] },
  { id: 6, name: 'Accountant', modules: ['dashboard', 'accounting'] }
]

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@glassware.com', password: 'admin123', roleId: 1 },
  { id: 2, name: 'Inventory Manager', email: 'inventory@glassware.com', password: 'inv123', roleId: 2 },
  { id: 3, name: 'Sales Manager', email: 'sales@glassware.com', password: 'sales123', roleId: 3 },
  { id: 4, name: 'Production Manager', email: 'production@glassware.com', password: 'prod123', roleId: 4 },
  { id: 5, name: 'HR Manager', email: 'hr@glassware.com', password: 'hr123', roleId: 5 },
  { id: 6, name: 'Accountant', email: 'accountant@glassware.com', password: 'acc123', roleId: 6 }
]

// Base Products (Manufactured in-house)
export const baseProducts = [
  { id: 1, code: 'RBR-117', name: 'Round Bottom Flask', description: 'Standard round-bottom receiving flask', category: 'Flask', stock: 100, minStock: 20, unit: 'pcs', price: 150, status: 'active' },
  { id: 2, code: 'RB-121', name: 'Three-Neck Round Bottom Flask', description: 'Round bottom flask with 3 necks', category: 'Flask', stock: 75, minStock: 15, unit: 'pcs', price: 250, status: 'active' },
  { id: 3, code: 'RB-122', name: 'Five-Neck Round Bottom Flask', description: 'Round bottom flask with 5 necks', category: 'Flask', stock: 50, minStock: 10, unit: 'pcs', price: 350, status: 'active' },
  { id: 4, code: 'RR-110', name: 'Rasching Rings', description: 'Packing rings for columns', category: 'Accessories', stock: 500, minStock: 100, unit: 'pcs', price: 5, status: 'active' },
  { id: 5, code: 'CLV-111', name: 'Fractionating Column', description: 'Vigruex fractionating column', category: 'Column', stock: 30, minStock: 5, unit: 'pcs', price: 450, status: 'active' },
  { id: 6, code: 'DS-112', name: 'Dean & Stark Apparatus', description: 'Plain receiver only', category: 'Apparatus', stock: 25, minStock: 5, unit: 'pcs', price: 300, status: 'active' }
]

// Components (Purchased from suppliers for customization)
export const components = [
  { id: 1, code: 'OUT-001', name: 'Single Outlet Tube', description: 'Standard outlet tube for flask customization', category: 'Outlet', stock: 200, minStock: 50, unit: 'pcs', price: 25, supplierId: 1, status: 'active' },
  { id: 2, code: 'OUT-002', name: 'Double Outlet Tube', description: 'Double outlet tube assembly', category: 'Outlet', stock: 150, minStock: 40, unit: 'pcs', price: 45, supplierId: 1, status: 'active' },
  { id: 3, code: 'NECK-001', name: 'Additional Neck Joint', description: 'Ground glass joint for adding necks', category: 'Joint', stock: 100, minStock: 30, unit: 'pcs', price: 35, supplierId: 2, status: 'active' },
  { id: 4, code: 'CAP-001', name: 'Flask Cap', description: 'Standard cap for flask opening', category: 'Cap', stock: 300, minStock: 80, unit: 'pcs', price: 15, supplierId: 2, status: 'active' }
]

// Packaging Materials
export const packaging = [
  { id: 1, code: 'PKG-001', name: 'Bubble Wrap', description: 'Protective bubble wrap', category: 'Protection', stock: 500, minStock: 100, unit: 'sqm', price: 2, supplierId: 3, status: 'active' },
  { id: 2, code: 'PKG-002', name: 'Cardboard Box Small', description: 'Small cardboard box for single items', category: 'Box', stock: 200, minStock: 50, unit: 'pcs', price: 10, supplierId: 3, status: 'active' },
  { id: 3, code: 'PKG-003', name: 'Cardboard Box Large', description: 'Large cardboard box for multiple items', category: 'Box', stock: 100, minStock: 25, unit: 'pcs', price: 20, supplierId: 3, status: 'active' },
  { id: 4, code: 'PKG-004', name: 'Foam Padding', description: 'Foam padding for fragile items', category: 'Protection', stock: 300, minStock: 75, unit: 'sqm', price: 3, supplierId: 3, status: 'active' }
]

// Damaged/Scrap Items
export const damagedItems = [
  { id: 1, productCode: 'RBR-117', productName: 'Round Bottom Flask', quantity: 5, reason: 'Broken during production', date: '2024-01-15', location: 'Warehouse A', status: 'scrap' },
  { id: 2, productCode: 'RB-121', productName: 'Three-Neck Round Bottom Flask', quantity: 2, reason: 'Quality defect', date: '2024-01-18', location: 'Production', status: 'damaged' },
  { id: 3, productCode: 'OUT-001', productName: 'Single Outlet Tube', quantity: 10, reason: 'Transport damage', date: '2024-01-20', location: 'Warehouse B', status: 'scrap' }
]

// Suppliers
export const suppliers = [
  { id: 1, name: 'Glass Components Ltd', email: 'contact@glasscomponents.com', phone: '+91-9876543210', address: 'Mumbai, India', products: ['Outlets', 'Joints'], status: 'active', paymentTerms: 'Net 30' },
  { id: 2, name: 'Precision Glass Works', email: 'info@precisionglass.com', phone: '+91-9876543211', address: 'Delhi, India', products: ['Joints', 'Caps'], status: 'active', paymentTerms: 'Net 45' },
  { id: 3, name: 'Packaging Solutions Inc', email: 'sales@packagingsolutions.com', phone: '+91-9876543212', address: 'Bangalore, India', products: ['Boxes', 'Protection Materials'], status: 'active', paymentTerms: 'Net 30' }
]

// Customers
export const customers = [
  { id: 1, name: 'ABC Laboratories', email: 'procurement@abclabs.com', phone: '+91-9876543301', address: 'Pune, India', gst: 'GST123456789', status: 'active', creditLimit: 500000 },
  { id: 2, name: 'XYZ Research Institute', email: 'orders@xyzresearch.com', phone: '+91-9876543302', address: 'Hyderabad, India', gst: 'GST987654321', status: 'active', creditLimit: 750000 },
  { id: 3, name: 'Global Pharma Solutions', email: 'purchase@globalpharma.com', phone: '+91-9876543303', address: 'Chennai, India', gst: 'GST456789123', status: 'active', creditLimit: 1000000 }
]

// Sales Orders
export const salesOrders = [
  {
    id: 1,
    orderNumber: 'SO-2024-001',
    customerId: 1,
    customerName: 'ABC Laboratories',
    date: '2024-01-10',
    items: [
      { productCode: 'RBR-117', productName: 'Round Bottom Flask', quantity: 50, customization: 'Add 2 outlet tubes', unitPrice: 200, total: 10000, status: 'pending' }
    ],
    totalAmount: 10000,
    status: 'pending',
    deliveryDate: '2024-01-25',
    customizationRequired: true
  },
  {
    id: 2,
    orderNumber: 'SO-2024-002',
    customerId: 2,
    customerName: 'XYZ Research Institute',
    date: '2024-01-12',
    items: [
      { productCode: 'RB-121', productName: 'Three-Neck Round Bottom Flask', quantity: 100, customization: 'None', unitPrice: 250, total: 25000, status: 'in_production' },
      { productCode: 'RB-122', productName: 'Five-Neck Round Bottom Flask', quantity: 50, customization: 'None', unitPrice: 350, total: 17500, status: 'pending' }
    ],
    totalAmount: 42500,
    status: 'in_production',
    deliveryDate: '2024-02-05',
    customizationRequired: false
  }
]

// Production Orders
export const productionOrders = [
  {
    id: 1,
    orderNumber: 'PO-2024-001',
    salesOrderId: 1,
    salesOrderNumber: 'SO-2024-001',
    productCode: 'RBR-117',
    productName: 'Round Bottom Flask',
    quantity: 50,
    customization: 'Add 2 outlet tubes',
    requiredComponents: [
      { componentCode: 'OUT-001', componentName: 'Single Outlet Tube', quantity: 100, status: 'ordered' }
    ],
    requiredPackaging: [
      { packagingCode: 'PKG-002', packagingName: 'Cardboard Box Small', quantity: 50, status: 'available' }
    ],
    status: 'pending',
    startDate: null,
    completionDate: null,
    batchId: null
  },
  {
    id: 2,
    orderNumber: 'PO-2024-002',
    salesOrderId: 2,
    salesOrderNumber: 'SO-2024-002',
    productCode: 'RB-121',
    productName: 'Three-Neck Round Bottom Flask',
    quantity: 100,
    customization: 'None',
    requiredComponents: [],
    requiredPackaging: [
      { packagingCode: 'PKG-002', packagingName: 'Cardboard Box Small', quantity: 100, status: 'available' }
    ],
    status: 'in_progress',
    startDate: '2024-01-15',
    completionDate: null,
    batchId: 'BATCH-2024-001'
  }
]

// Purchase Orders
export const purchaseOrders = [
  {
    id: 1,
    orderNumber: 'PUO-2024-001',
    supplierId: 1,
    supplierName: 'Glass Components Ltd',
    date: '2024-01-11',
    items: [
      { componentCode: 'OUT-001', componentName: 'Single Outlet Tube', quantity: 100, unitPrice: 25, total: 2500, status: 'ordered' }
    ],
    totalAmount: 2500,
    status: 'ordered',
    expectedDelivery: '2024-01-20'
  }
]

// Employees
export const employees = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@glassware.com', phone: '+91-9876543401', department: 'Production', position: 'Production Manager', salary: 50000, joinDate: '2023-01-15', status: 'active' },
  { id: 2, name: 'Priya Sharma', email: 'priya@glassware.com', phone: '+91-9876543402', department: 'Sales', position: 'Sales Executive', salary: 35000, joinDate: '2023-03-20', status: 'active' },
  { id: 3, name: 'Amit Patel', email: 'amit@glassware.com', phone: '+91-9876543403', department: 'Inventory', position: 'Warehouse Manager', salary: 40000, joinDate: '2023-02-10', status: 'active' }
]

// Dashboard Stats
export const getDashboardStats = (period = 'month') => {
  const isMonth = period === 'month'
  return {
    revenue: isMonth ? 125000 : 1500000,
    orders: isMonth ? 15 : 180,
    products: baseProducts.length + components.length,
    lowStock: [...baseProducts, ...components, ...packaging].filter(p => p.stock <= p.minStock).length,
    alerts: [
      { type: 'warning', message: 'RBR-117 stock is below minimum threshold' },
      { type: 'warning', message: 'OUT-001 component needs reordering' },
      { type: 'danger', message: '5 damaged items need attention' }
    ]
  }
}

// Get data functions
export const getBaseProducts = () => baseProducts
export const getComponents = () => components
export const getPackaging = () => packaging
export const getDamagedItems = () => damagedItems
export const getSuppliers = () => suppliers
export const getCustomers = () => customers
export const getSalesOrders = () => salesOrders
export const getProductionOrders = () => productionOrders
export const getPurchaseOrders = () => purchaseOrders
export const getEmployees = () => employees

