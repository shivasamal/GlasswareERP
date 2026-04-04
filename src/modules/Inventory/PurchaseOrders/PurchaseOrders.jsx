import { useState, useEffect, useRef } from 'react'
import { Package, Eye, CheckCircle, XCircle, Upload, FileText, Search, Plus, AlertTriangle, Download, Bell, X, Camera } from 'lucide-react'
import { getPurchaseOrders, getSuppliers, getRawMaterials } from '../../../data/inventoryData'
import { useAuth } from '../../../contexts/AuthContext'
import './PurchaseOrders.css'

const PurchaseOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState(getPurchaseOrders())
  const [suppliers] = useState(getSuppliers())
  const [rawMaterials, setRawMaterials] = useState(getRawMaterials())
  const [showModal, setShowModal] = useState(false)
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [showExcessModal, setShowExcessModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [excessItemsToAdd, setExcessItemsToAdd] = useState([])
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    items: [{ productId: '', quantity: '', unitPrice: '' }],
    notes: '',
    orderFile: null,
    invoiceFile: null
  })

  const [inspectionData, setInspectionData] = useState({
    inspectionStatus: 'pending',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectedBy: user?.name || '',
    damages: [],
    notes: ''
  })

  const handleFileUpload = (type, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, [type]: { name: file.name, data: e.target.result } })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const supplier = suppliers.find(s => s.id === parseInt(formData.supplierId))
    const totalAmount = formData.items.reduce((sum, item) => {
      return sum + (parseInt(item.quantity) * parseFloat(item.unitPrice))
    }, 0)

    const newOrder = {
      id: orders.length + 1,
      orderNumber: `PO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      supplierId: parseInt(formData.supplierId),
      supplierName: supplier?.name || '',
      date: formData.date,
      items: formData.items.map(item => ({
        productId: item.productId,
        productName: rawMaterials.find(p => p.productId === item.productId)?.name || item.productId,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        total: parseInt(item.quantity) * parseFloat(item.unitPrice),
        receivedQuantity: 0,
        damagedQuantity: 0,
        excessQuantity: 0
      })),
      totalAmount,
      status: 'pending',
      expectedDelivery: formData.expectedDelivery,
      orderFile: formData.orderFile,
      invoiceFile: null,
      notes: formData.notes,
      damages: []
    }

    setOrders([newOrder, ...orders])
    setShowModal(false)
    setFormData({
      supplierId: '',
      date: new Date().toISOString().split('T')[0],
      expectedDelivery: '',
      items: [{ productId: '', quantity: '', unitPrice: '' }],
      notes: '',
      orderFile: null,
      invoiceFile: null
    })
  }

  const handleInspection = (order) => {
    setSelectedOrder(order)
    setInspectionData({
      inspectionStatus: order.inspectionStatus || 'pending',
      inspectionDate: order.inspectionDate || new Date().toISOString().split('T')[0],
      inspectedBy: order.inspectedBy || user?.name || '',
      damages: order.damages || [],
      notes: order.notes || ''
    })
    setShowInspectionModal(true)
  }

  // API-ready function to update raw materials (can be replaced with API call)
  const updateRawMaterialStock = async (productId, quantityToAdd) => {
    // TODO: Replace with API call when backend is ready
    // const response = await rawMaterialsAPI.updateStock(productId, quantityToAdd)
    // if (response.error) throw new Error(response.error)
    
    // For now, update local state
    setRawMaterials(prev => prev.map(rm => 
      rm.productId === productId 
        ? { ...rm, stock: rm.stock + quantityToAdd }
        : rm
    ))
    return { success: true }
  }

  // API-ready function to add new raw material (can be replaced with API call)
  const addNewRawMaterial = async (materialData) => {
    // TODO: Replace with API call when backend is ready
    // const response = await rawMaterialsAPI.create(materialData)
    // if (response.error) throw new Error(response.error)
    // return response
    
    // For now, update local state
    const newMaterial = {
      id: rawMaterials.length + 1,
      ...materialData,
      status: 'active'
    }
    setRawMaterials(prev => [...prev, newMaterial])
    return { success: true, material: newMaterial }
  }

  const saveInspection = () => {
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedItems = order.items.map((item, idx) => {
          const received = inspectionData[`received_${idx}`] || item.receivedQuantity || 0
          const excess = Math.max(0, received - item.quantity)
          return {
            ...item,
            receivedQuantity: received,
            excessQuantity: excess
          }
        })

        const hasExcess = updatedItems.some(item => item.excessQuantity > 0)
        const isCompleted = inspectionData.inspectionStatus === 'passed'

        return {
          ...order,
          ...inspectionData,
          items: updatedItems,
          receivedDate: inspectionData.inspectionDate,
          receivedBy: user?.name || '',
          status: isCompleted ? 'completed' : 'in_progress',
          excessItemsProcessed: order.excessItemsProcessed || false
        }
      }
      return order
    })
    
    const savedOrder = updatedOrders.find(o => o.id === selectedOrder.id)
    const hasExcess = savedOrder?.items.some(item => item.excessQuantity > 0)
    const isCompleted = savedOrder?.status === 'completed'
    
    // Show notification if order is completed and has excess items
    if (isCompleted && hasExcess && !savedOrder.excessItemsProcessed) {
      const excessItems = savedOrder.items
        .filter(item => item.excessQuantity > 0)
        .map(item => {
          const existingMaterial = rawMaterials.find(rm => rm.productId === item.productId)
          return {
            productId: item.productId,
            productName: item.productName,
            excessQuantity: item.excessQuantity,
            unitPrice: item.unitPrice,
            action: existingMaterial ? 'add_existing' : 'add_new',
            selectedProductId: existingMaterial ? item.productId : null,
            newProductId: existingMaterial ? '' : item.productId,
            newProductName: existingMaterial ? '' : item.productName,
            newCategory: 'Raw Material',
            newUnit: 'pcs',
            newMinStock: 10,
            newLocation: 'Shelf A',
            newDescription: ''
          }
        })
      
      setExcessItemsToAdd(excessItems)
      setSelectedOrder(savedOrder)
      setNotifications([{
        id: Date.now(),
        type: 'excess',
        message: `Order ${savedOrder.orderNumber} has excess items. Add them to inventory?`,
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber
      }])
      setShowExcessModal(true)
    }
    
    setOrders(updatedOrders)
    setShowInspectionModal(false)
  }

  const handleAddExcessItems = async () => {
    // Process each excess item
    for (const item of excessItemsToAdd) {
      if (item.action === 'add_new') {
        // Add new raw material
        await addNewRawMaterial({
          productId: item.newProductId,
          name: item.newProductName,
          description: item.newDescription || '',
          category: item.newCategory || 'Raw Material',
          stock: item.excessQuantity,
          minStock: item.newMinStock || 10,
          unit: item.newUnit || 'pcs',
          price: item.unitPrice,
          supplierId: selectedOrder.supplierId,
          location: item.newLocation || 'Shelf A'
        })
      } else if (item.action === 'add_existing' && item.selectedProductId) {
        // Add to existing raw material
        await updateRawMaterialStock(item.selectedProductId, item.excessQuantity)
      }
    }

    // Mark order as processed
    setOrders(prev => prev.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, excessItemsProcessed: true }
        : order
    ))

    // Remove notification
    setNotifications(prev => prev.filter(n => n.orderId !== selectedOrder.id))
    setShowExcessModal(false)
    setExcessItemsToAdd([])
    alert('Excess items added to inventory successfully!')
  }

  const generatePurchaseOrderPDF = async (order) => {
    // TODO: Replace with API call when backend is ready for PDF generation
    // const response = await purchaseOrdersAPI.downloadPDF(order.id)
    // if (response) {
    //   const url = window.URL.createObjectURL(response)
    //   const a = document.createElement('a')
    //   a.href = url
    //   a.download = `Purchase_Order_${order.orderNumber}.pdf`
    //   a.click()
    //   return
    // }

    // For now, generate simple text file (can be enhanced with jsPDF library)
    const supplier = suppliers.find(s => s.id === order.supplierId)
    const pdfContent = `
═══════════════════════════════════════════════════════════════
                    PURCHASE ORDER
═══════════════════════════════════════════════════════════════

Order Number: ${order.orderNumber}
Date: ${new Date(order.date).toLocaleDateString('en-IN', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Expected Delivery: ${order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString('en-IN') : 'N/A'}

───────────────────────────────────────────────────────────────
SUPPLIER INFORMATION
───────────────────────────────────────────────────────────────
Name: ${order.supplierName}
${supplier ? `Email: ${supplier.email}` : ''}
${supplier ? `Phone: ${supplier.phone}` : ''}
${supplier ? `Address: ${supplier.address}` : ''}
${supplier?.gst ? `GST: ${supplier.gst}` : ''}

───────────────────────────────────────────────────────────────
ITEMS ORDERED
───────────────────────────────────────────────────────────────
${order.items.map((item, idx) => `
${idx + 1}. ${item.productName}
   Product ID: ${item.productId}
   Ordered Quantity: ${item.quantity} units
   Received Quantity: ${item.receivedQuantity || 0} units
   Excess Quantity: ${item.excessQuantity || 0} units
   Damaged Quantity: ${item.damagedQuantity || 0} units
   Unit Price: ₹${item.unitPrice.toLocaleString()}
   Total: ₹${item.total.toLocaleString()}
`).join('')}

───────────────────────────────────────────────────────────────
ORDER SUMMARY
───────────────────────────────────────────────────────────────
Total Amount: ₹${order.totalAmount.toLocaleString()}
Status: ${order.status.toUpperCase()}
Inspection Status: ${(order.inspectionStatus || 'Pending').toUpperCase()}

${order.receivedDate ? `Received Date: ${new Date(order.receivedDate).toLocaleDateString('en-IN')}` : ''}
${order.receivedBy ? `Received By: ${order.receivedBy}` : ''}
${order.inspectedBy ? `Inspected By: ${order.inspectedBy}` : ''}
${order.inspectionDate ? `Inspection Date: ${new Date(order.inspectionDate).toLocaleDateString('en-IN')}` : ''}

${order.notes ? `
───────────────────────────────────────────────────────────────
NOTES
───────────────────────────────────────────────────────────────
${order.notes}
` : ''}

${order.damages && order.damages.length > 0 ? `
───────────────────────────────────────────────────────────────
DAMAGED ITEMS
───────────────────────────────────────────────────────────────
${order.damages.map((d, idx) => `
${idx + 1}. ${d.productName || d.productId}
   Quantity: ${d.quantity} units
   Reason: ${d.reason || 'Not specified'}
`).join('')}
` : ''}

═══════════════════════════════════════════════════════════════
Generated on: ${new Date().toLocaleString('en-IN')}
═══════════════════════════════════════════════════════════════
    `.trim()

    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Purchase_Order_${order.orderNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addDamage = () => {
    setInspectionData({
      ...inspectionData,
      damages: [...inspectionData.damages, { productId: '', quantity: '', reason: '' }]
    })
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setCameraStream(stream)
      setShowCameraModal(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions or use file upload instead.')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `invoice_${Date.now()}.jpg`, { type: 'image/jpeg' })
          handleInvoiceUpload(file)
        }
      }, 'image/jpeg', 0.9)
    }
    closeCamera()
  }

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCameraModal(false)
  }

  const handleInvoiceUpload = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const updatedOrders = orders.map(order => {
          if (order.id === selectedOrder.id) {
            return {
              ...order,
              invoiceFile: { name: file.name, data: event.target.result }
            }
          }
          return order
        })
        setOrders(updatedOrders)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', label: 'Pending' },
      in_progress: { class: 'badge-info', label: 'In Progress' },
      completed: { class: 'badge-success', label: 'Completed' }
    }
    return badges[status] || badges.pending
  }

  // Check for excess items notifications on mount and when orders change
  useEffect(() => {
    const newNotifications = orders
      .filter(order => 
        order.status === 'completed' && 
        !order.excessItemsProcessed &&
        order.items.some(item => item.excessQuantity > 0)
      )
      .map(order => ({
        id: order.id,
        type: 'excess',
        message: `Order ${order.orderNumber} has excess items. Add them to inventory?`,
        orderId: order.id,
        orderNumber: order.orderNumber
      }))
    
    if (newNotifications.length > 0 && notifications.length === 0) {
      setNotifications(newNotifications)
    }
  }, [orders])

  // Cleanup camera stream when inspection modal closes
  useEffect(() => {
    if (!showInspectionModal && cameraStream) {
      closeCamera()
    }
  }, [showInspectionModal])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  return (
    <div className="purchase-orders">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          {notifications.map(notification => {
            const order = orders.find(o => o.id === notification.orderId)
            const excessItems = order?.items.filter(item => item.excessQuantity > 0) || []
            return (
              <div key={notification.id} className="notification-card">
                <div className="notification-icon">
                  <Bell size={20} color="#f59e0b" />
                </div>
                <div className="notification-content">
                  <strong>{notification.message}</strong>
                  <p>{excessItems.length} item(s) with excess quantities</p>
                </div>
                <div className="notification-actions">
                  <button
                    className="btn-primary small"
                    onClick={() => {
                      setSelectedOrder(order)
                      const itemsToAdd = excessItems.map(item => {
                        const existingMaterial = rawMaterials.find(rm => rm.productId === item.productId)
                        return {
                          productId: item.productId,
                          productName: item.productName,
                          excessQuantity: item.excessQuantity,
                          unitPrice: item.unitPrice,
                          action: existingMaterial ? 'add_existing' : 'add_new',
                          selectedProductId: existingMaterial ? item.productId : null,
                          newProductId: existingMaterial ? '' : item.productId,
                          newProductName: existingMaterial ? '' : item.productName,
                          newCategory: 'Raw Material',
                          newUnit: 'pcs',
                          newMinStock: 10,
                          newLocation: 'Shelf A',
                          newDescription: ''
                        }
                      })
                      setExcessItemsToAdd(itemsToAdd)
                      setShowExcessModal(true)
                    }}
                  >
                    Add to Inventory
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setNotifications(prev => prev.filter(n => n.id !== notification.id))
                      // Mark as dismissed (not processed)
                      setOrders(prev => prev.map(o => 
                        o.id === notification.orderId 
                          ? { ...o, excessItemsDismissed: true }
                          : o
                      ))
                    }}
                    title="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Purchase Orders</h1>
          <p>Manage supplier orders, inspections, and receipts</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Order
        </button>
      </div>

      <div className="filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Inspection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No purchase orders found</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>{order.supplierName}</td>
                  <td>{order.date}</td>
                  <td>
                    <div className="items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <span>{item.productName}</span>
                          <small>Qty: {item.quantity} | Received: {item.receivedQuantity || 0}</small>
                          {item.damagedQuantity > 0 && (
                            <small className="damage-alert">
                              <AlertTriangle size={12} /> {item.damagedQuantity} damaged
                            </small>
                          )}
                          {item.excessQuantity > 0 && (
                            <small className="excess-info">+{item.excessQuantity} excess</small>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>₹{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status).class}`}>
                      {getStatusBadge(order.status).label}
                    </span>
                  </td>
                  <td>
                    {order.inspectionStatus === 'passed' ? (
                      <CheckCircle size={18} color="#10b981" />
                    ) : order.inspectionStatus === 'failed' ? (
                      <XCircle size={18} color="#ef4444" />
                    ) : (
                      <span className="text-muted">Pending</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleInspection(order)}
                        title="Inspect"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => generatePurchaseOrderPDF(order)}
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      {order.orderFile && (
                        <button className="btn-icon" title="View Order File">
                          <FileText size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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

      {/* New Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Purchase Order</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier *</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expected Delivery *</label>
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Items *</label>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="item-form-row">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].productId = e.target.value
                        setFormData({ ...formData, items: newItems })
                      }}
                      required
                    >
                      <option value="">Select Product</option>
                      {rawMaterials.map(product => (
                        <option key={product.productId} value={product.productId}>
                          {product.productId} - {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].quantity = e.target.value
                        setFormData({ ...formData, items: newItems })
                      }}
                      required
                      min="1"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].unitPrice = e.target.value
                        setFormData({ ...formData, items: newItems })
                      }}
                      required
                      min="0"
                      step="0.01"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            items: formData.items.filter((_, i) => i !== idx)
                          })
                        }}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    items: [...formData.items, { productId: '', quantity: '', unitPrice: '' }]
                  })}
                  className="btn-add-item"
                >
                  + Add Item
                </button>
              </div>

              <div className="form-group">
                <label>Upload Order Document</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('orderFile', e.target.files[0])}
                  />
                  <Upload size={18} />
                  <span>PDF, DOC, DOCX, or Image</span>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {showInspectionModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowInspectionModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inspection - {selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setShowInspectionModal(false)}>×</button>
            </div>
            <div className="inspection-content">
              <div className="form-group">
                <label>Inspection Status *</label>
                <select
                  value={inspectionData.inspectionStatus}
                  onChange={(e) => setInspectionData({ ...inspectionData, inspectionStatus: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Inspection Date *</label>
                  <input
                    type="date"
                    value={inspectionData.inspectionDate}
                    onChange={(e) => setInspectionData({ ...inspectionData, inspectionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Inspected By *</label>
                  <input
                    type="text"
                    value={inspectionData.inspectedBy}
                    onChange={(e) => setInspectionData({ ...inspectionData, inspectedBy: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Received Quantities</label>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="received-item">
                    <span>{item.productName}</span>
                    <div className="quantity-inputs">
                      <div>
                        <label>Ordered: {item.quantity}</label>
                        <input
                          type="number"
                          placeholder="Received"
                          value={inspectionData[`received_${idx}`] || item.receivedQuantity || ''}
                          onChange={(e) => {
                            const received = parseInt(e.target.value) || 0
                            const excess = Math.max(0, received - item.quantity)
                            setInspectionData({
                              ...inspectionData,
                              [`received_${idx}`]: received,
                              [`excess_${idx}`]: excess
                            })
                          }}
                          min="0"
                          max={item.quantity * 2}
                        />
                      </div>
                      {(inspectionData[`excess_${idx}`] || 0) > 0 && (
                        <small className="excess-info">+{inspectionData[`excess_${idx}`]} excess</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Damaged Items</label>
                {inspectionData.damages.map((damage, idx) => (
                  <div key={idx} className="damage-item">
                    <select
                      value={damage.productId}
                      onChange={(e) => {
                        const newDamages = [...inspectionData.damages]
                        newDamages[idx].productId = e.target.value
                        setInspectionData({ ...inspectionData, damages: newDamages })
                      }}
                    >
                      <option value="">Select Product</option>
                      {selectedOrder.items.map(item => (
                        <option key={item.productId} value={item.productId}>
                          {item.productName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={damage.quantity}
                      onChange={(e) => {
                        const newDamages = [...inspectionData.damages]
                        newDamages[idx].quantity = e.target.value
                        setInspectionData({ ...inspectionData, damages: newDamages })
                      }}
                      min="1"
                    />
                    <input
                      type="text"
                      placeholder="Reason"
                      value={damage.reason}
                      onChange={(e) => {
                        const newDamages = [...inspectionData.damages]
                        newDamages[idx].reason = e.target.value
                        setInspectionData({ ...inspectionData, damages: newDamages })
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setInspectionData({
                          ...inspectionData,
                          damages: inspectionData.damages.filter((_, i) => i !== idx)
                        })
                      }}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addDamage} className="btn-add-item">
                  + Add Damage
                </button>
              </div>

              <div className="form-group">
                <label>Upload Supplier Invoice</label>
                <div className="upload-options">
                  <button
                    type="button"
                    className="upload-option-btn camera-btn"
                    onClick={openCamera}
                  >
                    <Camera size={20} />
                    <span>Open Camera</span>
                  </button>
                  <button
                    type="button"
                    className="upload-option-btn file-btn"
                    onClick={handleFileUploadClick}
                  >
                    <Upload size={20} />
                    <span>Upload PDF/File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleInvoiceUpload(e.target.files[0])
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
                {selectedOrder?.invoiceFile && (
                  <div className="uploaded-file-info">
                    <FileText size={16} />
                    <span>{selectedOrder.invoiceFile.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Inspection Notes</label>
                <textarea
                  value={inspectionData.notes}
                  onChange={(e) => setInspectionData({ ...inspectionData, notes: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowInspectionModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={saveInspection}>
                  Save Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excess Items Modal */}
      {showExcessModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowExcessModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Excess Items to Inventory</h2>
              <button className="modal-close" onClick={() => setShowExcessModal(false)}>×</button>
            </div>
            <div className="excess-items-content">
              <p className="info-text">
                Order <strong>{selectedOrder.orderNumber}</strong> has excess items. Select how to add them to inventory.
              </p>
              
              {excessItemsToAdd.map((item, idx) => {
                const existingMaterial = rawMaterials.find(rm => rm.productId === item.productId)
                return (
                  <div key={idx} className="excess-item-card">
                    <div className="excess-item-header">
                      <h3>{item.productName}</h3>
                      <span className="excess-badge">+{item.excessQuantity} excess units</span>
                    </div>
                    
                    <div className="form-group">
                      <label>Action *</label>
                      <select
                        value={item.action || 'add_existing'}
                        onChange={(e) => {
                          const updated = [...excessItemsToAdd]
                          updated[idx].action = e.target.value
                          if (e.target.value === 'add_existing') {
                            updated[idx].selectedProductId = item.productId
                          }
                          setExcessItemsToAdd(updated)
                        }}
                      >
                        {existingMaterial ? (
                          <>
                            <option value="add_existing">Add to Existing: {item.productName}</option>
                            <option value="add_new">Add as New Item</option>
                          </>
                        ) : (
                          <option value="add_new">Add as New Item (Not in inventory)</option>
                        )}
                      </select>
                    </div>

                    {item.action === 'add_existing' && (
                      <div className="form-group">
                        <label>Select Product</label>
                        <select
                          value={item.selectedProductId || item.productId}
                          onChange={(e) => {
                            const updated = [...excessItemsToAdd]
                            updated[idx].selectedProductId = e.target.value
                            setExcessItemsToAdd(updated)
                          }}
                        >
                          {rawMaterials.map(rm => (
                            <option key={rm.productId} value={rm.productId}>
                              {rm.productId} - {rm.name} (Current Stock: {rm.stock} {rm.unit})
                            </option>
                          ))}
                        </select>
                        {(() => {
                          const selectedMaterial = rawMaterials.find(rm => rm.productId === (item.selectedProductId || item.productId))
                          return selectedMaterial && (
                            <small className="info-text">
                              Current stock: {selectedMaterial.stock} {selectedMaterial.unit} → Will become: {selectedMaterial.stock + item.excessQuantity} {selectedMaterial.unit}
                            </small>
                          )
                        })()}
                      </div>
                    )}

                    {item.action === 'add_new' && (
                      <div className="new-item-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Product ID *</label>
                            <input
                              type="text"
                              value={item.newProductId || ''}
                              onChange={(e) => {
                                const updated = [...excessItemsToAdd]
                                updated[idx].newProductId = e.target.value
                                setExcessItemsToAdd(updated)
                              }}
                              placeholder="RM-XXX"
                              required={item.action === 'add_new'}
                            />
                          </div>
                          <div className="form-group">
                            <label>Product Name *</label>
                            <input
                              type="text"
                              value={item.newProductName || item.productName}
                              onChange={(e) => {
                                const updated = [...excessItemsToAdd]
                                updated[idx].newProductName = e.target.value
                                setExcessItemsToAdd(updated)
                              }}
                              required={item.action === 'add_new'}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Category *</label>
                            <input
                              type="text"
                              value={item.newCategory || 'Raw Material'}
                              onChange={(e) => {
                                const updated = [...excessItemsToAdd]
                                updated[idx].newCategory = e.target.value
                                setExcessItemsToAdd(updated)
                              }}
                              required={item.action === 'add_new'}
                            />
                          </div>
                          <div className="form-group">
                            <label>Unit *</label>
                            <select
                              value={item.newUnit || 'pcs'}
                              onChange={(e) => {
                                const updated = [...excessItemsToAdd]
                                updated[idx].newUnit = e.target.value
                                setExcessItemsToAdd(updated)
                              }}
                              required={item.action === 'add_new'}
                            >
                              <option value="pcs">Pieces</option>
                              <option value="kg">Kilograms</option>
                              <option value="sqm">Square Meters</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Minimum Stock</label>
                            <input
                              type="number"
                              value={item.newMinStock || 10}
                              onChange={(e) => {
                                const updated = [...excessItemsToAdd]
                                updated[idx].newMinStock = parseInt(e.target.value) || 10
                                setExcessItemsToAdd(updated)
                              }}
                              min="0"
                            />
                          </div>
                          <div className="form-group">
                            <label>Location</label>
                            <input
                              type="text"
                              value={item.newLocation || 'Shelf A'}
                              onChange={(e) => {
                                const updated = [...excessItemsToAdd]
                                updated[idx].newLocation = e.target.value
                                setExcessItemsToAdd(updated)
                              }}
                              placeholder="Shelf A"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            value={item.newDescription || ''}
                            onChange={(e) => {
                              const updated = [...excessItemsToAdd]
                              updated[idx].newDescription = e.target.value
                              setExcessItemsToAdd(updated)
                            }}
                            rows="2"
                            placeholder="Product description..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowExcessModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleAddExcessItems}
                  disabled={excessItemsToAdd.some(item => 
                    (item.action === 'add_new' && (!item.newProductId || !item.newProductName)) ||
                    (item.action === 'add_existing' && !item.selectedProductId)
                  )}
                >
                  Add to Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="modal-overlay" onClick={closeCamera}>
          <div className="modal-content camera-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Capture Invoice Photo</h2>
              <button className="modal-close" onClick={closeCamera}>×</button>
            </div>
            <div className="camera-content">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
              <div className="camera-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeCamera}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrders

