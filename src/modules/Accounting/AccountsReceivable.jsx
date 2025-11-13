import { useState } from 'react'
import { Eye, CheckCircle, Edit, User, Clock, DollarSign } from 'lucide-react'
import { getSalesOrders } from '../../data/staticData'
import { useAuth } from '../../contexts/AuthContext'
import '../../modules/Production/Orders.css'

const AccountingAR = () => {
  const { user } = useAuth()
  const [orders] = useState(getSalesOrders())
  const [receivables, setReceivables] = useState(
    orders.map(order => ({
      id: order.id,
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      amount: order.totalAmount,
      dueDate: order.deliveryDate,
      status: order.status === 'completed' ? 'paid' : 'pending',
      createdBy: 'System',
      createdAt: order.date,
      updatedBy: null,
      updatedAt: null,
      receivedAmount: 0,
      paymentDate: null
    }))
  )
  const [selectedReceivable, setSelectedReceivable] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  })

  const handleView = (receivable) => {
    setSelectedReceivable(receivable)
    setShowModal(true)
  }

  const handleReceive = (receivable) => {
    setSelectedReceivable(receivable)
    setFormData({
      amount: receivable.amount.toString(),
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'paid'
    })
    setShowReceiveModal(true)
  }

  const handleEdit = (receivable) => {
    setSelectedReceivable(receivable)
    setFormData({
      amount: receivable.amount.toString(),
      paymentDate: receivable.paymentDate || new Date().toISOString().split('T')[0],
      status: receivable.status
    })
    setShowEditModal(true)
  }

  const handleSubmitPayment = (e) => {
    e.preventDefault()
    const updatedReceivables = receivables.map(r =>
      r.id === selectedReceivable.id
        ? {
            ...r,
            status: 'paid',
            receivedAmount: parseFloat(formData.amount),
            paymentDate: formData.paymentDate,
            updatedBy: user?.name || 'Unknown',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : r
    )
    setReceivables(updatedReceivables)
    setShowReceiveModal(false)
    setSelectedReceivable(null)
  }

  const handleSubmitUpdate = (e) => {
    e.preventDefault()
    const updatedReceivables = receivables.map(r =>
      r.id === selectedReceivable.id
        ? {
            ...r,
            amount: parseFloat(formData.amount),
            status: formData.status,
            updatedBy: user?.name || 'Unknown',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : r
    )
    setReceivables(updatedReceivables)
    setShowEditModal(false)
    setSelectedReceivable(null)
  }

  const totalReceivable = receivables.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)
  const totalReceived = receivables.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)
  const overdueReceivables = receivables.filter(r => r.status === 'pending' && new Date(r.dueDate) < new Date())

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Accounts Receivable</h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Pending: </span>
            ₹{totalReceivable.toLocaleString()}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#10b981' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Received: </span>
            ₹{totalReceived.toLocaleString()}
          </div>
          {overdueReceivables.length > 0 && (
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#ef4444' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Overdue: </span>
              {overdueReceivables.length} invoices
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receivables.map((receivable) => {
              const isOverdue = receivable.status === 'pending' && new Date(receivable.dueDate) < new Date()
              return (
                <tr key={receivable.id} style={isOverdue ? { backgroundColor: 'rgba(239, 68, 68, 0.05)' } : {}}>
                  <td>{receivable.invoiceNumber}</td>
                  <td>{receivable.customerName}</td>
                  <td>₹{receivable.amount.toLocaleString()}</td>
                  <td>
                    <div>
                      {receivable.dueDate}
                      {isOverdue && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '8px' }}>⚠ Overdue</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="status-badge" style={{
                      backgroundColor: receivable.status === 'paid' ? '#10b98120' : '#f59e0b20',
                      color: receivable.status === 'paid' ? '#10b981' : '#f59e0b'
                    }}>
                      {receivable.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {receivable.updatedBy ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <User size={12} />
                        {receivable.updatedBy}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <User size={12} />
                        {receivable.createdBy}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleView(receivable)} title="View Details">
                        <Eye size={16} />
                      </button>
                      {receivable.status === 'pending' && (
                        <button className="btn-icon" onClick={() => handleReceive(receivable)} title="Record Payment" style={{ color: '#10b981' }}>
                          <DollarSign size={16} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => handleEdit(receivable)} title="Edit">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && selectedReceivable && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Receivable Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Receivable Information</h3>
                <p><strong>Invoice Number:</strong> {selectedReceivable.invoiceNumber}</p>
                <p><strong>Order Number:</strong> {selectedReceivable.orderNumber}</p>
                <p><strong>Customer:</strong> {selectedReceivable.customerName}</p>
                <p><strong>Amount:</strong> ₹{selectedReceivable.amount.toLocaleString()}</p>
                <p><strong>Due Date:</strong> {selectedReceivable.dueDate}</p>
                <p><strong>Status:</strong> {selectedReceivable.status}</p>
                {selectedReceivable.receivedAmount > 0 && (
                  <>
                    <p><strong>Received Amount:</strong> ₹{selectedReceivable.receivedAmount.toLocaleString()}</p>
                    <p><strong>Payment Date:</strong> {selectedReceivable.paymentDate}</p>
                  </>
                )}
              </div>
              <div className="detail-section" style={{ marginTop: '16px' }}>
                <h3>Tracking Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User size={16} />
                  <div>
                    <p><strong>Created By:</strong> {selectedReceivable.createdBy}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Created on: {selectedReceivable.createdAt}
                    </p>
                  </div>
                </div>
                {selectedReceivable.updatedBy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <User size={16} />
                    <div>
                      <p><strong>Last Updated By:</strong> {selectedReceivable.updatedBy}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Updated on: {selectedReceivable.updatedAt}
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

      {showReceiveModal && selectedReceivable && (
        <div className="modal-overlay" onClick={() => setShowReceiveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Record Payment Received</h2>
            <form onSubmit={handleSubmitPayment}>
              <div className="form-group">
                <label>Invoice Number</label>
                <input type="text" value={selectedReceivable.invoiceNumber} disabled />
              </div>
              <div className="form-group">
                <label>Customer</label>
                <input type="text" value={selectedReceivable.customerName} disabled />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount Received (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Date</label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                <p><strong>Note:</strong> This payment will be recorded by {user?.name}</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReceiveModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={16} style={{ marginRight: '8px' }} />
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedReceivable && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Receivable</h2>
            <form onSubmit={handleSubmitUpdate}>
              <div className="form-group">
                <label>Invoice Number</label>
                <input type="text" value={selectedReceivable.invoiceNumber} disabled />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                <p><strong>Note:</strong> This update will be tracked with your name ({user?.name})</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Receivable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountingAR
