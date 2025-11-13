import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, DollarSign, UserCheck } from 'lucide-react'
import { getEmployees } from '../../data/staticData'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../../modules/Inventory/Dashboard.css'

const HRDashboard = () => {
  const navigate = useNavigate()
  const [employees] = useState(getEmployees())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0)

  const chartData = [
    { name: 'Jan', Employees: 25, Attendance: 95 },
    { name: 'Feb', Employees: 26, Attendance: 96 },
    { name: 'Mar', Employees: 27, Attendance: 94 },
    { name: 'Apr', Employees: 28, Attendance: 97 }
  ]

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>HR & Payroll</h1>
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
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Employees</p>
            <p className="stat-value">{totalEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Employees</p>
            <p className="stat-value">{activeEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Avg Attendance</p>
            <p className="stat-value">95%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Payroll</p>
            <p className="stat-value">₹{totalPayroll.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Employee Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Employees" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Attendance Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Attendance" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/hr/employees')}>
            <Users size={24} />
            <span>Employees</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/hr/attendance')}>
            <Clock size={24} />
            <span>Attendance</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/hr/payroll')}>
            <DollarSign size={24} />
            <span>Payroll</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/hr/roles')}>
            <UserCheck size={24} />
            <span>Roles & Permissions</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HRDashboard

