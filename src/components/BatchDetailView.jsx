import { useState } from 'react'
import { Clock, CheckCircle, Circle, Package, Settings, FileText, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './BatchDetailView.css'

const BatchDetailView = ({ batch, order, onUpdate }) => {
  const { user } = useAuth()
  const [newNote, setNewNote] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)

  // Production phases
  const phases = [
    { id: 'material_prep', name: 'Material Preparation', icon: Package, description: 'Gathering components and raw materials' },
    { id: 'manufacturing', name: 'Manufacturing', icon: Settings, description: 'Production and assembly process' },
    { id: 'quality_control', name: 'Quality Control', icon: CheckCircle, description: 'Inspection and testing' },
    { id: 'packaging', name: 'Packaging', icon: Package, description: 'Final packaging and labeling' },
    { id: 'completed', name: 'Completed', icon: CheckCircle, description: 'Ready for shipment' }
  ]

  // Initialize batch tracking data if not exists
  const [batchTracking, setBatchTracking] = useState(() => {
    if (batch.tracking) return batch.tracking
    
    // Determine current phase based on status
    let currentPhase = 'material_prep'
    if (batch.status === 'completed') {
      currentPhase = 'completed'
    } else if (batch.status === 'in_progress') {
      currentPhase = 'manufacturing'
    }
    
    // Create default tracking structure
    const defaultPhases = phases.map(phase => {
      let phaseStatus = 'pending'
      let startDate = null
      let completionDate = null
      
      if (phase.id === 'material_prep') {
        phaseStatus = 'completed'
        startDate = batch.startDate
      } else if (phase.id === 'manufacturing' && batch.status === 'in_progress') {
        phaseStatus = 'in_progress'
        startDate = batch.startDate
      } else if (phase.id === 'completed' && batch.status === 'completed') {
        phaseStatus = 'completed'
        startDate = batch.startDate
        completionDate = batch.completionDate
      }
      
      return {
        id: phase.id,
        status: phaseStatus,
        startDate,
        completionDate,
        notes: [],
        operator: null,
        issues: []
      }
    })
    
    return {
      currentPhase,
      phases: defaultPhases,
      notes: batch.notes || [],
      progress: batch.status === 'completed' ? 100 : batch.status === 'in_progress' ? 45 : 10
    }
  })

  const getPhaseStatus = (phaseId) => {
    const phase = batchTracking.phases.find(p => p.id === phaseId)
    return phase?.status || 'pending'
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    
    const note = {
      id: Date.now(),
      text: newNote,
      author: user?.name || 'System',
      timestamp: new Date().toISOString(),
      type: 'general'
    }
    
    const updatedTracking = {
      ...batchTracking,
      notes: [...batchTracking.notes, note]
    }
    
    setBatchTracking(updatedTracking)
    setNewNote('')
    setShowAddNote(false)
    
    if (onUpdate) {
      onUpdate({ ...batch, tracking: updatedTracking })
    }
  }

  const handlePhaseUpdate = (phaseId, status) => {
    const updatedPhases = batchTracking.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          status,
          startDate: status === 'in_progress' && !phase.startDate ? new Date().toISOString().split('T')[0] : phase.startDate,
          completionDate: status === 'completed' ? new Date().toISOString().split('T')[0] : phase.completionDate
        }
      }
      return phase
    })

    // Calculate progress
    const completedPhases = updatedPhases.filter(p => p.status === 'completed').length
    const progress = (completedPhases / phases.length) * 100

    // Update current phase
    let currentPhase = batchTracking.currentPhase
    if (status === 'completed') {
      const currentIndex = phases.findIndex(p => p.id === phaseId)
      if (currentIndex < phases.length - 1) {
        currentPhase = phases[currentIndex + 1].id
        // Auto-start next phase
        const nextPhase = updatedPhases.find(p => p.id === currentPhase)
        if (nextPhase && nextPhase.status === 'pending') {
          updatedPhases.forEach(p => {
            if (p.id === currentPhase) {
              p.status = 'in_progress'
              p.startDate = new Date().toISOString().split('T')[0]
            }
          })
        }
      }
    }

    const updatedTracking = {
      ...batchTracking,
      phases: updatedPhases,
      currentPhase,
      progress
    }

    setBatchTracking(updatedTracking)
    
    if (onUpdate) {
      onUpdate({ ...batch, tracking: updatedTracking })
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="batch-detail-view">
      {/* Header */}
      <div className="batch-header">
        <div>
          <h2>{batch.batchId}</h2>
          <p className="batch-subtitle">{order?.productName || batch.productName}</p>
        </div>
        <div className="batch-progress-circle">
          <div className="progress-ring">
            <svg width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#2563eb"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - batchTracking.progress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="progress-text">
              <span>{Math.round(batchTracking.progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Phases Timeline */}
      <div className="phases-section">
        <h3>Production Phases</h3>
        <div className="phases-timeline">
          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon
            const phaseStatus = getPhaseStatus(phase.id)
            const phaseData = batchTracking.phases.find(p => p.id === phase.id)
            const isCurrent = batchTracking.currentPhase === phase.id
            const isCompleted = phaseStatus === 'completed'
            const isInProgress = phaseStatus === 'in_progress'
            const isPending = phaseStatus === 'pending'

            return (
              <div key={phase.id} className={`phase-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`}>
                <div className="phase-connector">
                  {index > 0 && <div className={`connector-line ${getPhaseStatus(phases[index - 1].id) === 'completed' ? 'completed' : ''}`} />}
                </div>
                <div className="phase-icon-wrapper">
                  <div className={`phase-icon ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'pending'}`}>
                    {isCompleted ? (
                      <CheckCircle size={24} />
                    ) : isInProgress ? (
                      <Clock size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </div>
                </div>
                <div className="phase-content">
                  <div className="phase-header">
                    <h4>{phase.name}</h4>
                    {isCurrent && <span className="current-badge">Current</span>}
                  </div>
                  <p className="phase-description">{phase.description}</p>
                  <div className="phase-dates">
                    {phaseData?.startDate && (
                      <span className="date-info">
                        <Clock size={12} /> Started: {formatDate(phaseData.startDate)}
                      </span>
                    )}
                    {phaseData?.completionDate && (
                      <span className="date-info">
                        <CheckCircle size={12} /> Completed: {formatDate(phaseData.completionDate)}
                      </span>
                    )}
                  </div>
                  {phaseData?.operator && (
                    <p className="phase-operator">Operator: {phaseData.operator}</p>
                  )}
                  {phaseData?.notes && phaseData.notes.length > 0 && (
                    <div className="phase-notes-preview">
                      {phaseData.notes.slice(0, 2).map((note, idx) => (
                        <p key={idx} className="note-preview">{note}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Batch Information */}
      <div className="batch-info-grid">
        <div className="info-card">
          <h4>Order Information</h4>
          <p><strong>Order Number:</strong> {batch.orderNumber}</p>
          <p><strong>Product:</strong> {order?.productName || batch.productName}</p>
          <p><strong>Quantity:</strong> {batch.quantity} units</p>
          {order?.customization && order.customization !== 'None' && (
            <p><strong>Customization:</strong> {order.customization}</p>
          )}
        </div>
        <div className="info-card">
          <h4>Timeline</h4>
          <p><strong>Start Date:</strong> {formatDate(batch.startDate)}</p>
          <p><strong>Expected Completion:</strong> {formatDate(order?.deliveryDate)}</p>
          <p><strong>Actual Completion:</strong> {formatDate(batch.completionDate)}</p>
          <p><strong>Status:</strong> <span className={`status-text ${batch.status}`}>{batch.status.replace('_', ' ').toUpperCase()}</span></p>
        </div>
        {order?.requiredComponents && order.requiredComponents.length > 0 && (
          <div className="info-card">
            <h4>Required Components</h4>
            <ul className="component-list">
              {order.requiredComponents.map((comp, idx) => (
                <li key={idx}>
                  {comp.componentName} ({comp.componentCode}) - Qty: {comp.quantity}
                  <span className={`component-status ${comp.status}`}>{comp.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="notes-section">
        <div className="notes-header">
          <h3>
            <FileText size={20} />
            Batch Notes
          </h3>
          <button className="btn-primary btn-small" onClick={() => setShowAddNote(!showAddNote)}>
            <Plus size={16} />
            Add Note
          </button>
        </div>

        {showAddNote && (
          <div className="add-note-form">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this batch..."
              rows="3"
            />
            <div className="note-actions">
              <button className="btn-secondary btn-small" onClick={() => {
                setShowAddNote(false)
                setNewNote('')
              }}>
                Cancel
              </button>
              <button className="btn-primary btn-small" onClick={handleAddNote}>
                Add Note
              </button>
            </div>
          </div>
        )}

        <div className="notes-list">
          {batchTracking.notes && batchTracking.notes.length > 0 ? (
            batchTracking.notes.map((note) => (
              <div key={note.id} className="note-item">
                <div className="note-header">
                  <span className="note-author">{note.author}</span>
                  <span className="note-time">{formatTime(note.timestamp)}</span>
                </div>
                <p className="note-text">{note.text}</p>
              </div>
            ))
          ) : (
            <p className="no-notes">No notes added yet. Click "Add Note" to add one.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BatchDetailView

