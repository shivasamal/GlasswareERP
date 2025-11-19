import { useState } from 'react'
import { Eye, Package, FileText, User, Calendar } from 'lucide-react'
import { getPurchaseReceipts, getPurchaseOrders } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const PurchaseReceipts = () => {
  const [receipts] = useState(getPurchaseReceipts())
  const [orders] = useState(getPurchaseOrders())
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [showModal, setShowModal] = useState(false)

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
              <th>Received Date</th>
              <th>Received By</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length > 0 ? (
              receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td>
                    <strong style={{ color: '#2563eb' }}>{receipt.receiptNumber}</strong>
                  </td>
                  <td>{receipt.orderNumber}</td>
                  <td>{receipt.supplierName}</td>
                  <td>{receipt.receivedDate || receipt.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                      <User size={12} />
                      {receipt.receivedBy || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {receipt.items?.length || 0} item(s)
                    </span>
                  </td>
                  <td>₹{receipt.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className="status-badge" style={{
                      backgroundColor: receipt.status === 'complete' ? '#10b98120' : '#f59e0b20',
                      color: receipt.status === 'complete' ? '#10b981' : '#f59e0b'
                    }}>
                      {receipt.status?.toUpperCase() || 'COMPLETE'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleView(receipt)} title="View Details">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No receipts found. Receipts are created when purchase orders are marked as received.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Purchase Receipt Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>
                  <FileText size={18} style={{ marginRight: '8px', display: 'inline' }} />
                  Receipt Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <p><strong>Receipt Number:</strong> {selectedReceipt.receiptNumber}</p>
                  <p><strong>GRN Number:</strong> {selectedReceipt.grnNumber || 'N/A'}</p>
                  <p><strong>Order Number:</strong> {selectedReceipt.orderNumber}</p>
                  <p><strong>Invoice Number:</strong> {selectedReceipt.invoiceNumber || 'N/A'}</p>
                  <p><strong>Supplier:</strong> {selectedReceipt.supplierName}</p>
                  <p><strong>Status:</strong> 
                    <span className="status-badge" style={{
                      backgroundColor: selectedReceipt.status === 'complete' ? '#10b98120' : '#f59e0b20',
                      color: selectedReceipt.status === 'complete' ? '#10b981' : '#f59e0b',
                      marginLeft: '8px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {selectedReceipt.status?.toUpperCase() || 'COMPLETE'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="detail-section">
                <h3>
                  <Calendar size={18} style={{ marginRight: '8px', display: 'inline' }} />
                  Receipt Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <p><strong>Receipt Date:</strong> {selectedReceipt.receivedDate || selectedReceipt.date}</p>
                  <p><strong>Order Date:</strong> {(() => {
                    const order = orders.find(o => o.orderNumber === selectedReceipt.orderNumber)
                    return order?.date || 'N/A'
                  })()}</p>
                  <p><strong>Received By:</strong> 
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <User size={14} />
                      {selectedReceipt.receivedBy || 'N/A'}
                    </div>
                  </p>
                  <p><strong>Total Amount:</strong> ₹{selectedReceipt.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {selectedReceipt.items && selectedReceipt.items.length > 0 && (
                <div className="detail-section">
                  <h3>
                    <Package size={18} style={{ marginRight: '8px', display: 'inline' }} />
                    Received Items
                  </h3>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Ordered Qty</th>
                        <th>Received Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReceipt.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.componentCode || item.packagingCode}</td>
                          <td>{item.componentName || item.packagingName}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <span style={{
                              color: item.receivedQuantity === item.quantity ? '#10b981' : '#f59e0b',
                              fontWeight: '600'
                            }}>
                              {item.receivedQuantity || item.quantity}
                            </span>
                          </td>
                          <td>₹{item.unitPrice.toLocaleString()}</td>
                          <td>₹{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'right', fontWeight: '600', padding: '12px' }}>
                          Total Amount:
                        </td>
                        <td style={{ fontWeight: '600', padding: '12px' }}>
                          ₹{selectedReceipt.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {selectedReceipt.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p style={{ 
                    padding: '12px', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: '6px',
                    fontStyle: 'italic',
                    color: 'var(--text-secondary)'
                  }}>
                    {selectedReceipt.notes}
                  </p>
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

export default PurchaseReceipts

