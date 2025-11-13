import { useState } from 'react'
import { Eye } from 'lucide-react'
import { getPurchaseOrders } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const PurchaseReceipts = () => {
  const [orders] = useState(getPurchaseOrders())
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const receipts = orders.filter(o => o.status === 'received').map(order => ({
    id: order.id,
    receiptNumber: `REC-${order.orderNumber}`,
    orderNumber: order.orderNumber,
    supplierName: order.supplierName,
    date: order.date,
    amount: order.totalAmount
  }))

  const handleView = (receipt) => {
    setSelectedReceipt(receipt)
    setShowModal(true)
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Purchase Receipts</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt Number</th>
              <th>Order Number</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td>{receipt.receiptNumber}</td>
                <td>{receipt.orderNumber}</td>
                <td>{receipt.supplierName}</td>
                <td>{receipt.date}</td>
                <td>₹{receipt.amount.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleView(receipt)}>
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Receipt Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <p><strong>Receipt Number:</strong> {selectedReceipt.receiptNumber}</p>
                <p><strong>Order Number:</strong> {selectedReceipt.orderNumber}</p>
                <p><strong>Supplier:</strong> {selectedReceipt.supplierName}</p>
                <p><strong>Date:</strong> {selectedReceipt.date}</p>
                <p><strong>Amount:</strong> ₹{selectedReceipt.amount.toLocaleString()}</p>
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

export default PurchaseReceipts

