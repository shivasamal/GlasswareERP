import { useState } from 'react'
import { Eye, CheckCircle, Edit, User, Clock, DollarSign } from 'lucide-react'
import { getPurchaseOrders } from '../../data/staticData'
import { useAuth } from '../../contexts/AuthContext'
import '../../modules/Production/Orders.css'

const AccountingAP = () => {
  const { user } = useAuth()
  const [orders] = useState(getPurchaseOrders())
  const [payables, setPayables] = useState(
    orders.map(order => ({
      id: order.id,
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      supplierName: order.supplierName,
      amount: order.totalAmount,
      dueDate: order.expectedDelivery,
      status: 'pending',
      createdBy: 'System',
      createdAt: order.date,
      updatedBy: null,
      updatedAt: null,
      paidAmount: 0,
      paymentDate: null
    }))
  )
  const [selectedPayable, setSelectedPayable] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  })

  const handleView = (payable) => {
    setSelectedPayable(payable)
    setShowModal(true)
  }

  const handlePay = (payable) => {
    setSelectedPayable(payable)
    setFormData({
      amount: payable.amount.toString(),
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'paid'
    })
    setShowPayModal(true)
  }

  const handleEdit = (payable) => {
    setSelectedPayable(payable)
    setFormData({
      amount: payable.amount.toString(),
      paymentDate: payable.paymentDate || new Date().toISOString().split('T')[0],
      status: payable.status
    })
    setShowEditModal(true)
  }

  const handleSubmitPayment = (e) => {
    e.preventDefault()
    const updatedPayables = payables.map(p =>
      p.id === selectedPayable.id
        ? {
            ...p,
            status: 'paid',
            paidAmount: parseFloat(formData.amount),
            paymentDate: formData.paymentDate,
            updatedBy: user?.name || 'Unknown',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : p
    )
    setPayables(updatedPayables)
    setShowPayModal(false)
    setSelectedPayable(null)
  }

  const handleSubmitUpdate = (e) => {
    e.preventDefault()
    const updatedPayables = payables.map(p =>
      p.id === selectedPayable.id
        ? {
            ...p,
            amount: parseFloat(formData.amount),
            status: formData.status,
            updatedBy: user?.name || 'Unknown',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : p
    )
    setPayables(updatedPayables)
    setShowEditModal(false)
    setSelectedPayable(null)
  }

  const totalPayable = payables.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = payables.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const overduePayables = payables.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date())

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Accounts Payable</h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Pending: </span>
            ₹{totalPayable.toLocaleString()}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#10b981' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Paid: </span>
            ₹{totalPaid.toLocaleString()}
          </div>
          {overduePayables.length > 0 && (
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#ef4444' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Overdue: </span>
              {overduePayables.length} invoices
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payables.map((payable) => {
              const isOverdue = payable.status === 'pending' && new Date(payable.dueDate) < new Date()
              return (
                <tr key={payable.id} style={isOverdue ? { backgroundColor: 'rgba(239, 68, 68, 0.05)' } : {}}>
                  <td>{payable.invoiceNumber}</td>
                  <td>{payable.supplierName}</td>
                  <td>₹{payable.amount.toLocaleString()}</td>
                  <td>
                    <div>
                      {payable.dueDate}
                      {isOverdue && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '8px' }}>⚠ Overdue</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="status-badge" style={{
                      backgroundColor: payable.status === 'paid' ? '#10b98120' : '#f59e0b20',
                      color: payable.status === 'paid' ? '#10b981' : '#f59e0b'
                    }}>
                      {payable.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {payable.updatedBy ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <User size={12} />
                        {payable.updatedBy}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <User size={12} />
                        {payable.createdBy}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleView(payable)} title="View Details">
                        <Eye size={16} />
                      </button>
                      {payable.status === 'pending' && (
                        <button className="btn-icon" onClick={() => handlePay(payable)} title="Mark as Paid" style={{ color: '#10b981' }}>
                          <DollarSign size={16} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => handleEdit(payable)} title="Edit">
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

      {showModal && selectedPayable && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Payable Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Payable Information</h3>
                <p><strong>Invoice Number:</strong> {selectedPayable.invoiceNumber}</p>
                <p><strong>Order Number:</strong> {selectedPayable.orderNumber}</p>
                <p><strong>Supplier:</strong> {selectedPayable.supplierName}</p>
                <p><strong>Amount:</strong> ₹{selectedPayable.amount.toLocaleString()}</p>
                <p><strong>Due Date:</strong> {selectedPayable.dueDate}</p>
                <p><strong>Status:</strong> {selectedPayable.status}</p>
                {selectedPayable.paidAmount > 0 && (
                  <>
                    <p><strong>Paid Amount:</strong> ₹{selectedPayable.paidAmount.toLocaleString()}</p>
                    <p><strong>Payment Date:</strong> {selectedPayable.paymentDate}</p>
                  </>
                )}
              </div>
              <div className="detail-section" style={{ marginTop: '16px' }}>
                <h3>Tracking Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User size={16} />
                  <div>
                    <p><strong>Created By:</strong> {selectedPayable.createdBy}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Created on: {selectedPayable.createdAt}
                    </p>
                  </div>
                </div>
                {selectedPayable.updatedBy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <User size={16} />
                    <div>
                      <p><strong>Last Updated By:</strong> {selectedPayable.updatedBy}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Updated on: {selectedPayable.updatedAt}
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

      {showPayModal && selectedPayable && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Record Payment</h2>
            <form onSubmit={handleSubmitPayment}>
              <div className="form-group">
                <label>Invoice Number</label>
                <input type="text" value={selectedPayable.invoiceNumber} disabled />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input type="text" value={selectedPayable.supplierName} disabled />
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
                <button type="button" className="btn-secondary" onClick={() => setShowPayModal(false)}>
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

      {showEditModal && selectedPayable && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Payable</h2>
            <form onSubmit={handleSubmitUpdate}>
              <div className="form-group">
                <label>Invoice Number</label>
                <input type="text" value={selectedPayable.invoiceNumber} disabled />
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
                  Update Payable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountingAP
