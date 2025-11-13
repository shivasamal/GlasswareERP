import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { getSuppliers } from '../../data/staticData'
import '../../modules/Inventory/Products.css'

const PurchaseSuppliers = () => {
  const [suppliers, setSuppliers] = useState(getSuppliers())
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    products: '',
    paymentTerms: '',
    status: 'active'
  })

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingSupplier(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      products: '',
      paymentTerms: '',
      status: 'active'
    })
    setShowModal(true)
  }

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      products: Array.isArray(supplier.products) ? supplier.products.join(', ') : supplier.products,
      paymentTerms: supplier.paymentTerms,
      status: supplier.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSupplier) {
      setSuppliers(suppliers.map(s =>
        s.id === editingSupplier.id
          ? { ...editingSupplier, ...formData, products: formData.products.split(',').map(p => p.trim()) }
          : s
      ))
    } else {
      const newSupplier = {
        id: suppliers.length + 1,
        ...formData,
        products: formData.products.split(',').map(p => p.trim())
      }
      setSuppliers([...suppliers, newSupplier])
    }
    setShowModal(false)
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Suppliers</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Supplier
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Products</th>
              <th>Payment Terms</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>{Array.isArray(supplier.products) ? supplier.products.join(', ') : supplier.products}</td>
                <td>{supplier.paymentTerms}</td>
                <td>
                  <span className={`status-badge ${supplier.status}`}>
                    {supplier.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleEdit(supplier)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(supplier.id)}>
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
            <h2>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    placeholder="e.g., Net 30"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Products (comma separated)</label>
                <input
                  type="text"
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  placeholder="e.g., Outlets, Joints, Caps"
                />
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
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSupplier ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseSuppliers

