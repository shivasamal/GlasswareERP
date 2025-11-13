import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, DollarSign, Package, Truck } from 'lucide-react'
import { getPurchaseOrders, getSuppliers } from '../../data/staticData'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../../modules/Inventory/Dashboard.css'

const PurchaseDashboard = () => {
  const navigate = useNavigate()
  const [orders] = useState(getPurchaseOrders())
  const [suppliers] = useState(getSuppliers())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter(o => o.status === 'ordered').length
  const receivedOrders = orders.filter(o => o.status === 'received').length

  const chartData = [
    { name: 'Jan', Spent: 50000, Orders: 8 },
    { name: 'Feb', Spent: 60000, Orders: 10 },
    { name: 'Mar', Spent: 75000, Orders: 12 },
    { name: 'Apr', Spent: 80000, Orders: 15 }
  ]

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Purchase & Suppliers</h1>
        <div className="header-actions">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Spent</p>
            <p className="stat-value">₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{orders.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Orders</p>
            <p className="stat-value">{pendingOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Suppliers</p>
            <p className="stat-value">{suppliers.length}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Purchase Spending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Spent" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Purchase Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/purchase/suppliers')}>
            <ShoppingBag size={24} />
            <span>Suppliers</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/purchase/orders')}>
            <Package size={24} />
            <span>Purchase Orders</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/purchase/receipts')}>
            <Truck size={24} />
            <span>Receipts</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/purchase/payments')}>
            <DollarSign size={24} />
            <span>Payments</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseDashboard

