import { useState } from 'react'
import { Download, Calendar } from 'lucide-react'
import { getSalesOrders, getPurchaseOrders } from '../../data/staticData'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../../modules/Inventory/Dashboard.css'

const AccountingReports = () => {
  const [salesOrders] = useState(getSalesOrders())
  const [purchaseOrders] = useState(getPurchaseOrders())
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [reportType, setReportType] = useState('profit')

  const totalRevenue = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalExpenses = purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const netProfit = totalRevenue - totalExpenses

  const chartData = [
    { name: 'Jan', Revenue: 125000, Expenses: 50000, Profit: 75000 },
    { name: 'Feb', Revenue: 150000, Expenses: 60000, Profit: 90000 },
    { name: 'Mar', Revenue: 180000, Expenses: 75000, Profit: 105000 },
    { name: 'Apr', Revenue: 200000, Expenses: 80000, Profit: 120000 }
  ]

  const pieData = [
    { name: 'Revenue', value: totalRevenue },
    { name: 'Expenses', value: totalExpenses }
  ]

  const COLORS = ['#10b981', '#ef4444']

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Financial Reports</h1>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="profit">Profit & Loss</option>
            <option value="balance">Balance Sheet</option>
            <option value="cashflow">Cash Flow</option>
          </select>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <p className="stat-value">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Net Profit</p>
            <p className="stat-value">₹{netProfit.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Profit Margin</p>
            <p className="stat-value">{totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Financial Trends</h2>
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
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AccountingReports

