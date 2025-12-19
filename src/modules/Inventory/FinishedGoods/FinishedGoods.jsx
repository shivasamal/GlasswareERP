import { useState } from 'react'
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react'
import { getFinishedGoods } from '../../../data/inventoryData'
import './FinishedGoods.css'

const FinishedGoods = () => {
  const [goods, setGoods] = useState(getFinishedGoods())
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingGood, setEditingGood] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    category: '',
    stock: '',
    minStock: '',
    unit: 'pcs',
    price: '',
    location: '',
    components: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingGood) {
      setGoods(goods.map(g => g.id === editingGood.id ? { ...g, ...formData, stock: parseInt(formData.stock), minStock: parseInt(formData.minStock), price: parseFloat(formData.price) } : g))
    } else {
      const newGood = {
        id: goods.length + 1,
        ...formData,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        price: parseFloat(formData.price),
        status: 'active',
        components: formData.components || []
      }
      setGoods([newGood, ...goods])
    }
    setShowModal(false)
    setEditingGood(null)
  }

  const filteredGoods = goods.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.productId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedGoods = filteredGoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredGoods.length / itemsPerPage)

  return (
    <div className="finished-goods">
      <div className="page-header">
        <div>
          <h1>Finished Goods</h1>
          <p>Manage finished products ready for sale</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditingGood(null)
          setFormData({
            productId: '',
            name: '',
            description: '',
            category: '',
            stock: '',
            minStock: '',
            unit: 'pcs',
            price: '',
            location: '',
            components: []
          })
          setShowModal(true)
        }}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Unit Price</th>
              <th>Components</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGoods.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No finished goods found</td>
              </tr>
            ) : (
              paginatedGoods.map((good) => (
                <tr key={good.id}>
                  <td><strong>{good.productId}</strong></td>
                  <td>{good.name}</td>
                  <td>{good.category}</td>
                  <td>
                    <span className={good.stock <= good.minStock ? 'low-stock' : ''}>
                      {good.stock} {good.unit}
                    </span>
                  </td>
                  <td>{good.minStock} {good.unit}</td>
                  <td>₹{good.price}</td>
                  <td>
                    {good.components?.length > 0 ? (
                      <small>{good.components.length} components</small>
                    ) : (
                      <small className="text-muted">No components</small>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => {
                        setEditingGood(good)
                        setFormData({
                          productId: good.productId,
                          name: good.name,
                          description: good.description,
                          category: good.category,
                          stock: good.stock.toString(),
                          minStock: good.minStock.toString(),
                          unit: good.unit,
                          price: good.price.toString(),
                          location: good.location || '',
                          components: good.components || []
                        })
                        setShowModal(true)
                      }} title="Edit">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGood ? 'Edit Product' : 'Add Finished Good'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product ID *</label>
                <input type="text" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required>
                    <option value="pcs">Pieces</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required min="0" />
                </div>
                <div className="form-group">
                  <label>Min Stock *</label>
                  <input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} required min="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit Price *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingGood ? 'Update' : 'Add'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinishedGoods

