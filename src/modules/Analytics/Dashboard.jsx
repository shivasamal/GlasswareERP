import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getSalesOrders, getPurchaseOrders, getBaseProducts, getComponents, getPackaging } from '../../data/staticData'
import '../../modules/Inventory/Dashboard.css'

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [salesOrders] = useState(getSalesOrders())
  const [purchaseOrders] = useState(getPurchaseOrders())
  const [baseProducts] = useState(getBaseProducts())
  const [components] = useState(getComponents())
  const [packaging] = useState(getPackaging())

  const revenueData = [
    { name: 'Jan', Revenue: 125000 },
    { name: 'Feb', Revenue: 150000 },
    { name: 'Mar', Revenue: 180000 },
    { name: 'Apr', Revenue: 200000 }
  ]

  const productData = [
    { name: 'Base Products', value: baseProducts.length },
    { name: 'Components', value: components.length },
    { name: 'Packaging', value: packaging.length }
  ]

  const orderStatusData = [
    { name: 'Pending', value: salesOrders.filter(o => o.status === 'pending').length },
    { name: 'In Production', value: salesOrders.filter(o => o.status === 'in_production').length },
    { name: 'Completed', value: salesOrders.filter(o => o.status === 'completed').length }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="module-dashboard">
      <div className="dashboard-header">
        <h1>Analytics & Reports</h1>
        <div className="header-actions">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
          <h2>Product Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Order Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Sales vs Purchases</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Sales', Amount: salesOrders.reduce((sum, o) => sum + o.totalAmount, 0) },
              { name: 'Purchases', Amount: purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0) }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard

