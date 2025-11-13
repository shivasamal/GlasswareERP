import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { getCustomers } from '../../data/staticData'
import '../../modules/Inventory/Products.css'

const SalesCustomers = () => {
  const [customers, setCustomers] = useState(getCustomers())
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gst: '',
    creditLimit: '',
    status: 'active'
  })

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingCustomer(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      gst: '',
      creditLimit: '',
      status: 'active'
    })
    setShowModal(true)
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      gst: customer.gst,
      creditLimit: customer.creditLimit,
      status: customer.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCustomer) {
      setCustomers(customers.map(c =>
        c.id === editingCustomer.id
          ? { ...editingCustomer, ...formData, creditLimit: parseFloat(formData.creditLimit) }
          : c
      ))
    } else {
      const newCustomer = {
        id: customers.length + 1,
        ...formData,
        creditLimit: parseFloat(formData.creditLimit)
      }
      setCustomers([...customers, newCustomer])
    }
    setShowModal(false)
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search customers..."
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
              <th>GST</th>
              <th>Credit Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>{customer.gst}</td>
                <td>₹{customer.creditLimit.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${customer.status}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleEdit(customer)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(customer.id)}>
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
            <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name</label>
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
                  <label>GST Number</label>
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    required
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
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCustomer ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesCustomers

