import { useState } from 'react'
import { Plus, Eye, Edit, Package } from 'lucide-react'
import { getSalesOrders, getCustomers, getBaseProducts, getComponents } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState(getSalesOrders())
  const customers = getCustomers()
  const baseProducts = getBaseProducts()
  const components = getComponents()
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productCode: '', quantity: '', customization: '' }],
    deliveryDate: ''
  })

  const handleView = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleCreate = () => {
    setFormData({
      customerId: '',
      items: [{ productCode: '', quantity: '', customization: '' }],
      deliveryDate: ''
    })
    setShowCreateModal(true)
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productCode: '', quantity: '', customization: '' }]
    })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    const customer = customers.find(c => c.id === parseInt(formData.customerId))
    const items = formData.items.map(item => {
      const product = baseProducts.find(p => p.code === item.productCode)
      return {
        productCode: item.productCode,
        productName: product?.name || '',
        quantity: parseInt(item.quantity),
        customization: item.customization,
        unitPrice: product?.price || 0,
        total: (product?.price || 0) * parseInt(item.quantity),
        status: 'pending'
      }
    })
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0)
    
    const newOrder = {
      id: salesOrders.length + 1,
      orderNumber: `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`,
      customerId: parseInt(formData.customerId),
      customerName: customer?.name || '',
      date: new Date().toISOString().split('T')[0],
      items,
      totalAmount,
      status: 'pending',
      deliveryDate: formData.deliveryDate,
      customizationRequired: items.some(item => item.customization)
    }
    
    setSalesOrders([...salesOrders, newOrder])
    setShowCreateModal(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'in_production': return '#3b82f6'
      case 'completed': return '#10b981'
      case 'shipped': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Sales Orders</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Create Order
        </button>
      </div>

      <div className="orders-grid">
        {salesOrders.map((order) => {
          const customer = customers.find(c => c.id === order.customerId)
          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>{order.orderNumber}</h3>
                  <p className="order-meta">{customer?.name || 'Unknown Customer'} • {order.date}</p>
                </div>
                <span className="status-badge" style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <strong>Total Amount:</strong> ₹{order.totalAmount.toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>Items:</strong> {order.items.length} item(s)
                </div>
                {order.customizationRequired && (
                  <div className="detail-item">
                    <strong>Customization:</strong> Required
                  </div>
                )}
                <div className="detail-item">
                  <strong>Delivery Date:</strong> {order.deliveryDate}
                </div>
              </div>

              <div className="order-items">
                <strong>Order Items:</strong>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.productName} ({item.productCode}) - Qty: {item.quantity}
                      {item.customization && <span className="text-warning"> • Custom: {item.customization}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-actions">
                <button className="btn-secondary" onClick={() => handleView(order)}>
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Sales Order Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Order Information</h3>
                <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</p>
                <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
              </div>

              <div className="detail-section">
                <h3>Order Items</h3>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Code</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      <th>Customization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td>{item.productCode}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.unitPrice}</td>
                        <td>₹{item.total}</td>
                        <td>{item.customization || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Create Sales Order</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Delivery Date</label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Order Items</label>
                {formData.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product</label>
                        <select
                          value={item.productCode}
                          onChange={(e) => handleItemChange(idx, 'productCode', e.target.value)}
                          required
                        >
                          <option value="">Select Product</option>
                          {baseProducts.map(p => (
                            <option key={p.id} value={p.code}>{p.name} ({p.code})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Customization (if required)</label>
                      <input
                        type="text"
                        value={item.customization}
                        onChange={(e) => handleItemChange(idx, 'customization', e.target.value)}
                        placeholder="e.g., Add 2 outlet tubes"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn-secondary" onClick={handleAddItem}>
                  Add Item
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesOrders

