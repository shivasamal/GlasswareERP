import { useState } from 'react'
import { Eye, Truck, Plus, Edit, User, Clock } from 'lucide-react'
import { getSalesOrders } from '../../data/staticData'
import { useAuth } from '../../contexts/AuthContext'
import '../../modules/Production/Orders.css'

const SalesShipments = () => {
  const { user } = useAuth()
  const [orders] = useState(getSalesOrders())
  const [shipments, setShipments] = useState(
    orders.map(order => ({
      id: order.id,
      shipmentNumber: `SHIP-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      date: order.date,
      deliveryDate: order.deliveryDate,
      status: order.status === 'completed' ? 'delivered' : order.status === 'in_production' ? 'in_transit' : 'pending',
      createdBy: order.createdBy || 'Sales Manager',
      createdAt: order.date,
      updatedBy: null,
      updatedAt: null,
      trackingNumber: order.trackingNumber || null
    }))
  )
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    orderNumber: '',
    status: 'pending',
    trackingNumber: '',
    deliveryDate: ''
  })

  const handleView = (shipment) => {
    setSelectedShipment(shipment)
    setShowModal(true)
  }

  const handleCreate = () => {
    setFormData({
      orderNumber: '',
      status: 'pending',
      trackingNumber: '',
      deliveryDate: ''
    })
    setShowCreateModal(true)
  }

  const handleEdit = (shipment) => {
    setSelectedShipment(shipment)
    setFormData({
      orderNumber: shipment.orderNumber,
      status: shipment.status,
      trackingNumber: shipment.trackingNumber || '',
      deliveryDate: shipment.deliveryDate
    })
    setShowEditModal(true)
  }

  const handleSubmitCreate = (e) => {
    e.preventDefault()
    const order = orders.find(o => o.orderNumber === formData.orderNumber)
    if (order) {
      const newShipment = {
        id: shipments.length + 1,
        shipmentNumber: `SHIP-${formData.orderNumber}`,
        orderNumber: formData.orderNumber,
        customerName: order.customerName,
        date: new Date().toISOString().split('T')[0],
        deliveryDate: formData.deliveryDate,
        status: formData.status,
        trackingNumber: formData.trackingNumber || null,
        createdBy: user?.name || 'Unknown',
        createdAt: new Date().toISOString().split('T')[0],
        updatedBy: null,
        updatedAt: null
      }
      setShipments([...shipments, newShipment])
      setShowCreateModal(false)
    }
  }

  const handleSubmitUpdate = (e) => {
    e.preventDefault()
    const updatedShipments = shipments.map(ship =>
      ship.id === selectedShipment.id
        ? {
            ...ship,
            status: formData.status,
            trackingNumber: formData.trackingNumber || ship.trackingNumber,
            deliveryDate: formData.deliveryDate,
            updatedBy: user?.name || 'Unknown',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : ship
    )
    setShipments(updatedShipments)
    setShowEditModal(false)
    setSelectedShipment(null)
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Shipments</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Create Shipment
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Shipment Number</th>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Ship Date</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.shipmentNumber}</td>
                <td>{shipment.orderNumber}</td>
                <td>{shipment.customerName}</td>
                <td>{shipment.date}</td>
                <td>{shipment.deliveryDate}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: shipment.status === 'delivered' ? '#10b98120' : shipment.status === 'in_transit' ? '#3b82f620' : '#f59e0b20',
                    color: shipment.status === 'delivered' ? '#10b981' : shipment.status === 'in_transit' ? '#3b82f6' : '#f59e0b'
                  }}>
                    {shipment.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <User size={12} />
                    {shipment.createdBy}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleView(shipment)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleEdit(shipment)}>
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedShipment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Shipment Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Shipment Information</h3>
                <p><strong>Shipment Number:</strong> {selectedShipment.shipmentNumber}</p>
                <p><strong>Order Number:</strong> {selectedShipment.orderNumber}</p>
                <p><strong>Customer:</strong> {selectedShipment.customerName}</p>
                <p><strong>Ship Date:</strong> {selectedShipment.date}</p>
                <p><strong>Delivery Date:</strong> {selectedShipment.deliveryDate}</p>
                <p><strong>Status:</strong> {selectedShipment.status}</p>
                {selectedShipment.trackingNumber && (
                  <p><strong>Tracking Number:</strong> {selectedShipment.trackingNumber}</p>
                )}
              </div>
              <div className="detail-section" style={{ marginTop: '16px' }}>
                <h3>Tracking Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User size={16} />
                  <div>
                    <p><strong>Created By:</strong> {selectedShipment.createdBy}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Created on: {selectedShipment.createdAt}
                    </p>
                  </div>
                </div>
                {selectedShipment.updatedBy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <User size={16} />
                    <div>
                      <p><strong>Last Updated By:</strong> {selectedShipment.updatedBy}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Updated on: {selectedShipment.updatedAt}
                      </p>
                    </div>
                  </div>
                )}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Shipment</h2>
            <form onSubmit={handleSubmitCreate}>
              <div className="form-group">
                <label>Sales Order Number</label>
                <select
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  required
                >
                  <option value="">Select Order</option>
                  {orders.filter(o => !shipments.find(ship => ship.orderNumber === o.orderNumber)).map(order => (
                    <option key={order.id} value={order.orderNumber}>
                      {order.orderNumber} - {order.customerName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
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
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tracking Number (Optional)</label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                />
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                <p><strong>Note:</strong> This shipment will be created by {user?.name}</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedShipment && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Shipment</h2>
            <form onSubmit={handleSubmitUpdate}>
              <div className="form-group">
                <label>Shipment Number</label>
                <input type="text" value={selectedShipment.shipmentNumber} disabled />
              </div>
              <div className="form-row">
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
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tracking Number</label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                />
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                <p><strong>Note:</strong> This update will be tracked with your name ({user?.name})</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesShipments

