import { useState } from 'react'
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle, Eye, FileText, Package, Plus, Send } from 'lucide-react'
import { getPurchaseReceipts, getPurchaseOrders, getSuppliers } from '../../data/staticData'
import { useAuth } from '../../contexts/AuthContext'
import '../../modules/Production/Orders.css'
import './Inspection.css'

const PurchaseInspection = () => {
  const { user } = useAuth()
  const [receipts, setReceipts] = useState(getPurchaseReceipts())
  const [orders] = useState(getPurchaseOrders())
  const [suppliers] = useState(getSuppliers())
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [inspectionData, setInspectionData] = useState({})
  const [claims, setClaims] = useState([])

  // Filter receipts that need inspection (status is 'complete' but not inspected yet)
  const receiptsNeedingInspection = receipts.filter(r => 
    r.status === 'complete' && !r.inspectionStatus
  )

  // Filter receipts that have been inspected
  const inspectedReceipts = receipts.filter(r => r.inspectionStatus)

  const handleStartInspection = (receipt) => {
    setSelectedReceipt(receipt)
    // Initialize inspection data
    const initialData = {}
    receipt.items.forEach((item, idx) => {
      initialData[idx] = {
        inspectedQuantity: item.receivedQuantity || item.quantity || 0,
        passedQuantity: item.passedQuantity || 0,
        damagedQuantity: item.damagedQuantity || 0,
        wrongItem: item.wrongItem || false,
        wrongQuantity: item.wrongQuantity || false,
        damageDescription: item.damageDescription || '',
        inspectionNotes: item.inspectionNotes || ''
      }
    })
    setInspectionData(initialData)
    setShowInspectionModal(true)
  }

  const handleInspectionChange = (itemIdx, field, value) => {
    setInspectionData(prev => ({
      ...prev,
      [itemIdx]: {
        ...prev[itemIdx],
        [field]: value
      }
    }))
  }

  const handleSubmitInspection = () => {
    if (!selectedReceipt) return

    const updatedItems = selectedReceipt.items.map((item, idx) => {
      const inspection = inspectionData[idx] || {}
      const inspectedQty = parseInt(inspection.inspectedQuantity) || 0
      const passedQty = parseInt(inspection.passedQuantity) || 0
      const damagedQty = parseInt(inspection.damagedQuantity) || 0
      
      let status = 'pending'
      if (inspectedQty > 0) {
        if (damagedQty === 0 && !inspection.wrongItem && !inspection.wrongQuantity) {
          status = 'passed'
        } else if (passedQty > 0 || damagedQty > 0) {
          status = 'partial'
        } else {
          status = 'failed'
        }
      }

      return {
        ...item,
        inspectedQuantity: inspectedQty,
        passedQuantity: passedQty,
        damagedQuantity: damagedQty,
        wrongItem: inspection.wrongItem || false,
        wrongQuantity: inspection.wrongQuantity || false,
        damageDescription: inspection.damageDescription || '',
        inspectionNotes: inspection.inspectionNotes || '',
        inspectionStatus: status
      }
    })

    const overallStatus = updatedItems.every(item => item.inspectionStatus === 'passed') 
      ? 'passed' 
      : updatedItems.some(item => item.damagedQuantity > 0 || item.wrongItem || item.wrongQuantity) 
        ? 'partial' 
        : 'pending'

    const updatedReceipt = {
      ...selectedReceipt,
      items: updatedItems,
      inspectionStatus: overallStatus,
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectedBy: user?.name || 'System',
      status: 'inspected'
    }

    // Create claims for damaged/wrong items
    const newClaims = []
    updatedItems.forEach((item, idx) => {
      if (item.damagedQuantity > 0 || item.wrongItem || item.wrongQuantity) {
        newClaims.push({
          id: Date.now() + idx,
          claimNumber: `CLM-${selectedReceipt.receiptNumber}-${idx + 1}`,
          receiptNumber: selectedReceipt.receiptNumber,
          orderNumber: selectedReceipt.orderNumber,
          supplierId: selectedReceipt.supplierId,
          supplierName: selectedReceipt.supplierName,
          itemCode: item.componentCode || item.packagingCode,
          itemName: item.componentName || item.packagingName,
          orderedQuantity: item.quantity,
          receivedQuantity: item.receivedQuantity || item.quantity,
          damagedQuantity: item.damagedQuantity || 0,
          wrongItem: item.wrongItem || false,
          wrongQuantity: item.wrongQuantity || false,
          damageDescription: item.damageDescription || '',
          inspectionNotes: item.inspectionNotes || '',
          claimDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          replacementRequested: false,
          replacementOrderNumber: null,
          createdBy: user?.name || 'System'
        })
      }
    })

    setReceipts(receipts.map(r => r.id === selectedReceipt.id ? updatedReceipt : r))
    setClaims([...claims, ...newClaims])
    setSelectedReceipt(updatedReceipt)
    setShowInspectionModal(false)
    setInspectionData({})
  }

  const handleCreateReplacementOrder = (claim) => {
    // Create a new purchase order for replacement
    const supplier = suppliers.find(s => s.id === claim.supplierId)
    const replacementOrder = {
      id: Date.now(),
      orderNumber: `PUO-REPL-${Date.now()}`,
      supplierId: claim.supplierId,
      supplierName: claim.supplierName,
      date: new Date().toISOString().split('T')[0],
      items: [{
        componentCode: claim.itemCode,
        componentName: claim.itemName,
        quantity: claim.damagedQuantity || claim.receivedQuantity - (claim.receivedQuantity - claim.damagedQuantity),
        unitPrice: 0, // Will be set based on original order
        total: 0,
        status: 'ordered',
        isReplacement: true,
        originalClaimNumber: claim.claimNumber
      }],
      totalAmount: 0,
      status: 'ordered',
      expectedDelivery: null,
      isReplacement: true,
      originalClaimNumber: claim.claimNumber
    }

    // Update claim status
    const updatedClaims = claims.map(c => 
      c.id === claim.id
        ? { ...c, replacementRequested: true, replacementOrderNumber: replacementOrder.orderNumber, status: 'replacement_ordered' }
        : c
    )
    setClaims(updatedClaims)

    // Show success message (in real app, this would create the order)
    alert(`Replacement order ${replacementOrder.orderNumber} created for ${claim.itemName}. This order should be sent to ${claim.supplierName}.`)
  }

  const handleGenerateReport = (receipt) => {
    setSelectedReceipt(receipt)
    setShowReportModal(true)
  }

  const getInspectionStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return <span className="status-badge" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
          <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
          PASSED
        </span>
      case 'partial':
        return <span className="status-badge" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
          <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
          PARTIAL
        </span>
      case 'failed':
        return <span className="status-badge" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
          <XCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
          FAILED
        </span>
      default:
        return <span className="status-badge" style={{ backgroundColor: '#6b728020', color: '#6b7280' }}>
          PENDING
        </span>
    }
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Purchase Inspection</h1>
        <p className="page-subtitle">Inspect received items for quality, damage, and correctness</p>
      </div>

      {/* Receipts Needing Inspection */}
      {receiptsNeedingInspection.length > 0 && (
        <div className="inspection-section">
          <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
            <AlertTriangle size={20} style={{ display: 'inline', marginRight: '8px', color: '#f59e0b' }} />
            Receipts Pending Inspection ({receiptsNeedingInspection.length})
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Receipt Number</th>
                  <th>Order Number</th>
                  <th>Supplier</th>
                  <th>Received Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {receiptsNeedingInspection.map((receipt) => (
                  <tr key={receipt.id}>
                    <td><strong style={{ color: '#2563eb' }}>{receipt.receiptNumber}</strong></td>
                    <td>{receipt.orderNumber}</td>
                    <td>{receipt.supplierName}</td>
                    <td>{receipt.receivedDate || receipt.date}</td>
                    <td>{receipt.items?.length || 0} item(s)</td>
                    <td>₹{receipt.totalAmount.toLocaleString()}</td>
                    <td>
                      <button className="btn-primary btn-small" onClick={() => handleStartInspection(receipt)}>
                        <ClipboardCheck size={16} style={{ marginRight: '4px' }} />
                        Start Inspection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspected Receipts */}
      <div className="inspection-section" style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
          <CheckCircle size={20} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
          Inspected Receipts ({inspectedReceipts.length})
        </h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt Number</th>
                <th>Order Number</th>
                <th>Supplier</th>
                <th>Inspection Date</th>
                <th>Inspected By</th>
                <th>Inspection Status</th>
                <th>Issues Found</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspectedReceipts.length > 0 ? (
                inspectedReceipts.map((receipt) => {
                  const hasIssues = receipt.items?.some(item => 
                    item.damagedQuantity > 0 || item.wrongItem || item.wrongQuantity
                  )
                  const issueCount = receipt.items?.filter(item => 
                    item.damagedQuantity > 0 || item.wrongItem || item.wrongQuantity
                  ).length || 0

                  return (
                    <tr key={receipt.id}>
                      <td><strong style={{ color: '#2563eb' }}>{receipt.receiptNumber}</strong></td>
                      <td>{receipt.orderNumber}</td>
                      <td>{receipt.supplierName}</td>
                      <td>{receipt.inspectionDate || 'N/A'}</td>
                      <td>{receipt.inspectedBy || 'N/A'}</td>
                      <td>{getInspectionStatusBadge(receipt.inspectionStatus)}</td>
                      <td>
                        {hasIssues ? (
                          <span style={{ color: '#ef4444', fontWeight: '600' }}>
                            {issueCount} issue(s)
                          </span>
                        ) : (
                          <span style={{ color: '#10b981' }}>No issues</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" onClick={() => handleGenerateReport(receipt)} title="View Report">
                            <FileText size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No receipts have been inspected yet. Start inspection for receipts pending inspection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Damage Claims */}
      {claims.length > 0 && (
        <div className="inspection-section" style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
            <AlertTriangle size={20} style={{ display: 'inline', marginRight: '8px', color: '#ef4444' }} />
            Damage Claims ({claims.length})
          </h2>
          <div className="claims-grid">
            {claims.map((claim) => (
              <div key={claim.id} className="claim-card">
                <div className="claim-header">
                  <div>
                    <h3>{claim.claimNumber}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Receipt: {claim.receiptNumber} | Order: {claim.orderNumber}
                    </p>
                  </div>
                  <span className="status-badge" style={{
                    backgroundColor: claim.status === 'resolved' ? '#10b98120' : '#f59e0b20',
                    color: claim.status === 'resolved' ? '#10b981' : '#f59e0b'
                  }}>
                    {claim.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <div className="claim-details">
                  <p><strong>Supplier:</strong> {claim.supplierName}</p>
                  <p><strong>Item:</strong> {claim.itemName} ({claim.itemCode})</p>
                  <p><strong>Ordered:</strong> {claim.orderedQuantity} | <strong>Received:</strong> {claim.receivedQuantity}</p>
                  {claim.damagedQuantity > 0 && (
                    <p><strong>Damaged Quantity:</strong> <span style={{ color: '#ef4444', fontWeight: '600' }}>{claim.damagedQuantity} units</span></p>
                  )}
                  {claim.wrongItem && (
                    <p><strong>Issue:</strong> <span style={{ color: '#ef4444' }}>Wrong item received</span></p>
                  )}
                  {claim.wrongQuantity && (
                    <p><strong>Issue:</strong> <span style={{ color: '#ef4444' }}>Wrong quantity received</span></p>
                  )}
                  {claim.damageDescription && (
                    <p><strong>Damage Description:</strong> {claim.damageDescription}</p>
                  )}
                  {claim.replacementOrderNumber && (
                    <p><strong>Replacement Order:</strong> {claim.replacementOrderNumber}</p>
                  )}
                </div>
                <div className="claim-actions">
                  {!claim.replacementRequested && (
                    <button className="btn-primary btn-small" onClick={() => handleCreateReplacementOrder(claim)}>
                      <Send size={14} style={{ marginRight: '4px' }} />
                      Request Replacement
                    </button>
                  )}
                  {claim.replacementRequested && (
                    <span style={{ color: '#10b981', fontSize: '12px' }}>Replacement requested</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {showInspectionModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowInspectionModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Inspect Received Items</h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
              <strong>Receipt:</strong> {selectedReceipt.receiptNumber} | <strong>Supplier:</strong> {selectedReceipt.supplierName}
            </p>
            <p style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', fontSize: '14px' }}>
              <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px', color: '#f59e0b' }} />
              Check each item carefully. Mark quantities as passed or damaged. Report wrong items or quantities.
            </p>
            <div className="order-detail-view" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {selectedReceipt.items.map((item, idx) => {
                const inspection = inspectionData[idx] || {}
                return (
                  <div key={idx} className="detail-section inspection-item-section">
                    <h3>
                      <Package size={18} style={{ marginRight: '8px', display: 'inline' }} />
                      {item.componentName || item.packagingName} ({item.componentCode || item.packagingCode})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div className="form-group">
                        <label>Ordered Quantity</label>
                        <input type="number" value={item.quantity} disabled style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                      </div>
                      <div className="form-group">
                        <label>Received Quantity</label>
                        <input type="number" value={item.receivedQuantity || item.quantity} disabled style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                      </div>
                      <div className="form-group">
                        <label>Inspected Quantity *</label>
                        <input 
                          type="number" 
                          value={inspection.inspectedQuantity || ''} 
                          onChange={(e) => handleInspectionChange(idx, 'inspectedQuantity', e.target.value)}
                          max={item.receivedQuantity || item.quantity}
                          min={0}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div className="form-group">
                        <label>Passed Quantity *</label>
                        <input 
                          type="number" 
                          value={inspection.passedQuantity || ''} 
                          onChange={(e) => handleInspectionChange(idx, 'passedQuantity', e.target.value)}
                          max={inspection.inspectedQuantity || item.receivedQuantity || item.quantity}
                          min={0}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Damaged Quantity *</label>
                        <input 
                          type="number" 
                          value={inspection.damagedQuantity || ''} 
                          onChange={(e) => {
                            const damaged = parseInt(e.target.value) || 0
                            const inspected = parseInt(inspection.inspectedQuantity) || 0
                            const passed = inspected - damaged
                            handleInspectionChange(idx, 'damagedQuantity', damaged)
                            handleInspectionChange(idx, 'passedQuantity', passed >= 0 ? passed : 0)
                          }}
                          max={inspection.inspectedQuantity || item.receivedQuantity || item.quantity}
                          min={0}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="checkbox" 
                            checked={inspection.wrongItem || false}
                            onChange={(e) => handleInspectionChange(idx, 'wrongItem', e.target.checked)}
                          />
                          Wrong Item Received
                        </label>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="checkbox" 
                            checked={inspection.wrongQuantity || false}
                            onChange={(e) => handleInspectionChange(idx, 'wrongQuantity', e.target.checked)}
                          />
                          Wrong Quantity Received
                        </label>
                      </div>
                    </div>
                    {(parseInt(inspection.damagedQuantity) > 0 || inspection.wrongItem || inspection.wrongQuantity) && (
                      <div className="form-group">
                        <label>Issue Description *</label>
                        <textarea
                          value={inspection.damageDescription || ''}
                          onChange={(e) => handleInspectionChange(idx, 'damageDescription', e.target.value)}
                          rows="3"
                          placeholder="Describe the damage, wrong item, or quantity issue..."
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Inspection Notes</label>
                      <textarea
                        value={inspection.inspectionNotes || ''}
                        onChange={(e) => handleInspectionChange(idx, 'inspectionNotes', e.target.value)}
                        rows="2"
                        placeholder="Additional notes about this item..."
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => {
                setShowInspectionModal(false)
                setInspectionData({})
              }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSubmitInspection}>
                <ClipboardCheck size={16} style={{ marginRight: '8px' }} />
                Submit Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Report Modal */}
      {showReportModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Inspection Report</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <h3>Receipt Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <p><strong>Receipt Number:</strong> {selectedReceipt.receiptNumber}</p>
                  <p><strong>Order Number:</strong> {selectedReceipt.orderNumber}</p>
                  <p><strong>Supplier:</strong> {selectedReceipt.supplierName}</p>
                  <p><strong>Inspection Date:</strong> {selectedReceipt.inspectionDate}</p>
                  <p><strong>Inspected By:</strong> {selectedReceipt.inspectedBy}</p>
                  <p><strong>Status:</strong> {getInspectionStatusBadge(selectedReceipt.inspectionStatus)}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Inspection Results</h3>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Ordered</th>
                      <th>Received</th>
                      <th>Inspected</th>
                      <th>Passed</th>
                      <th>Damaged</th>
                      <th>Status</th>
                      <th>Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.componentName || item.packagingName}</td>
                        <td>{item.quantity}</td>
                        <td>{item.receivedQuantity || item.quantity}</td>
                        <td>{item.inspectedQuantity || 0}</td>
                        <td style={{ color: '#10b981', fontWeight: '600' }}>{item.passedQuantity || 0}</td>
                        <td style={{ color: item.damagedQuantity > 0 ? '#ef4444' : 'inherit', fontWeight: '600' }}>
                          {item.damagedQuantity || 0}
                        </td>
                        <td>
                          {item.inspectionStatus === 'passed' ? (
                            <span style={{ color: '#10b981', fontSize: '12px' }}>✓ Passed</span>
                          ) : item.inspectionStatus === 'partial' ? (
                            <span style={{ color: '#f59e0b', fontSize: '12px' }}>⚠ Partial</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontSize: '12px' }}>✗ Failed</span>
                          )}
                        </td>
                        <td>
                          {item.damagedQuantity > 0 && <span style={{ color: '#ef4444', fontSize: '11px' }}>Damaged</span>}
                          {item.wrongItem && <span style={{ color: '#ef4444', fontSize: '11px', marginLeft: '4px' }}>Wrong Item</span>}
                          {item.wrongQuantity && <span style={{ color: '#ef4444', fontSize: '11px', marginLeft: '4px' }}>Wrong Qty</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedReceipt.items?.some(item => item.damageDescription || item.inspectionNotes) && (
                <div className="detail-section">
                  <h3>Issue Details</h3>
                  {selectedReceipt.items.map((item, idx) => (
                    (item.damageDescription || item.inspectionNotes) && (
                      <div key={idx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                        <p><strong>{item.componentName || item.packagingName}:</strong></p>
                        {item.damageDescription && <p style={{ color: '#ef4444' }}>Issue: {item.damageDescription}</p>}
                        {item.inspectionNotes && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Notes: {item.inspectionNotes}</p>}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowReportModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => window.print()}>
                <FileText size={16} style={{ marginRight: '8px' }} />
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseInspection

