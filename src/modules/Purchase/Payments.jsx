import { useState } from 'react'
import { Eye, CheckCircle } from 'lucide-react'
import { getPurchaseOrders } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const PurchasePayments = () => {
  const [orders] = useState(getPurchaseOrders())
  const [payments, setPayments] = useState([
    { id: 1, paymentNumber: 'PAY-001', orderNumber: 'PUO-2024-001', supplierName: 'Glass Components Ltd', amount: 2500, date: '2024-01-25', status: 'paid' },
    { id: 2, paymentNumber: 'PAY-002', orderNumber: 'PUO-2024-002', supplierName: 'Precision Glass Works', amount: 5000, date: '2024-01-28', status: 'pending' }
  ])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleView = (payment) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  const handleMarkPaid = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'paid' } : p))
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Purchase Payments</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Payment Number</th>
              <th>Order Number</th>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.paymentNumber}</td>
                <td>{payment.orderNumber}</td>
                <td>{payment.supplierName}</td>
                <td>₹{payment.amount.toLocaleString()}</td>
                <td>{payment.date}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: payment.status === 'paid' ? '#10b98120' : '#f59e0b20',
                    color: payment.status === 'paid' ? '#10b981' : '#f59e0b'
                  }}>
                    {payment.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleView(payment)}>
                      <Eye size={16} />
                    </button>
                    {payment.status === 'pending' && (
                      <button className="btn-icon" onClick={() => handleMarkPaid(payment.id)}>
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Payment Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <p><strong>Payment Number:</strong> {selectedPayment.paymentNumber}</p>
                <p><strong>Order Number:</strong> {selectedPayment.orderNumber}</p>
                <p><strong>Supplier:</strong> {selectedPayment.supplierName}</p>
                <p><strong>Amount:</strong> ₹{selectedPayment.amount.toLocaleString()}</p>
                <p><strong>Date:</strong> {selectedPayment.date}</p>
                <p><strong>Status:</strong> {selectedPayment.status}</p>
              </div>
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

export default PurchasePayments

