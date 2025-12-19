import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Inventory Module Only
import InventoryDashboard from './modules/Inventory/Dashboard'
import RawMaterials from './modules/Inventory/RawMaterials/RawMaterials'
import FinishedGoods from './modules/Inventory/FinishedGoods/FinishedGoods'
import StockMovements from './modules/Inventory/StockMovements/StockMovements'
import Suppliers from './modules/Inventory/Suppliers/Suppliers'
import InventoryPurchaseOrders from './modules/Inventory/PurchaseOrders/PurchaseOrders'
import CustomerOrders from './modules/Inventory/CustomerOrders/CustomerOrders'
import Reports from './modules/Inventory/Reports/Reports'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename="/GlasswareERP">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/inventory" replace />} />
              
              {/* Inventory Routes */}
              <Route path="inventory" element={<InventoryDashboard />} />
              <Route path="inventory/raw-materials" element={<RawMaterials />} />
              <Route path="inventory/finished-goods" element={<FinishedGoods />} />
              <Route path="inventory/stock-movements" element={<StockMovements />} />
              <Route path="inventory/suppliers" element={<Suppliers />} />
              <Route path="inventory/purchase-orders" element={<InventoryPurchaseOrders />} />
              <Route path="inventory/customer-orders" element={<CustomerOrders />} />
              <Route path="inventory/reports" element={<Reports />} />
              
              {/* Catch-all route - redirect any unknown routes to inventory */}
              <Route path="*" element={<Navigate to="/inventory" replace />} />
            </Route>
            
            {/* Redirect /dashboard and other common routes */}
            <Route path="/dashboard" element={<Navigate to="/inventory" replace />} />
            <Route path="/login" element={<Navigate to="/inventory" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

