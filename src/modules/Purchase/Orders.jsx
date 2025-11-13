import { useState } from 'react'
import { Plus, Eye, CheckCircle } from 'lucide-react'
import { getPurchaseOrders, getSuppliers, getComponents, getPackaging } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState(getPurchaseOrders())
  const suppliers = getSuppliers()
  const components = getComponents()
  const packaging = getPackaging()
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formData, setFormData] = useState({
    supplierId: '',
    items: [{ itemCode: '', itemType: 'component', quantity: '', unitPrice: '' }],
    expectedDelivery: ''
  })

  const handleView = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleCreate = () => {
    setFormData({
      supplierId: '',
      items: [{ itemCode: '', itemType: 'component', quantity: '', unitPrice: '' }],
      expectedDelivery: ''
    })
    setShowCreateModal(true)
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemCode: '', itemType: 'component', quantity: '', unitPrice: '' }]
    })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    const supplier = suppliers.find(s => s.id === parseInt(formData.supplierId))
    const items = formData.items.map(item => {
      const itemData = item.itemType === 'component'
        ? components.find(c => c.code === item.itemCode)
        : packaging.find(p => p.code === item.itemCode)
      return {
        componentCode: item.itemType === 'component' ? item.itemCode : '',
        packagingCode: item.itemType === 'packaging' ? item.itemCode : '',
        componentName: item.itemType === 'component' ? itemData?.name || '' : '',
        packagingName: item.itemType === 'packaging' ? itemData?.name || '' : '',
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        total: parseFloat(item.unitPrice) * parseInt(item.quantity),
        status: 'ordered'
      }
    })
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0)
    
    const newOrder = {
      id: purchaseOrders.length + 1,
      orderNumber: `PUO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplierId: parseInt(formData.supplierId),
      supplierName: supplier?.name || '',
      date: new Date().toISOString().split('T')[0],
      items,
      totalAmount,
      status: 'ordered',
      expectedDelivery: formData.expectedDelivery
    }
    
    setPurchaseOrders([...purchaseOrders, newOrder])
    setShowCreateModal(false)
  }

  const handleReceive = (orderId) => {
    setPurchaseOrders(purchaseOrders.map(o =>
      o.id === orderId ? { ...o, status: 'received' } : o
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered': return '#f59e0b'
      case 'received': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Purchase Orders</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Create Order
        </button>
      </div>

      <div className="orders-grid">
        {purchaseOrders.map((order) => {
          const supplier = suppliers.find(s => s.id === order.supplierId)
          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>{order.orderNumber}</h3>
                  <p className="order-meta">{supplier?.name || 'Unknown Supplier'} • {order.date}</p>
                </div>
                <span className="status-badge" style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <strong>Total Amount:</strong> ₹{order.totalAmount.toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>Items:</strong> {order.items.length} item(s)
                </div>
                <div className="detail-item">
                  <strong>Expected Delivery:</strong> {order.expectedDelivery}
                </div>
              </div>

              <div className="order-items">
                <strong>Order Items:</strong>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.componentName || item.packagingName} - Qty: {item.quantity} @ ₹{item.unitPrice}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-actions">
                <button className="btn-secondary" onClick={() => handleView(order)}>
                  <Eye size={16} />
                  View Details
                </button>
                {order.status === 'ordered' && (
                  <button className="btn-success" onClick={() => handleReceive(order.id)}>
                    <CheckCircle size={16} />
                    Mark Received
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Purchase Order Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Order Information</h3>
                <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Supplier:</strong> {selectedOrder.supplierName}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</p>
                <p><strong>Expected Delivery:</strong> {selectedOrder.expectedDelivery}</p>
              </div>

              <div className="detail-section">
                <h3>Order Items</h3>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.componentName || item.packagingName}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.unitPrice}</td>
                        <td>₹{item.total}</td>
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
            <h2>Create Purchase Order</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label>Supplier</label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Expected Delivery Date</label>
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Order Items</label>
                {formData.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Item Type</label>
                        <select
                          value={item.itemType}
                          onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}
                          required
                        >
                          <option value="component">Component</option>
                          <option value="packaging">Packaging</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Item</label>
                        <select
                          value={item.itemCode}
                          onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)}
                          required
                        >
                          <option value="">Select {item.itemType === 'component' ? 'Component' : 'Packaging'}</option>
                          {(item.itemType === 'component' ? components : packaging).map(i => (
                            <option key={i.id} value={i.code}>{i.name} ({i.code})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          required
                        />
                      </div>
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

export default PurchaseOrders

