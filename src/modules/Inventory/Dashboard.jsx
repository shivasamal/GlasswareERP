import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { getBaseProducts, getComponents, getPackaging } from '../../data/staticData'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const InventoryDashboard = () => {
  const navigate = useNavigate()
  const [baseProducts] = useState(getBaseProducts())
  const [components] = useState(getComponents())
  const [packaging] = useState(getPackaging())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const lowStockItems = [
    ...baseProducts.filter(p => p.stock <= p.minStock),
    ...components.filter(c => c.stock <= c.minStock),
    ...packaging.filter(p => p.stock <= p.minStock)
  ]

  const totalValue = [
    ...baseProducts,
    ...components,
    ...packaging
  ].reduce((sum, item) => sum + (item.stock * item.price), 0)

  const chartData = [
    { name: 'Jan', Base: 450, Components: 320, Packaging: 180 },
    { name: 'Feb', Base: 520, Components: 380, Packaging: 200 },
    { name: 'Mar', Base: 480, Components: 350, Packaging: 190 },
    { name: 'Apr', Base: 550, Components: 400, Packaging: 220 }
  ]

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
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
            <p className="stat-value">{baseProducts.length + components.length + packaging.length}</p>
          </div>
        </div>
        <div className="stat-card">
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
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Base Products</p>
            <p className="stat-value">{baseProducts.length}</p>
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
              <Line type="monotone" dataKey="Base" stroke="#3b82f6" />
              <Line type="monotone" dataKey="Components" stroke="#10b981" />
              <Line type="monotone" dataKey="Packaging" stroke="#f59e0b" />
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
              <Bar dataKey="Base" fill="#3b82f6" />
              <Bar dataKey="Components" fill="#10b981" />
              <Bar dataKey="Packaging" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/inventory/products')}>
            <Package size={24} />
            <span>Base Products</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/components')}>
            <Package size={24} />
            <span>Components</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/packaging')}>
            <Package size={24} />
            <span>Packaging</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/inventory/damaged')}>
            <AlertTriangle size={24} />
            <span>Damaged Items</span>
          </button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="alerts-section">
          <h2>Low Stock Alerts</h2>
          <div className="alerts-list">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="alert-item">
                <AlertTriangle size={18} color="#ef4444" />
                <div>
                  <strong>{item.code} - {item.name}</strong>
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

