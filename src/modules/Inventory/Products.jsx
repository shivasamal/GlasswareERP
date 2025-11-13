import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { getBaseProducts } from '../../data/staticData'
import './Products.css'

const InventoryProducts = () => {
  const [products, setProducts] = useState(getBaseProducts())
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    stock: '',
    minStock: '',
    unit: 'pcs',
    price: '',
    status: 'active'
  })

  const filteredProducts = products.filter(p =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      code: '',
      name: '',
      description: '',
      category: '',
      stock: '',
      minStock: '',
      unit: 'pcs',
      price: '',
      status: 'active'
    })
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      code: product.code,
      name: product.name,
      description: product.description,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      price: product.price,
      status: product.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...editingProduct, ...formData, stock: parseInt(formData.stock), minStock: parseInt(formData.minStock), price: parseFloat(formData.price) }
          : p
      ))
    } else {
      const newProduct = {
        id: products.length + 1,
        ...formData,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        price: parseFloat(formData.price)
      }
      setProducts([...products, newProduct])
    }
    setShowModal(false)
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Base Products</h1>
        <button className="btn-primary" onClick={handleAdd}>
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
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={product.stock <= product.minStock ? 'low-stock' : ''}>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{product.minStock}</td>
                <td>{product.unit}</td>
                <td>₹{product.price}</td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleEdit(product)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(product.id)}>
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
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Product Name</label>
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
                  {editingProduct ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryProducts

