import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, DollarSign, TrendingUp, Users } from 'lucide-react'
import { getSalesOrders, getCustomers } from '../../data/staticData'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const SalesDashboard = () => {
  const navigate = useNavigate()
  const [orders] = useState(getSalesOrders())
  const [customers] = useState(getCustomers())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const inProductionOrders = orders.filter(o => o.status === 'in_production').length
  const completedOrders = orders.filter(o => o.status === 'completed').length

  const chartData = [
    { name: 'Jan', Revenue: 125000, Orders: 12 },
    { name: 'Feb', Revenue: 150000, Orders: 15 },
    { name: 'Mar', Revenue: 180000, Orders: 18 },
    { name: 'Apr', Revenue: 200000, Orders: 20 }
  ]

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Sales & Distribution</h1>
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
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{orders.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Orders</p>
            <p className="stat-value">{pendingOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Customers</p>
            <p className="stat-value">{customers.length}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Sales Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Orders Trend</h2>
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
          <button className="action-btn" onClick={() => navigate('/sales/customers')}>
            <Users size={24} />
            <span>Customers</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/sales/orders')}>
            <ShoppingCart size={24} />
            <span>Orders</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/sales/invoices')}>
            <DollarSign size={24} />
            <span>Invoices</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/sales/shipments')}>
            <ShoppingCart size={24} />
            <span>Shipments</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SalesDashboard

