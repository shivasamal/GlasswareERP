import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Package, CheckCircle, Clock } from 'lucide-react'
import { getProductionOrders } from '../../data/staticData'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const ProductionDashboard = () => {
  const navigate = useNavigate()
  const [orders] = useState(getProductionOrders())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length
  const completedOrders = orders.filter(o => o.status === 'completed').length

  const chartData = [
    { name: 'Jan', Pending: 5, 'In Progress': 8, Completed: 12 },
    { name: 'Feb', Pending: 3, 'In Progress': 10, Completed: 15 },
    { name: 'Mar', Pending: 4, 'In Progress': 9, Completed: 18 },
    { name: 'Apr', Pending: 2, 'In Progress': 11, Completed: 20 }
  ]

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Production Management</h1>
        <div className="header-actions">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Orders</p>
            <p className="stat-value">{pendingOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Factory size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{inProgressOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{completedOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Production Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pending" fill="#f59e0b" />
              <Bar dataKey="In Progress" fill="#3b82f6" />
              <Bar dataKey="Completed" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Production Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="In Progress" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/production/orders')}>
            <Factory size={24} />
            <span>Production Orders</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/production/batches')}>
            <Package size={24} />
            <span>Batches</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/production/quality')}>
            <CheckCircle size={24} />
            <span>Quality Control</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductionDashboard

