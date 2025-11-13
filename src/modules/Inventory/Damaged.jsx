import { useState } from 'react'
import { Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react'
import { getDamagedItems } from '../../data/staticData'
import './Products.css'

const InventoryDamaged = () => {
  const [damagedItems, setDamagedItems] = useState(getDamagedItems())
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    quantity: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    status: 'damaged'
  })

  const filteredItems = damagedItems.filter(item =>
    item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      productCode: '',
      productName: '',
      quantity: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      status: 'damaged'
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      productCode: item.productCode,
      productName: item.productName,
      quantity: item.quantity,
      reason: item.reason,
      date: item.date,
      location: item.location,
      status: item.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setDamagedItems(damagedItems.filter(item => item.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      setDamagedItems(damagedItems.map(item =>
        item.id === editingItem.id
          ? { ...editingItem, ...formData, quantity: parseInt(formData.quantity) }
          : item
      ))
    } else {
      const newItem = {
        id: damagedItems.length + 1,
        ...formData,
        quantity: parseInt(formData.quantity)
      }
      setDamagedItems([...damagedItems, newItem])
    }
    setShowModal(false)
  }

  const totalDamaged = damagedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalScrap = damagedItems.filter(item => item.status === 'scrap').reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Damaged & Scrap Items</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Record
        </button>
      </div>

      <div className="stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Damaged</p>
            <p className="stat-value">{totalDamaged}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Scrap</p>
            <p className="stat-value">{totalScrap}</p>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search damaged items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.productCode}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.reason}</td>
                <td>{item.date}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleEdit(item)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit Record' : 'Add Damaged Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Code</label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="damaged">Damaged</option>
                    <option value="scrap">Scrap</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryDamaged

