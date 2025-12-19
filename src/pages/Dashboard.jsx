import { useNavigate } from 'react-router-dom'
import {
  Package, ArrowUpDown, Users, ShoppingBag, ShoppingCart, FileText, TrendingUp, AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { getRawMaterials, getFinishedGoods, getPurchaseOrders, getCustomerOrders } from '../data/inventoryData'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [rawMaterials] = useState(getRawMaterials())
  const [finishedGoods] = useState(getFinishedGoods())
  const [purchaseOrders] = useState(getPurchaseOrders())
  const [customerOrders] = useState(getCustomerOrders())

  const totalSpending = purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalInventoryValue = [...rawMaterials, ...finishedGoods].reduce((sum, item) => sum + (item.stock * item.price), 0)
  const lowStockItems = [...rawMaterials, ...finishedGoods].filter(item => item.stock <= item.minStock)

  const quickActions = [
    { path: '/inventory/raw-materials', icon: Package, label: 'Raw Materials', color: '#3b82f6' },
    { path: '/inventory/finished-goods', icon: Package, label: 'Finished Goods', color: '#10b981' },
    { path: '/inventory/stock-movements', icon: ArrowUpDown, label: 'Stock Movements', color: '#f59e0b' },
    { path: '/inventory/suppliers', icon: Users, label: 'Suppliers', color: '#8b5cf6' },
    { path: '/inventory/purchase-orders', icon: ShoppingBag, label: 'Purchase Orders', color: '#ec4899' },
    { path: '/inventory/customer-orders', icon: ShoppingCart, label: 'Customer Orders', color: '#14b8a6' },
    { path: '/inventory/reports', icon: FileText, label: 'Reports', color: '#6366f1' }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Inventory Management System</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Spending</p>
            <p className="stat-value">₹{totalSpending.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Inventory Value</p>
            <p className="stat-value">₹{totalInventoryValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Low Stock Alerts</p>
            <p className="stat-value">{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {quickActions.map((action) => (
          <div
            key={action.path}
            className="module-card"
            onClick={() => navigate(action.path)}
            style={{ borderLeft: `4px solid ${action.color}` }}
          >
            <action.icon size={32} color={action.color} />
            <h3>{action.label}</h3>
          </div>
        ))}
      </div>

      {lowStockItems.length > 0 && (
        <div className="dashboard-alerts">
          <h2>Low Stock Alerts</h2>
          <div className="alerts-list">
            {lowStockItems.slice(0, 5).map((item, idx) => (
              <div key={idx} className="alert-item">
                <AlertCircle size={18} color="#ef4444" />
                <span>{item.productId} - {item.name}: {item.stock} {item.unit} (Min: {item.minStock})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

