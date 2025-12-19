import { useState } from 'react'
import { Users, Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { getSuppliers, getPurchaseOrders } from '../../../data/inventoryData'
import './Suppliers.css'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(getSuppliers())
  const [orders] = useState(getPurchaseOrders())
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gst: '',
    products: '',
    paymentTerms: 'Net 30',
    status: 'active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedSupplier) {
      setSuppliers(suppliers.map(s => s.id === selectedSupplier.id ? { ...s, ...formData, products: formData.products.split(',').map(p => p.trim()) } : s))
    } else {
      const newSupplier = {
        id: suppliers.length + 1,
        ...formData,
        products: formData.products.split(',').map(p => p.trim()),
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null
      }
      setSuppliers([newSupplier, ...suppliers])
    }
    setShowModal(false)
    setSelectedSupplier(null)
  }

  const getSupplierStats = (supplierId) => {
    const supplierOrders = orders.filter(o => o.supplierId === supplierId)
    const totalSpent = supplierOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const lastOrder = supplierOrders.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    return {
      totalOrders: supplierOrders.length,
      totalSpent,
      lastOrderDate: lastOrder?.date || null
    }
  }

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage)

  return (
    <div className="suppliers">
      <div className="page-header">
        <div>
          <h1>Suppliers</h1>
          <p>Manage supplier information and track purchases</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setSelectedSupplier(null)
          setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            gst: '',
            products: '',
            paymentTerms: 'Net 30',
            status: 'active'
          })
          setShowModal(true)
        }}>
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
              <th>Contact</th>
              <th>Address</th>
              <th>GST</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No suppliers found</td>
              </tr>
            ) : (
              paginatedSuppliers.map((supplier) => {
                const stats = getSupplierStats(supplier.id)
                return (
                  <tr key={supplier.id}>
                    <td><strong>{supplier.name}</strong></td>
                    <td>
                      <div>
                        <div>{supplier.email}</div>
                        <small>{supplier.phone}</small>
                      </div>
                    </td>
                    <td>{supplier.address}</td>
                    <td>{supplier.gst}</td>
                    <td>{stats.totalOrders}</td>
                    <td>₹{stats.totalSpent.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${supplier.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => {
                          setSelectedSupplier(supplier)
                          setShowDetailsModal(true)
                        }} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => {
                          setSelectedSupplier(supplier)
                          setFormData({
                            name: supplier.name,
                            email: supplier.email,
                            phone: supplier.phone,
                            address: supplier.address,
                            gst: supplier.gst,
                            products: supplier.products.join(', '),
                            paymentTerms: supplier.paymentTerms,
                            status: supplier.status
                          })
                          setShowModal(true)
                        }} title="Edit">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
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
              <h2>{selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GST Number</label>
                  <input type="text" value={formData.gst} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Payment Terms</label>
                  <select value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Products (comma separated)</label>
                <input type="text" value={formData.products} onChange={(e) => setFormData({ ...formData, products: e.target.value })} placeholder="Product 1, Product 2" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{selectedSupplier ? 'Update' : 'Add'} Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedSupplier && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Supplier Details - {selectedSupplier.name}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="supplier-details">
              <div className="detail-section">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {selectedSupplier.email}</p>
                <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
                <p><strong>Address:</strong> {selectedSupplier.address}</p>
                <p><strong>GST:</strong> {selectedSupplier.gst}</p>
              </div>
              <div className="detail-section">
                <h3>Purchase Statistics</h3>
                {(() => {
                  const stats = getSupplierStats(selectedSupplier.id)
                  return (
                    <>
                      <p><strong>Total Orders:</strong> {stats.totalOrders}</p>
                      <p><strong>Total Spent:</strong> ₹{stats.totalSpent.toLocaleString()}</p>
                      <p><strong>Last Order:</strong> {stats.lastOrderDate || 'No orders yet'}</p>
                    </>
                  )
                })()}
              </div>
              <div className="detail-section">
                <h3>Products</h3>
                <p>{selectedSupplier.products.join(', ') || 'No products specified'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers

