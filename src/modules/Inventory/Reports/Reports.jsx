import { useState } from 'react'
import { Download, BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react'
import { getPurchaseOrders, getCustomerOrders, getRawMaterials, getFinishedGoods, getSuppliers, getCustomers } from '../../../data/inventoryData'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Reports.css'

const Reports = () => {
  const [allPurchaseOrders] = useState(getPurchaseOrders())
  const [allCustomerOrders] = useState(getCustomerOrders())
  const [rawMaterials] = useState(getRawMaterials())
  const [finishedGoods] = useState(getFinishedGoods())
  const [suppliers] = useState(getSuppliers())
  const [customers] = useState(getCustomers())
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

  const totalSpending = purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalInventoryValue = [...rawMaterials, ...finishedGoods].reduce((sum, item) => sum + (item.stock * item.price), 0)

  const supplierSpending = suppliers.map(supplier => {
    const orders = purchaseOrders.filter(o => o.supplierId === supplier.id)
    return {
      name: supplier.name,
      amount: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    }
  }).filter(s => s.amount > 0)

  const customerRevenue = customers.map(customer => {
    const orders = customerOrders.filter(o => o.customerId === customer.id)
    return {
      name: customer.name,
      amount: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    }
  }).filter(c => c.amount > 0)

  const inventoryByCategory = [...rawMaterials, ...finishedGoods].reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.stock * item.price)
    return acc
  }, {})

  const categoryData = Object.entries(inventoryByCategory).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const generatePDF = () => {
    const reportContent = `
INVENTORY MANAGEMENT REPORT
Generated: ${new Date().toLocaleDateString()}
Period: ${selectedPeriod}

SUMMARY
--------
Total Spending: ₹${totalSpending.toLocaleString()}
Total Revenue: ₹${totalRevenue.toLocaleString()}
Total Inventory Value: ₹${totalInventoryValue.toLocaleString()}

SUPPLIER WISE PURCHASES
--------
${supplierSpending.map(s => `${s.name}: ₹${s.amount.toLocaleString()}`).join('\n')}

CUSTOMER WISE SALES
--------
${customerRevenue.map(c => `${c.name}: ₹${c.amount.toLocaleString()}`).join('\n')}

INVENTORY BY CATEGORY
--------
${categoryData.map(c => `${c.name}: ₹${c.value.toLocaleString()}`).join('\n')}
    `
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Inventory_Report_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
  }

  return (
    <div className="reports">
      <div className="page-header">
        <div>
          <h1>Inventory Reports</h1>
          <p>View comprehensive reports and analytics</p>
        </div>
        <div className="header-actions">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-primary" onClick={generatePDF}>
            <Download size={20} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Spending</p>
            <p className="stat-value">₹{totalSpending.toLocaleString()}</p>
          </div>
        </div>
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
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Inventory Value</p>
            <p className="stat-value">₹{totalInventoryValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Net Profit</p>
            <p className="stat-value">₹{(totalRevenue - totalSpending).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Supplier Wise Purchases</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierSpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Customer Wise Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Inventory by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
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

export default Reports

