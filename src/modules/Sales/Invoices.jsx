import { useState } from 'react'
import { Eye, Download, Plus, Edit, User, Clock } from 'lucide-react'
import { getSalesOrders } from '../../data/staticData'
import { useAuth } from '../../contexts/AuthContext'
import '../../modules/Production/Orders.css'

const SalesInvoices = () => {
  const { user } = useAuth()
  const [orders] = useState(getSalesOrders())
  const [invoices, setInvoices] = useState(
    orders.map(order => ({
      id: order.id,
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      date: order.date,
      amount: order.totalAmount,
      status: order.status === 'completed' ? 'paid' : 'pending',
      createdBy: order.createdBy || 'Sales Manager',
      createdAt: order.date,
      updatedBy: null,
      updatedAt: null
    }))
  )
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    orderNumber: '',
    status: 'pending'
  })

  const handleView = (invoice) => {
    setSelectedInvoice(invoice)
    setShowModal(true)
  }

  const handleCreate = () => {
    setFormData({
      orderNumber: '',
      status: 'pending'
    })
    setShowCreateModal(true)
  }

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice)
    setFormData({
      orderNumber: invoice.orderNumber,
      status: invoice.status
    })
    setShowEditModal(true)
  }

  const handleSubmitCreate = (e) => {
    e.preventDefault()
    const order = orders.find(o => o.orderNumber === formData.orderNumber)
    if (order) {
      const newInvoice = {
        id: invoices.length + 1,
        invoiceNumber: `INV-${formData.orderNumber}`,
        orderNumber: formData.orderNumber,
        customerName: order.customerName,
        date: new Date().toISOString().split('T')[0],
        amount: order.totalAmount,
        status: formData.status,
        createdBy: user?.name || 'Unknown',
        createdAt: new Date().toISOString().split('T')[0],
        updatedBy: null,
        updatedAt: null
      }
      setInvoices([...invoices, newInvoice])
      setShowCreateModal(false)
    }
  }

  const handleSubmitUpdate = (e) => {
    e.preventDefault()
    const updatedInvoices = invoices.map(inv =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            status: formData.status,
            updatedBy: user?.name || 'Unknown',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : inv
    )
    setInvoices(updatedInvoices)
    setShowEditModal(false)
    setSelectedInvoice(null)
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Invoices</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.orderNumber}</td>
                <td>{invoice.customerName}</td>
                <td>{invoice.date}</td>
                <td>₹{invoice.amount.toLocaleString()}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: invoice.status === 'paid' ? '#10b98120' : '#f59e0b20',
                    color: invoice.status === 'paid' ? '#10b981' : '#f59e0b'
                  }}>
                    {invoice.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <User size={12} />
                    {invoice.createdBy}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleView(invoice)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleEdit(invoice)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Invoice Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Invoice Information</h3>
                <p><strong>Invoice Number:</strong> {selectedInvoice.invoiceNumber}</p>
                <p><strong>Order Number:</strong> {selectedInvoice.orderNumber}</p>
                <p><strong>Customer:</strong> {selectedInvoice.customerName}</p>
                <p><strong>Date:</strong> {selectedInvoice.date}</p>
                <p><strong>Amount:</strong> ₹{selectedInvoice.amount.toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedInvoice.status}</p>
              </div>
              <div className="detail-section" style={{ marginTop: '16px' }}>
                <h3>Tracking Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User size={16} />
                  <div>
                    <p><strong>Created By:</strong> {selectedInvoice.createdBy}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Created on: {selectedInvoice.createdAt}
                    </p>
                  </div>
                </div>
                {selectedInvoice.updatedBy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <User size={16} />
                    <div>
                      <p><strong>Last Updated By:</strong> {selectedInvoice.updatedBy}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Updated on: {selectedInvoice.updatedAt}
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
            <h2>Create Invoice</h2>
            <form onSubmit={handleSubmitCreate}>
              <div className="form-group">
                <label>Sales Order Number</label>
                <select
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  required
                >
                  <option value="">Select Order</option>
                  {orders.filter(o => !invoices.find(inv => inv.orderNumber === o.orderNumber)).map(order => (
                    <option key={order.id} value={order.orderNumber}>
                      {order.orderNumber} - {order.customerName} (₹{order.totalAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                <p><strong>Note:</strong> This invoice will be created by {user?.name}</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Invoice</h2>
            <form onSubmit={handleSubmitUpdate}>
              <div className="form-group">
                <label>Invoice Number</label>
                <input type="text" value={selectedInvoice.invoiceNumber} disabled />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                <p><strong>Note:</strong> This update will be tracked with your name ({user?.name})</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesInvoices

