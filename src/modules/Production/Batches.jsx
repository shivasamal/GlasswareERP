import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { getProductionOrders } from '../../data/staticData'
import './Orders.css'

const ProductionBatches = () => {
  const [orders] = useState(getProductionOrders())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const batches = orders.filter(o => o.batchId).map(order => ({
    batchId: order.batchId,
    orderNumber: order.orderNumber,
    productName: order.productName,
    quantity: order.quantity,
    status: order.status,
    startDate: order.startDate,
    completionDate: order.completionDate
  }))

  const filteredBatches = batches.filter(b =>
    b.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (batch) => {
    setSelectedBatch(batch)
    setShowModal(true)
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Production Batches</h1>
        <p className="page-subtitle">Track and manage production batches</p>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search batches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Order Number</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Start Date</th>
              <th>Completion Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((batch, idx) => (
              <tr key={idx}>
                <td>{batch.batchId}</td>
                <td>{batch.orderNumber}</td>
                <td>{batch.productName}</td>
                <td>{batch.quantity}</td>
                <td>{batch.startDate || 'N/A'}</td>
                <td>{batch.completionDate || 'N/A'}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: batch.status === 'completed' ? '#10b98120' : '#3b82f620',
                    color: batch.status === 'completed' ? '#10b981' : '#3b82f6'
                  }}>
                    {batch.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => handleView(batch)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedBatch && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Batch Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <p><strong>Batch ID:</strong> {selectedBatch.batchId}</p>
                <p><strong>Order Number:</strong> {selectedBatch.orderNumber}</p>
                <p><strong>Product:</strong> {selectedBatch.productName}</p>
                <p><strong>Quantity:</strong> {selectedBatch.quantity}</p>
                <p><strong>Status:</strong> {selectedBatch.status}</p>
                <p><strong>Start Date:</strong> {selectedBatch.startDate || 'N/A'}</p>
                <p><strong>Completion Date:</strong> {selectedBatch.completionDate || 'N/A'}</p>
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

export default ProductionBatches

