import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { getPackaging, getSuppliers } from '../../data/staticData'
import './Products.css'

const InventoryPackaging = () => {
  const [packaging, setPackaging] = useState(getPackaging())
  const suppliers = getSuppliers()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    stock: '',
    minStock: '',
    unit: 'pcs',
    price: '',
    supplierId: '',
    status: 'active'
  })

  const filteredPackaging = packaging.filter(p =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      code: '',
      name: '',
      description: '',
      category: '',
      stock: '',
      minStock: '',
      unit: 'pcs',
      price: '',
      supplierId: '',
      status: 'active'
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      category: item.category,
      stock: item.stock,
      minStock: item.minStock,
      unit: item.unit,
      price: item.price,
      supplierId: item.supplierId,
      status: item.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this packaging item?')) {
      setPackaging(packaging.filter(p => p.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      setPackaging(packaging.map(p =>
        p.id === editingItem.id
          ? { ...editingItem, ...formData, stock: parseInt(formData.stock), minStock: parseInt(formData.minStock), price: parseFloat(formData.price), supplierId: parseInt(formData.supplierId) }
          : p
      ))
    } else {
      const newItem = {
        id: packaging.length + 1,
        ...formData,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        price: parseFloat(formData.price),
        supplierId: parseInt(formData.supplierId)
      }
      setPackaging([...packaging, newItem])
    }
    setShowModal(false)
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Packaging Materials</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Packaging
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search packaging..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackaging.map((item) => {
              const supplier = suppliers.find(s => s.id === item.supplierId)
              return (
                <tr key={item.id} className={item.stock <= item.minStock ? 'low-stock' : ''}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td>{item.minStock}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.price}</td>
                  <td>{supplier?.name || 'N/A'}</td>
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
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit Packaging' : 'Add Packaging'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Packaging Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Packaging Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
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
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Current Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Stock</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="pcs">Pieces</option>
                    <option value="sqm">Square Meter</option>
                    <option value="kg">Kilogram</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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

export default InventoryPackaging

