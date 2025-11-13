import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Module imports
import InventoryDashboard from './modules/Inventory/Dashboard'
import InventoryProducts from './modules/Inventory/Products'
import InventoryComponents from './modules/Inventory/Components'
import InventoryPackaging from './modules/Inventory/Packaging'
import InventoryDamaged from './modules/Inventory/Damaged'

import ProductionDashboard from './modules/Production/Dashboard'
import ProductionOrders from './modules/Production/Orders'
import ProductionBatches from './modules/Production/Batches'
import QualityControl from './modules/Production/QualityControl'

import SalesDashboard from './modules/Sales/Dashboard'
import SalesCustomers from './modules/Sales/Customers'
import SalesOrders from './modules/Sales/Orders'
import SalesInvoices from './modules/Sales/Invoices'
import SalesShipments from './modules/Sales/Shipments'

import PurchaseDashboard from './modules/Purchase/Dashboard'
import PurchaseSuppliers from './modules/Purchase/Suppliers'
import PurchaseOrders from './modules/Purchase/Orders'
import PurchaseReceipts from './modules/Purchase/Receipts'
import PurchasePayments from './modules/Purchase/Payments'

import HRDashboard from './modules/HR/Dashboard'
import HREmployees from './modules/HR/Employees'
import HRAttendance from './modules/HR/Attendance'
import HRPayroll from './modules/HR/Payroll'
import HRRoles from './modules/HR/Roles'

import AccountingDashboard from './modules/Accounting/Dashboard'
import AccountingLedgers from './modules/Accounting/Ledgers'
import AccountingAP from './modules/Accounting/AccountsPayable'
import AccountingAR from './modules/Accounting/AccountsReceivable'
import AccountingReports from './modules/Accounting/Reports'

import AnalyticsDashboard from './modules/Analytics/Dashboard'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Inventory Routes */}
              <Route path="inventory" element={<InventoryDashboard />} />
              <Route path="inventory/products" element={<InventoryProducts />} />
              <Route path="inventory/components" element={<InventoryComponents />} />
              <Route path="inventory/packaging" element={<InventoryPackaging />} />
              <Route path="inventory/damaged" element={<InventoryDamaged />} />
              
              {/* Production Routes */}
              <Route path="production" element={<ProductionDashboard />} />
              <Route path="production/orders" element={<ProductionOrders />} />
              <Route path="production/batches" element={<ProductionBatches />} />
              <Route path="production/quality" element={<QualityControl />} />
              
              {/* Sales Routes */}
              <Route path="sales" element={<SalesDashboard />} />
              <Route path="sales/customers" element={<SalesCustomers />} />
              <Route path="sales/orders" element={<SalesOrders />} />
              <Route path="sales/invoices" element={<SalesInvoices />} />
              <Route path="sales/shipments" element={<SalesShipments />} />
              
              {/* Purchase Routes */}
              <Route path="purchase" element={<PurchaseDashboard />} />
              <Route path="purchase/suppliers" element={<PurchaseSuppliers />} />
              <Route path="purchase/orders" element={<PurchaseOrders />} />
              <Route path="purchase/receipts" element={<PurchaseReceipts />} />
              <Route path="purchase/payments" element={<PurchasePayments />} />
              
              {/* HR Routes */}
              <Route path="hr" element={<HRDashboard />} />
              <Route path="hr/employees" element={<HREmployees />} />
              <Route path="hr/attendance" element={<HRAttendance />} />
              <Route path="hr/payroll" element={<HRPayroll />} />
              <Route path="hr/roles" element={<HRRoles />} />
              
              {/* Accounting Routes */}
              <Route path="accounting" element={<AccountingDashboard />} />
              <Route path="accounting/ledgers" element={<AccountingLedgers />} />
              <Route path="accounting/ap" element={<AccountingAP />} />
              <Route path="accounting/ar" element={<AccountingAR />} />
              <Route path="accounting/reports" element={<AccountingReports />} />
              
              {/* Analytics Routes */}
              <Route path="analytics" element={<AnalyticsDashboard />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

