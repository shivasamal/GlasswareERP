import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { getProductionOrders } from '../../data/staticData'
import BatchDetailView from '../../components/BatchDetailView'
import './Orders.css'

const ProductionBatches = () => {
  const [orders, setOrders] = useState(getProductionOrders())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const batches = orders.filter(o => o.batchId).map(order => ({
    batchId: order.batchId,
    orderNumber: order.orderNumber,
    productName: order.productName,
    productCode: order.productCode,
    quantity: order.quantity,
    status: order.status,
    startDate: order.startDate,
    completionDate: order.completionDate,
    tracking: order.tracking,
    notes: order.notes
  }))

  const filteredBatches = batches.filter(b =>
    b.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (batch) => {
    // Get full order details
    const fullOrder = orders.find(o => o.batchId === batch.batchId)
    setSelectedBatch({ ...batch, ...fullOrder })
    setShowModal(true)
  }

  const handleBatchUpdate = (updatedBatch) => {
    // Update the order with new tracking data
    setOrders(orders.map(order => 
      order.batchId === updatedBatch.batchId
        ? { ...order, ...updatedBatch }
        : order
    ))
    setSelectedBatch(updatedBatch)
  }

  const handleBatchClick = (batch) => {
    handleView(batch)
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
            {filteredBatches.map((batch, idx) => {
              // Calculate progress if tracking exists
              const progress = batch.tracking?.progress || (batch.status === 'completed' ? 100 : batch.status === 'in_progress' ? 45 : 10)
              
              return (
                <tr key={idx}>
                  <td>
                    <button 
                      className="batch-id-link" 
                      onClick={() => handleBatchClick(batch)}
                      title="Click to view detailed batch tracking"
                    >
                      {batch.batchId}
                    </button>
                  </td>
                  <td>{batch.orderNumber}</td>
                  <td>{batch.productName}</td>
                  <td>{batch.quantity}</td>
                  <td>{batch.startDate || 'N/A'}</td>
                  <td>{batch.completionDate || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="status-badge" style={{
                        backgroundColor: batch.status === 'completed' ? '#10b98120' : '#3b82f620',
                        color: batch.status === 'completed' ? '#10b981' : '#3b82f6'
                      }}>
                        {batch.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => handleView(batch)} title="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && selectedBatch && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content batch-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Batch Tracking & Details</h2>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
            <BatchDetailView 
              batch={selectedBatch} 
              order={orders.find(o => o.batchId === selectedBatch.batchId)}
              onUpdate={handleBatchUpdate}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductionBatches

