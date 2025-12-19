import { useState } from 'react'
import { Package, ArrowDown, ArrowUp, User, FileText, Search, Plus } from 'lucide-react'
import { getRawMaterials, getFinishedGoods, getStockMovements } from '../../../data/inventoryData'
import { useAuth } from '../../../contexts/AuthContext'
import './StockMovements.css'

const StockMovements = () => {
  const { user } = useAuth()
  const [movements, setMovements] = useState(getStockMovements())
  const [rawMaterials] = useState(getRawMaterials())
  const [finishedGoods] = useState(getFinishedGoods())
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    type: 'inward',
    productId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
    authorizedBy: user?.name || '',
    dispatchedBy: ''
  })

  const allProducts = [...rawMaterials, ...finishedGoods]

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMovement = {
      id: movements.length + 1,
      ...formData,
      productName: allProducts.find(p => p.productId === formData.productId)?.name || formData.productId,
      approvedBy: user?.name || 'Admin',
      status: 'completed'
    }
    setMovements([newMovement, ...movements])
    setShowModal(false)
    setFormData({
      type: 'inward',
      productId: '',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      notes: '',
      authorizedBy: user?.name || '',
      dispatchedBy: ''
    })
  }

  const filteredMovements = movements.filter(m => 
    m.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)

  return (
    <div className="stock-movements">
      <div className="page-header">
        <div>
          <h1>Stock Movements</h1>
          <p>Track inward and outward stock transactions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Movement
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by product name or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Reference</th>
              <th>Authorized By</th>
              <th>Dispatched By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMovements.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No stock movements found</td>
              </tr>
            ) : (
              paginatedMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.date}</td>
                  <td>
                    <span className={`badge ${movement.type === 'inward' ? 'badge-success' : 'badge-warning'}`}>
                      {movement.type === 'inward' ? (
                        <><ArrowDown size={14} /> Inward</>
                      ) : (
                        <><ArrowUp size={14} /> Outward</>
                      )}
                    </span>
                  </td>
                  <td>
                    <div>
                      <strong>{movement.productName}</strong>
                      <small>{movement.productId}</small>
                    </div>
                  </td>
                  <td>{movement.quantity}</td>
                  <td>{movement.reference}</td>
                  <td>{movement.authorizedBy}</td>
                  <td>{movement.dispatchedBy || '-'}</td>
                  <td>
                    <span className="badge badge-success">{movement.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Stock Movement</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Movement Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="inward">Inward</option>
                  <option value="outward">Outward</option>
                </select>
              </div>

              <div className="form-group">
                <label>Product *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                >
                  <option value="">Select Product</option>
                  {allProducts.map(product => (
                    <option key={product.productId} value={product.productId}>
                      {product.productId} - {product.name} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reference Number</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="PO-001, SO-001, etc."
                />
              </div>

              {formData.type === 'outward' && (
                <div className="form-group">
                  <label>Dispatched By *</label>
                  <input
                    type="text"
                    value={formData.dispatchedBy}
                    onChange={(e) => setFormData({ ...formData, dispatchedBy: e.target.value })}
                    required
                    placeholder="Person name who dispatched"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Authorized By *</label>
                <input
                  type="text"
                  value={formData.authorizedBy}
                  onChange={(e) => setFormData({ ...formData, authorizedBy: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockMovements

