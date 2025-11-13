import { useState } from 'react'
import { Plus, Eye, Edit, CheckCircle, Package } from 'lucide-react'
import { getProductionOrders, getSalesOrders, getBaseProducts, getComponents, getPackaging } from '../../data/staticData'
import './Orders.css'

const ProductionOrders = () => {
  const [productionOrders, setProductionOrders] = useState(getProductionOrders())
  const salesOrders = getSalesOrders()
  const baseProducts = getBaseProducts()
  const components = getComponents()
  const packaging = getPackaging()
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleView = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleStartProduction = (orderId) => {
    setProductionOrders(productionOrders.map(o =>
      o.id === orderId
        ? { ...o, status: 'in_progress', startDate: new Date().toISOString().split('T')[0], batchId: `BATCH-${Date.now()}` }
        : o
    ))
  }

  const handleComplete = (orderId) => {
    setProductionOrders(productionOrders.map(o =>
      o.id === orderId
        ? { ...o, status: 'completed', completionDate: new Date().toISOString().split('T')[0] }
        : o
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'in_progress': return '#3b82f6'
      case 'completed': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Production Orders</h1>
        <p className="page-subtitle">Manage custom manufacturing orders and track production progress</p>
      </div>

      <div className="orders-grid">
        {productionOrders.map((order) => {
          const salesOrder = salesOrders.find(so => so.id === order.salesOrderId)
          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>{order.orderNumber}</h3>
                  <p className="order-meta">Sales Order: {order.salesOrderNumber}</p>
                </div>
                <span className="status-badge" style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <strong>Product:</strong> {order.productName} ({order.productCode})
                </div>
                <div className="detail-item">
                  <strong>Quantity:</strong> {order.quantity} units
                </div>
                {order.customization && (
                  <div className="detail-item">
                    <strong>Customization:</strong> {order.customization}
                  </div>
                )}
                {order.batchId && (
                  <div className="detail-item">
                    <strong>Batch ID:</strong> {order.batchId}
                  </div>
                )}
              </div>

              {order.requiredComponents && order.requiredComponents.length > 0 && (
                <div className="components-section">
                  <strong>Required Components:</strong>
                  <ul>
                    {order.requiredComponents.map((comp, idx) => {
                      const component = components.find(c => c.code === comp.componentCode)
                      return (
                        <li key={idx}>
                          {comp.componentName} (Qty: {comp.quantity}) - 
                          <span className={comp.status === 'available' ? 'text-success' : 'text-warning'}>
                            {comp.status}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {order.requiredPackaging && order.requiredPackaging.length > 0 && (
                <div className="packaging-section">
                  <strong>Required Packaging:</strong>
                  <ul>
                    {order.requiredPackaging.map((pkg, idx) => {
                      const pack = packaging.find(p => p.code === pkg.packagingCode)
                      return (
                        <li key={idx}>
                          {pkg.packagingName} (Qty: {pkg.quantity}) - 
                          <span className={pkg.status === 'available' ? 'text-success' : 'text-warning'}>
                            {pkg.status}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              <div className="order-actions">
                <button className="btn-secondary" onClick={() => handleView(order)}>
                  <Eye size={16} />
                  View Details
                </button>
                {order.status === 'pending' && (
                  <button className="btn-primary" onClick={() => handleStartProduction(order.id)}>
                    <Package size={16} />
                    Start Production
                  </button>
                )}
                {order.status === 'in_progress' && (
                  <button className="btn-success" onClick={() => handleComplete(order.id)}>
                    <CheckCircle size={16} />
                    Mark Complete
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
            <h2>Production Order Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Order Information</h3>
                <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Sales Order:</strong> {selectedOrder.salesOrderNumber}</p>
                <p><strong>Product:</strong> {selectedOrder.productName} ({selectedOrder.productCode})</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                {selectedOrder.startDate && <p><strong>Start Date:</strong> {selectedOrder.startDate}</p>}
                {selectedOrder.completionDate && <p><strong>Completion Date:</strong> {selectedOrder.completionDate}</p>}
                {selectedOrder.batchId && <p><strong>Batch ID:</strong> {selectedOrder.batchId}</p>}
              </div>

              {selectedOrder.customization && (
                <div className="detail-section">
                  <h3>Customization Requirements</h3>
                  <p>{selectedOrder.customization}</p>
                </div>
              )}

              {selectedOrder.requiredComponents && selectedOrder.requiredComponents.length > 0 && (
                <div className="detail-section">
                  <h3>Required Components</h3>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.requiredComponents.map((comp, idx) => (
                        <tr key={idx}>
                          <td>{comp.componentName}</td>
                          <td>{comp.quantity}</td>
                          <td>
                            <span className={comp.status === 'available' ? 'text-success' : 'text-warning'}>
                              {comp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedOrder.requiredPackaging && selectedOrder.requiredPackaging.length > 0 && (
                <div className="detail-section">
                  <h3>Required Packaging</h3>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>Packaging</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.requiredPackaging.map((pkg, idx) => (
                        <tr key={idx}>
                          <td>{pkg.packagingName}</td>
                          <td>{pkg.quantity}</td>
                          <td>
                            <span className={pkg.status === 'available' ? 'text-success' : 'text-warning'}>
                              {pkg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductionOrders

