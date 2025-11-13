import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react'
import { getSalesOrders, getPurchaseOrders } from '../../data/staticData'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../../modules/Inventory/Dashboard.css'

const AccountingDashboard = () => {
  const navigate = useNavigate()
  const [salesOrders] = useState(getSalesOrders())
  const [purchaseOrders] = useState(getPurchaseOrders())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Calculate from actual data
  const totalRevenue = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalExpenses = purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  
  // Accounts Payable calculations
  const totalPayable = purchaseOrders.filter(o => o.status === 'ordered').reduce((sum, o) => sum + o.totalAmount, 0)
  const totalPaidAP = purchaseOrders.filter(o => o.status === 'received').reduce((sum, o) => sum + o.totalAmount, 0)
  
  // Accounts Receivable calculations
  const totalReceivable = salesOrders.filter(o => o.status !== 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  const totalReceivedAR = salesOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  
  const netProfit = totalRevenue - totalExpenses

  const chartData = [
    { name: 'Jan', Revenue: 125000, Expenses: 50000, Profit: 75000 },
    { name: 'Feb', Revenue: 150000, Expenses: 60000, Profit: 90000 },
    { name: 'Mar', Revenue: 180000, Expenses: 75000, Profit: 105000 },
    { name: 'Apr', Revenue: 200000, Expenses: 80000, Profit: 120000 }
  ]

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Accounting & Finance</h1>
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
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <p className="stat-value">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Net Profit</p>
            <p className="stat-value">₹{netProfit.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Profit Margin</p>
            <p className="stat-value">{totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '24px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Accounts Payable (Pending)</p>
            <p className="stat-value">₹{totalPayable.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Paid: ₹{totalPaidAP.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Accounts Receivable (Pending)</p>
            <p className="stat-value">₹{totalReceivable.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Received: ₹{totalReceivedAR.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Financial Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Revenue" fill="#10b981" />
              <Bar dataKey="Expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/accounting/ledgers')}>
            <FileText size={24} />
            <span>Ledgers</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/accounting/ap')}>
            <TrendingDown size={24} />
            <span>Accounts Payable</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/accounting/ar')}>
            <TrendingUp size={24} />
            <span>Accounts Receivable</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/accounting/reports')}>
            <FileText size={24} />
            <span>Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountingDashboard

