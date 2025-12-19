import { useState } from 'react'
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react'
import { getRawMaterials } from '../../../data/inventoryData'
import './RawMaterials.css'

const RawMaterials = () => {
  const [materials, setMaterials] = useState(getRawMaterials())
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingMaterial, setEditingMaterial] = useState(null)
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
    supplierId: '',
    location: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...m, ...formData, stock: parseInt(formData.stock), minStock: parseInt(formData.minStock), price: parseFloat(formData.price), supplierId: parseInt(formData.supplierId) } : m))
    } else {
      const newMaterial = {
        id: materials.length + 1,
        ...formData,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        price: parseFloat(formData.price),
        supplierId: parseInt(formData.supplierId),
        status: 'active'
      }
      setMaterials([newMaterial, ...materials])
    }
    setShowModal(false)
    setEditingMaterial(null)
  }

  const handleEdit = (material) => {
    setEditingMaterial(material)
    setFormData({
      productId: material.productId,
      name: material.name,
      description: material.description,
      category: material.category,
      stock: material.stock.toString(),
      minStock: material.minStock.toString(),
      unit: material.unit,
      price: material.price.toString(),
      supplierId: material.supplierId?.toString() || '',
      location: material.location || ''
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id))
    }
  }

  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.productId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage)

  return (
    <div className="raw-materials">
      <div className="page-header">
        <div>
          <h1>Raw Materials</h1>
          <p>Manage raw materials and components from suppliers</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditingMaterial(null)
          setFormData({
            productId: '',
            name: '',
            description: '',
            category: '',
            stock: '',
            minStock: '',
            unit: 'pcs',
            price: '',
            supplierId: '',
            location: ''
          })
          setShowModal(true)
        }}>
          <Plus size={20} />
          Add Material
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search materials..."
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
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMaterials.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No raw materials found</td>
              </tr>
            ) : (
              paginatedMaterials.map((material) => (
                <tr key={material.id}>
                  <td><strong>{material.productId}</strong></td>
                  <td>{material.name}</td>
                  <td>{material.category}</td>
                  <td>
                    <span className={material.stock <= material.minStock ? 'low-stock' : ''}>
                      {material.stock} {material.unit}
                    </span>
                  </td>
                  <td>{material.minStock} {material.unit}</td>
                  <td>₹{material.price}</td>
                  <td>{material.location}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleEdit(material)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(material.id)} title="Delete">
                        <Trash2 size={16} />
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
              <h2>{editingMaterial ? 'Edit Material' : 'Add Raw Material'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product ID *</label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                  placeholder="RM-001"
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="sqm">Square Meters</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Min Stock *</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Warehouse A"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingMaterial ? 'Update' : 'Add'} Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RawMaterials

