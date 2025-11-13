import { useState } from 'react'
import { Eye, Download } from 'lucide-react'
import { getEmployees } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const HRPayroll = () => {
  const employees = getEmployees()
  const [payroll, setPayroll] = useState(
    employees.map(emp => ({
      id: emp.id,
      employeeName: emp.name,
      department: emp.department,
      salary: emp.salary,
      month: 'January 2024',
      status: 'paid'
    }))
  )
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleView = (record) => {
    setSelectedPayroll(record)
    setShowModal(true)
  }

  const totalPayroll = payroll.reduce((sum, p) => sum + p.salary, 0)

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Payroll</h1>
        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Total Payroll: ₹{totalPayroll.toLocaleString()}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Month</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeName}</td>
                <td>{record.department}</td>
                <td>{record.month}</td>
                <td>₹{record.salary.toLocaleString()}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: record.status === 'paid' ? '#10b98120' : '#f59e0b20',
                    color: record.status === 'paid' ? '#10b981' : '#f59e0b'
                  }}>
                    {record.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleView(record)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedPayroll && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Payroll Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <p><strong>Employee:</strong> {selectedPayroll.employeeName}</p>
                <p><strong>Department:</strong> {selectedPayroll.department}</p>
                <p><strong>Month:</strong> {selectedPayroll.month}</p>
                <p><strong>Salary:</strong> ₹{selectedPayroll.salary.toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedPayroll.status}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HRPayroll

