import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Package, Factory, ShoppingCart, ShoppingBag, Users,
  DollarSign, BarChart3, TrendingUp, AlertCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getDashboardStats } from '../data/staticData'
import './Dashboard.css'

const Dashboard = () => {
  const { user, hasAccess } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    setStats(getDashboardStats(selectedPeriod))
  }, [selectedPeriod])

  const modules = [
    { path: '/inventory', icon: Package, label: 'Inventory', color: '#3b82f6', module: 'inventory' },
    { path: '/production', icon: Factory, label: 'Production', color: '#10b981', module: 'production' },
    { path: '/sales', icon: ShoppingCart, label: 'Sales', color: '#f59e0b', module: 'sales' },
    { path: '/purchase', icon: ShoppingBag, label: 'Purchase', color: '#8b5cf6', module: 'purchase' },
    { path: '/hr', icon: Users, label: 'HR & Payroll', color: '#ec4899', module: 'hr' },
    { path: '/accounting', icon: DollarSign, label: 'Accounting', color: '#14b8a6', module: 'accounting' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: '#6366f1', module: 'analytics' }
  ]

  const accessibleModules = modules.filter(m => hasAccess(m.module))

  if (!stats) return <div>Loading...</div>

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </button>
          <button
            className={selectedPeriod === 'year' ? 'active' : ''}
            onClick={() => setSelectedPeriod('year')}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Orders</p>
            <p className="stat-value">{stats.orders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Products</p>
            <p className="stat-value">{stats.products}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Low Stock Alerts</p>
            <p className="stat-value">{stats.lowStock}</p>
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {accessibleModules.map((module) => (
          <div
            key={module.path}
            className="module-card"
            onClick={() => navigate(module.path)}
            style={{ borderLeft: `4px solid ${module.color}` }}
          >
            <module.icon size={32} color={module.color} />
            <h3>{module.label}</h3>
          </div>
        ))}
      </div>

      <div className="dashboard-alerts">
        <h2>Recent Alerts</h2>
        <div className="alerts-list">
          {stats.alerts.map((alert, idx) => (
            <div key={idx} className="alert-item">
              <AlertCircle size={18} color={alert.type === 'warning' ? '#f59e0b' : '#ef4444'} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

