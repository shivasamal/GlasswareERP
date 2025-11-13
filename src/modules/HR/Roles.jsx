import { useState } from 'react'
import { Edit, Eye } from 'lucide-react'
import { roles } from '../../data/staticData'
import '../../modules/Production/Orders.css'

const HRRoles = () => {
  const [roleList] = useState(roles)
  const [selectedRole, setSelectedRole] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleView = (role) => {
    setSelectedRole(role)
    setShowModal(true)
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Roles & Permissions</h1>
      </div>

      <div className="orders-grid">
        {roleList.map((role) => (
          <div key={role.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>{role.name}</h3>
                <p className="order-meta">Access to {role.modules.length} modules</p>
              </div>
            </div>

            <div className="order-details">
              <div className="detail-item">
                <strong>Modules:</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {role.modules.map((module, idx) => (
                  <span key={idx} style={{
                    padding: '4px 12px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}>
                    {module}
                  </span>
                ))}
              </div>
            </div>

            <div className="order-actions">
              <button className="btn-secondary" onClick={() => handleView(role)}>
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedRole && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Role Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>{selectedRole.name}</h3>
                <p><strong>Total Modules:</strong> {selectedRole.modules.length}</p>
                <div style={{ marginTop: '16px' }}>
                  <strong>Module Access:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {selectedRole.modules.map((module, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{module}</li>
                    ))}
                  </ul>
                </div>
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

export default HRRoles

