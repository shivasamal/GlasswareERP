import { useState } from 'react'
import { Plus, Edit, Calendar } from 'lucide-react'
import { getEmployees } from '../../data/staticData'
import '../../modules/Inventory/Products.css'

const HRAttendance = () => {
  const employees = getEmployees()
  const [attendance, setAttendance] = useState([
    { id: 1, employeeId: 1, employeeName: 'Rajesh Kumar', date: '2024-01-20', status: 'present', checkIn: '09:00', checkOut: '18:00' },
    { id: 2, employeeId: 2, employeeName: 'Priya Sharma', date: '2024-01-20', status: 'present', checkIn: '09:15', checkOut: '18:30' },
    { id: 3, employeeId: 3, employeeName: 'Amit Patel', date: '2024-01-20', status: 'absent', checkIn: '-', checkOut: '-' }
  ])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkIn: '',
    checkOut: ''
  })

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      checkIn: '',
      checkOut: ''
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const employee = employees.find(e => e.id === parseInt(formData.employeeId))
    const newRecord = {
      id: attendance.length + 1,
      employeeId: parseInt(formData.employeeId),
      employeeName: employee?.name || '',
      date: formData.date,
      status: formData.status,
      checkIn: formData.status === 'present' ? formData.checkIn : '-',
      checkOut: formData.status === 'present' ? formData.checkOut : '-'
    }
    setAttendance([...attendance, newRecord])
    setShowModal(false)
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Attendance</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Record
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeName}</td>
                <td>{record.date}</td>
                <td>
                  <span className={`status-badge ${record.status === 'present' ? 'active' : 'inactive'}`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Attendance Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>
              </div>
              {formData.status === 'present' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Check In</label>
                    <input
                      type="time"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check Out</label>
                    <input
                      type="time"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HRAttendance

