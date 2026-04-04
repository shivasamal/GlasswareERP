import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, AlertTriangle, TrendingUp, ArrowUpDown, Users, ShoppingBag, ShoppingCart, FileText } from 'lucide-react'
import { getRawMaterials, getFinishedGoods, getPurchaseOrders, getCustomerOrders } from '../../data/inventoryData'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const InventoryDashboard = () => {
  const navigate = useNavigate()
  const [rawMaterials] = useState(getRawMaterials())
  const [finishedGoods] = useState(getFinishedGoods())
  const [allPurchaseOrders] = useState(getPurchaseOrders())
  const [allCustomerOrders] = useState(getCustomerOrders())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Filter orders by selected period
  const filterOrdersByPeriod = (orders, dateField = 'date') => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // For demo: if no orders match current period, show all orders with adjusted calculations
    const filtered = orders.filter(order => {
      if (!order[dateField]) return false
      const orderDate = new Date(order[dateField])
      
      if (selectedPeriod === 'day') {
        return orderDate >= today
      } else if (selectedPeriod === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return orderDate >= monthStart
      } else if (selectedPeriod === 'year') {
        const yearStart = new Date(now.getFullYear(), 0, 1)
        return orderDate >= yearStart
      }
      return true
    })
    
    // If no orders match (demo data is old), return all orders but scale amounts
    if (filtered.length === 0 && orders.length > 0) {
      const scaleFactor = selectedPeriod === 'day' ? 0.1 : selectedPeriod === 'month' ? 0.3 : 1
      return orders.map(order => ({
        ...order,
        totalAmount: Math.round(order.totalAmount * scaleFactor)
      }))
    }
    
    return filtered
  }

  const purchaseOrders = filterOrdersByPeriod(allPurchaseOrders)
  const customerOrders = filterOrdersByPeriod(allCustomerOrders)

  const lowStockItems = [
    ...rawMaterials.filter(p => p.stock <= p.minStock),
    ...finishedGoods.filter(g => g.stock <= g.minStock)
  ]

  const totalValue = [
    ...rawMaterials,
    ...finishedGoods
  ].reduce((sum, item) => sum + (item.stock * item.price), 0)

  const totalSpending = purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0)

  // Generate chart data based on selected period
  const getChartData = () => {
    if (selectedPeriod === 'day') {
      // Show hourly data for today
      const hours = Array.from({ length: 24 }, (_, i) => i)
      return hours.map(hour => ({
        name: `${hour}:00`,
        Orders: Math.floor(Math.random() * 10),
        Revenue: Math.floor(Math.random() * 5000)
      }))
    } else if (selectedPeriod === 'month') {
      // Show daily data for current month
      const now = new Date()
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      return Array.from({ length: Math.min(daysInMonth, 30) }, (_, i) => {
        const day = i + 1
        return {
          name: `Day ${day}`,
          Orders: purchaseOrders.filter(o => {
            const orderDate = new Date(o.date)
            return orderDate.getDate() === day && orderDate.getMonth() === now.getMonth()
          }).length,
          Revenue: customerOrders.filter(o => {
            const orderDate = new Date(o.date)
            return orderDate.getDate() === day && orderDate.getMonth() === now.getMonth()
          }).reduce((sum, o) => sum + o.totalAmount, 0)
        }
      })
    } else {
      // Show monthly data for current year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map((month, idx) => ({
        name: month,
        Orders: purchaseOrders.filter(o => {
          const orderDate = new Date(o.date)
          return orderDate.getMonth() === idx
        }).length,
        Revenue: customerOrders.filter(o => {
          const orderDate = new Date(o.date)
          return orderDate.getMonth() === idx
        }).reduce((sum, o) => sum + o.totalAmount, 0)
      }))
    }
  }

  const chartData = getChartData()

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Items</p>
            <p className="stat-value">{rawMaterials.length + finishedGoods.length}</p>
          </div>
        </div>
        <div 
          className="stat-card clickable" 
          onClick={() => navigate('/inventory/raw-materials?filter=low_stock')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Low Stock Alerts</p>
            <p className="stat-value">{lowStockItems.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Inventory Value</p>
            <p className="stat-value">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Spending</p>
            <p className="stat-value">₹{totalSpending.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Inventory Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Orders" stroke="#3b82f6" name="Purchase Orders" />
              <Line type="monotone" dataKey="Revenue" stroke="#10b981" name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Stock Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Orders" fill="#3b82f6" name="Purchase Orders" />
              <Bar dataKey="Revenue" fill="#10b981" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/inventory/raw-materials')}>
            <Package size={24} />
            <span>Raw Materials</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/finished-goods')}>
            <Package size={24} />
            <span>Finished Goods</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/stock-movements')}>
            <ArrowUpDown size={24} />
            <span>Stock Movements</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/suppliers')}>
            <Users size={24} />
            <span>Suppliers</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/purchase-orders')}>
            <ShoppingBag size={24} />
            <span>Purchase Orders</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/customer-orders')}>
            <ShoppingCart size={24} />
            <span>Customer Orders</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/reports')}>
            <FileText size={24} />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="alerts-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Low Stock Alerts</h2>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/inventory/raw-materials?filter=low_stock')}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              View All Low Stock Items
            </button>
          </div>
          <div className="alerts-list">
            {lowStockItems.map((item, idx) => (
              <div 
                key={idx} 
                className="alert-item clickable"
                onClick={() => navigate('/inventory/raw-materials?filter=low_stock')}
                style={{ cursor: 'pointer' }}
              >
                <AlertTriangle size={18} color="#ef4444" />
                <div>
                  <strong>{item.productId} - {item.name}</strong>
                  <p>Current Stock: {item.stock} | Minimum Required: {item.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryDashboard

