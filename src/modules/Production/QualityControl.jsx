import { useState } from 'react'
import { Plus, Edit, CheckCircle, XCircle } from 'lucide-react'
import './Orders.css'

const QualityControl = () => {
  const [qualityRecords, setQualityRecords] = useState([
    { id: 1, batchId: 'BATCH-001', productCode: 'RBR-117', quantity: 50, passed: 48, failed: 2, date: '2024-01-15', inspector: 'Rajesh Kumar', notes: '2 units had minor defects' },
    { id: 2, batchId: 'BATCH-002', productCode: 'RB-121', quantity: 100, passed: 98, failed: 2, date: '2024-01-18', inspector: 'Priya Sharma', notes: 'All quality checks passed' }
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    batchId: '',
    productCode: '',
    quantity: '',
    passed: '',
    failed: '',
    date: new Date().toISOString().split('T')[0],
    inspector: '',
    notes: ''
  })

  const handleAdd = () => {
    setEditingRecord(null)
    setFormData({
      batchId: '',
      productCode: '',
      quantity: '',
      passed: '',
      failed: '',
      date: new Date().toISOString().split('T')[0],
      inspector: '',
      notes: ''
    })
    setShowModal(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData({
      batchId: record.batchId,
      productCode: record.productCode,
      quantity: record.quantity,
      passed: record.passed,
      failed: record.failed,
      date: record.date,
      inspector: record.inspector,
      notes: record.notes
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingRecord) {
      setQualityRecords(qualityRecords.map(r =>
        r.id === editingRecord.id
          ? { ...editingRecord, ...formData, quantity: parseInt(formData.quantity), passed: parseInt(formData.passed), failed: parseInt(formData.failed) }
          : r
      ))
    } else {
      const newRecord = {
        id: qualityRecords.length + 1,
        ...formData,
        quantity: parseInt(formData.quantity),
        passed: parseInt(formData.passed),
        failed: parseInt(formData.failed)
      }
      setQualityRecords([...qualityRecords, newRecord])
    }
    setShowModal(false)
  }

  const totalInspected = qualityRecords.reduce((sum, r) => sum + r.quantity, 0)
  const totalPassed = qualityRecords.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = qualityRecords.reduce((sum, r) => sum + r.failed, 0)
  const passRate = totalInspected > 0 ? ((totalPassed / totalInspected) * 100).toFixed(2) : 0

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Quality Control</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Quality Record
        </button>
      </div>

      <div className="stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Inspected</p>
            <p className="stat-value">{totalInspected}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Passed</p>
            <p className="stat-value">{totalPassed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Failed</p>
            <p className="stat-value">{totalFailed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pass Rate</p>
            <p className="stat-value">{passRate}%</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Product Code</th>
              <th>Quantity</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Pass Rate</th>
              <th>Date</th>
              <th>Inspector</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {qualityRecords.map((record) => {
              const passRate = ((record.passed / record.quantity) * 100).toFixed(2)
              return (
                <tr key={record.id}>
                  <td>{record.batchId}</td>
                  <td>{record.productCode}</td>
                  <td>{record.quantity}</td>
                  <td style={{ color: '#10b981' }}>{record.passed}</td>
                  <td style={{ color: '#ef4444' }}>{record.failed}</td>
                  <td>{passRate}%</td>
                  <td>{record.date}</td>
                  <td>{record.inspector}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleEdit(record)}>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingRecord ? 'Edit Quality Record' : 'Add Quality Record'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Batch ID</label>
                  <input
                    type="text"
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Product Code</label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Passed</label>
                  <input
                    type="number"
                    value={formData.passed}
                    onChange={(e) => setFormData({ ...formData, passed: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Failed</label>
                  <input
                    type="number"
                    value={formData.failed}
                    onChange={(e) => setFormData({ ...formData, failed: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Inspector</label>
                  <input
                    type="text"
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingRecord ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default QualityControl

