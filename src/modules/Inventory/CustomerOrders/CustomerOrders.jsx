import { useState } from 'react'
import { Eye, Edit, Trash2, Plus, Search, FileText, Upload, Download, Package, AlertCircle, Truck, CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react'
import { 
  getCustomerOrders, getCustomers, getFinishedGoods, getRawMaterials,
  checkComponentAvailability, updateFinishedGoodsStock, updateRawMaterialStock,
  addFinishedGood, addRawMaterial
} from '../../../data/inventoryData'
import { useAuth } from '../../../contexts/AuthContext'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './CustomerOrders.css'

const CustomerOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState(getCustomerOrders())
  const [customers] = useState(getCustomers())
  const [finishedGoods, setFinishedGoods] = useState(getFinishedGoods())
  const [rawMaterials, setRawMaterials] = useState(getRawMaterials())
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReplacementModal, setShowReplacementModal] = useState(false)
  const [showExcessModal, setShowExcessModal] = useState(false)
  const [excessItemsData, setExcessItemsData] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    items: [{ productId: '', quantity: '', unitPrice: '', producedQuantity: '' }],
    notes: '',
    orderFile: null,
    invoiceFile: null,
    deliveryChallanFile: null
  })

  const [deliveryData, setDeliveryData] = useState({
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveredBy: user?.name || '',
    items: []
  })

  const [cancelData, setCancelData] = useState({
    items: []
  })

  const [replacementData, setReplacementData] = useState({
    items: []
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
    const customer = customers.find(c => c.id === parseInt(formData.customerId))
    const totalAmount = formData.items.reduce((sum, item) => {
      return sum + (parseInt(item.quantity) * parseFloat(item.unitPrice))
    }, 0)

    // Check component availability for each item
    const componentsCheck = formData.items.map(item => {
      const check = checkComponentAvailability(item.productId, parseInt(item.quantity))
      return { productId: item.productId, ...check }
    })

    const allAvailable = componentsCheck.every(check => check.available)

    const newOrder = {
      id: orders.length + 1,
      orderNumber: `CO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: parseInt(formData.customerId),
      customerName: customer?.name || '',
      date: formData.date,
      items: formData.items.map(item => ({
        productId: item.productId,
        productName: finishedGoods.find(p => p.productId === item.productId)?.name || item.productId,
        quantity: parseInt(item.quantity),
        producedQuantity: parseInt(item.producedQuantity) || parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        total: parseInt(item.quantity) * parseFloat(item.unitPrice),
        deliveredQuantity: 0,
        goodQuantity: 0,
        damagedQuantity: 0,
        excessQuantity: Math.max(0, (parseInt(item.producedQuantity) || parseInt(item.quantity)) - parseInt(item.quantity))
      })),
      totalAmount,
      status: allAvailable ? 'in_production' : 'pending',
      deliveryDate: formData.deliveryDate,
      invoiceNumber: `INV-2024-${String(orders.length + 1).padStart(3, '0')}`,
      invoiceDate: formData.date,
      orderFile: formData.orderFile,
      invoiceFile: formData.invoiceFile,
      deliveryChallanFile: formData.deliveryChallanFile,
      notes: formData.notes,
      productionStatus: allAvailable ? 'ready' : 'pending',
      componentsCheck: { available: allAvailable, missingItems: componentsCheck.flatMap(c => c.missingItems) },
      damages: [],
      replacementOrderId: null,
      cancelledAt: null,
      cancelledBy: null
    }

    setOrders([newOrder, ...orders])
    setShowModal(false)
    setFormData({
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      items: [{ productId: '', quantity: '', unitPrice: '', producedQuantity: '' }],
      notes: '',
      orderFile: null,
      invoiceFile: null,
      deliveryChallanFile: null
    })
  }

  const handleEdit = (order) => {
    if (order.status === 'in_transit' || order.status === 'delivered' || order.status === 'cancelled') {
      alert('Cannot edit order in transit, delivered, or cancelled status')
      return
    }
    setSelectedOrder(order)
    setFormData({
      customerId: order.customerId.toString(),
      date: order.date,
      deliveryDate: order.deliveryDate,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        producedQuantity: (item.producedQuantity || item.quantity).toString()
      })),
      notes: order.notes,
      orderFile: order.orderFile,
      invoiceFile: order.invoiceFile,
      deliveryChallanFile: order.deliveryChallanFile
    })
    setShowModal(true)
  }

  const handleDelete = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (order && (order.status === 'in_transit' || order.status === 'delivered' || order.status === 'cancelled')) {
      alert('Cannot delete order in transit, delivered, or cancelled status')
      return
    }
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o.id !== orderId))
    }
  }

  const handleStatusChange = (order, newStatus) => {
    setSelectedOrder(order)
    if (newStatus === 'in_transit') {
      // Initialize delivery data with existing values if available
      setDeliveryData({
        deliveryDate: new Date().toISOString().split('T')[0],
        deliveredBy: user?.name || '',
        items: order.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          orderedQuantity: item.quantity,
          producedQuantity: item.producedQuantity || item.quantity,
          excessQuantity: item.excessQuantity || 0,
          deliveredQuantity: item.deliveredQuantity || 0,
          goodQuantity: item.goodQuantity || 0,
          damagedQuantity: item.damagedQuantity || 0
        }))
      })
      setShowDeliveryModal(true)
    } else {
      setShowStatusModal(true)
    }
  }

  const saveStatusChange = (newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedOrder = { ...order, status: newStatus }
        // If changing to 'ready', ensure items have producedQuantity
        if (newStatus === 'ready') {
          updatedOrder.items = order.items.map(item => ({
            ...item,
            producedQuantity: item.producedQuantity || item.quantity,
            excessQuantity: item.excessQuantity || Math.max(0, (item.producedQuantity || item.quantity) - item.quantity)
          }))
        }
        return updatedOrder
      }
      return order
    })
    setOrders(updatedOrders)
    setShowStatusModal(false)
    setSelectedOrder(null)
  }

  const saveDelivery = () => {
    let updatedItems = []
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        updatedItems = order.items.map((item, idx) => {
          const deliveryItem = deliveryData.items[idx]
          const goodQty = parseInt(deliveryItem.goodQuantity) || 0
          const damagedQty = parseInt(deliveryItem.damagedQuantity) || 0
          const deliveredQty = goodQty + damagedQty
          const producedQty = item.producedQuantity || item.quantity
          
          // Calculate excess: Produced - Good (items delivered to customer)
          // Excess items are the ones that were produced but not delivered (in good shape, can be reused)
          // Example: Ordered 25, Produced 30, Good 25 → Excess = 30 - 25 = 5
          const excessQty = Math.max(0, producedQty - goodQty)
          
          return {
            ...item,
            deliveredQuantity: deliveredQty,
            goodQuantity: goodQty,
            damagedQuantity: damagedQty,
            excessQuantity: excessQty
          }
        })

        const allDelivered = updatedItems.every(item => 
          item.deliveredQuantity >= item.quantity
        )

        return {
          ...order,
          items: updatedItems,
          status: allDelivered ? 'delivered' : 'in_transit',
          deliveryDate: deliveryData.deliveryDate,
          deliveredBy: deliveryData.deliveredBy
        }
      }
      return order
    })
    setOrders(updatedOrders)
    
    // Calculate excess items to add to raw materials
    // Excess = Produced - Good (items delivered to customer)
    // These excess items are in good shape and can be reused
    // Note: Damaged items are handled separately by the user
    const excessItemsToAdd = updatedItems.map((item) => {
      const producedQty = item.producedQuantity || item.quantity
      const goodQty = item.goodQuantity || 0
      // Excess = All items produced but not delivered as "good"
      const excessQty = Math.max(0, producedQty - goodQty)
      
      return {
        productId: item.productId,
        productName: item.productName,
        excessQuantity: excessQty
      }
    }).filter(item => item.excessQuantity > 0)
    
    // Show excess items modal if there are excess items
    // Damaged items are tracked but user handles them separately
    if (excessItemsToAdd.length > 0) {
      const excessItemsForModal = excessItemsToAdd.map(item => {
        const existingMaterial = rawMaterials.find(rm => 
          rm.productId === item.productId || 
          rm.name.toLowerCase() === item.productName.toLowerCase()
        )
        return {
          productId: item.productId,
          productName: item.productName,
          excessQuantity: item.excessQuantity,
          action: existingMaterial ? 'add_existing' : 'add_new',
          selectedProductId: existingMaterial ? existingMaterial.productId : null,
          newProductId: existingMaterial ? '' : item.productId,
          newProductName: existingMaterial ? '' : item.productName,
          newCategory: 'Raw Material',
          newUnit: 'pcs',
          newMinStock: 10,
          newLocation: 'Warehouse A',
          newDescription: '',
          newPrice: 0
        }
      })
      setExcessItemsData(excessItemsForModal)
      setShowExcessModal(true)
    }
    
    setShowDeliveryModal(false)
    if (excessItemsToAdd.length === 0) {
      setSelectedOrder(null)
    }
  }

  const handleAddExcessToRawMaterials = () => {
    excessItemsData.forEach(item => {
      if (item.action === 'add_existing') {
        updateRawMaterialStock(item.selectedProductId, item.excessQuantity)
      } else {
        const newProductId = `RM-${String(rawMaterials.length + 1).padStart(3, '0')}`
        const newItem = {
          id: rawMaterials.length + 1,
          productId: item.newProductId || newProductId,
          name: item.newProductName,
          description: item.newProductDescription || '',
          category: item.newCategory,
          stock: item.excessQuantity,
          minStock: parseInt(item.newMinStock),
          unit: item.newUnit,
          price: parseFloat(item.newPrice),
          supplierId: null,
          status: 'active',
          location: item.newLocation
        }
        addRawMaterial(newItem)
      }
    })

    setRawMaterials(getRawMaterials())
    alert(`Successfully added excess items to Raw Materials inventory.`)
    setShowExcessModal(false)
    setSelectedOrder(null)
  }

  const createReplacementOrder = () => {
    const customer = customers.find(c => c.id === selectedOrder.customerId)
    const totalAmount = replacementData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    const newOrder = {
      id: orders.length + 1,
      orderNumber: `CO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: selectedOrder.customerId,
      customerName: customer?.name || '',
      date: new Date().toISOString().split('T')[0],
      items: replacementData.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        producedQuantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
        deliveredQuantity: 0,
        goodQuantity: 0,
        damagedQuantity: 0,
        excessQuantity: 0
      })),
      totalAmount,
      status: 'in_production',
      deliveryDate: selectedOrder.deliveryDate,
      invoiceNumber: `INV-2024-${String(orders.length + 1).padStart(3, '0')}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      orderFile: null,
      invoiceFile: null,
      deliveryChallanFile: null,
      notes: `Replacement order for ${selectedOrder.orderNumber}`,
      productionStatus: 'ready',
      componentsCheck: { available: true, missingItems: [] },
      damages: [],
      replacementOrderId: selectedOrder.id,
      cancelledAt: null,
      cancelledBy: null
    }

    // Link replacement order to original
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return { ...order, replacementOrderId: newOrder.id }
      }
      return order
    })

    setOrders([newOrder, ...updatedOrders])
    
    setShowReplacementModal(false)
    
    // After creating replacement order, check if there are excess items to add
    // Use updatedOrders to get the latest order data
    const updatedOrder = updatedOrders.find(o => o.id === selectedOrder.id)
    if (updatedOrder) {
      const excessItems = updatedOrder.items
        .map(item => {
          const producedQty = item.producedQuantity || item.quantity
          const goodQty = item.goodQuantity || 0
          // Excess = Produced - Good (items delivered to customer)
          const excessQty = Math.max(0, producedQty - goodQty)
          
          return {
            productId: item.productId,
            productName: item.productName,
            excessQuantity: excessQty
          }
        })
        .filter(item => item.excessQuantity > 0)
      
      if (excessItems.length > 0) {
        const excessItemsForModal = excessItems.map(item => {
          const existingMaterial = rawMaterials.find(rm => 
            rm.productId === item.productId || 
            rm.name.toLowerCase() === item.productName.toLowerCase()
          )
          return {
            productId: item.productId,
            productName: item.productName,
            excessQuantity: item.excessQuantity,
            action: existingMaterial ? 'add_existing' : 'add_new',
            selectedProductId: existingMaterial ? existingMaterial.productId : null,
            newProductId: existingMaterial ? '' : item.productId,
            newProductName: existingMaterial ? '' : item.productName,
            newCategory: 'Raw Material',
            newUnit: 'pcs',
            newMinStock: 10,
            newLocation: 'Warehouse A',
            newDescription: '',
            newPrice: 0
          }
        })
        setExcessItemsData(excessItemsForModal)
        setShowExcessModal(true)
      } else {
        setSelectedOrder(null)
      }
    } else {
      setSelectedOrder(null)
    }
  }

  const handleCancel = (order) => {
    if (order.status === 'delivered' || order.status === 'cancelled') {
      alert('Cannot cancel delivered or already cancelled order')
      return
    }

    setSelectedOrder(order)
    
    // Calculate items to return to inventory
    const itemsToReturn = order.items.map(item => {
      const product = finishedGoods.find(fg => fg.productId === item.productId)
      return {
        productId: item.productId,
        productName: item.productName,
        producedQuantity: item.producedQuantity || item.quantity,
        excessQuantity: item.excessQuantity || 0,
        action: product ? 'add_existing' : 'add_new',
        selectedProductId: product ? item.productId : null,
        newProductId: product ? '' : item.productId,
        newProductName: product ? '' : item.productName,
        newCategory: 'Finished Goods',
        newUnit: 'pcs',
        newMinStock: 10,
        newLocation: 'Finished Goods Warehouse',
        newDescription: '',
        newPrice: item.unitPrice
      }
    })

    setCancelData({ items: itemsToReturn })
    setShowCancelModal(true)
  }

  const saveCancellation = () => {
    // Add items back to inventory
    cancelData.items.forEach(item => {
      if (item.action === 'add_existing') {
        updateFinishedGoodsStock(item.selectedProductId, item.producedQuantity)
      } else {
        const newProduct = {
          id: finishedGoods.length + 1,
          productId: item.newProductId,
          name: item.newProductName,
          description: item.newProductDescription || '',
          category: item.newCategory,
          stock: item.producedQuantity,
          minStock: parseInt(item.newMinStock),
          unit: item.newUnit,
          price: parseFloat(item.newPrice),
          status: 'active',
          location: item.newLocation,
          components: []
        }
        addFinishedGood(newProduct)
      }
    })

    // Update order status
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancelledBy: user?.name || ''
        }
      }
      return order
    })

    setOrders(updatedOrders)
    setFinishedGoods(getFinishedGoods())
    setShowCancelModal(false)
    setSelectedOrder(null)
  }

  const handleView = (order) => {
    setSelectedOrder(order)
    setShowViewModal(true)
  }

  const generateOrderPDF = (order) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text('Customer Order Details', 14, 22)

    // Order Information
    doc.setFontSize(12)
    let yPos = 35
    doc.text(`Order Number: ${order.orderNumber}`, 14, yPos)
    yPos += 7
    doc.text(`Customer: ${order.customerName}`, 14, yPos)
    yPos += 7
    doc.text(`Order Date: ${order.date}`, 14, yPos)
    yPos += 7
    doc.text(`Delivery Date: ${order.deliveryDate || 'N/A'}`, 14, yPos)
    yPos += 7
    doc.text(`Status: ${getStatusBadge(order.status).label}`, 14, yPos)
    yPos += 7
    doc.text(`Invoice Number: ${order.invoiceNumber}`, 14, yPos)
    yPos += 7
    doc.text(`Total Amount: ₹${order.totalAmount.toLocaleString()}`, 14, yPos)
    yPos += 10

    // Items Table
    const tableColumn = ["Product", "Ordered", "Produced", "Excess", "Delivered", "Good", "Damaged", "Unit Price", "Total"]
    const tableRows = []

    order.items.forEach(item => {
      tableRows.push([
        item.productName,
        item.quantity,
        item.producedQuantity || item.quantity,
        item.excessQuantity || 0,
        item.deliveredQuantity || 0,
        item.goodQuantity || 0,
        item.damagedQuantity || 0,
        `₹${item.unitPrice.toLocaleString()}`,
        `₹${item.total.toLocaleString()}`
      ])
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    })

    yPos = doc.lastAutoTable.finalY + 10

    // Production Status
    if (order.productionStatus) {
      doc.setFontSize(12)
      doc.text(`Production Status: ${order.productionStatus}`, 14, yPos)
      yPos += 7
    }

    // Component Availability
    if (order.componentsCheck) {
      doc.text(`Components Available: ${order.componentsCheck.available ? 'Yes' : 'No'}`, 14, yPos)
      yPos += 7
      if (!order.componentsCheck.available && order.componentsCheck.missingItems) {
        doc.setFontSize(10)
        doc.text('Missing Components:', 14, yPos)
        yPos += 5
        order.componentsCheck.missingItems.forEach(item => {
          doc.text(`- ${item.productName}: Required ${item.required}, Available ${item.available}`, 20, yPos)
          yPos += 5
        })
        yPos += 2
      }
    }

    // Damages
    if (order.damages && order.damages.length > 0) {
      doc.setFontSize(12)
      doc.text('Damages:', 14, yPos)
      yPos += 7
      doc.setFontSize(10)
      order.damages.forEach(damage => {
        doc.text(`- ${damage.productName}: ${damage.quantity} units - ${damage.reason}`, 20, yPos)
        yPos += 5
      })
    }

    // Replacement Order
    if (order.replacementOrderId) {
      const replacementOrder = orders.find(o => o.id === order.replacementOrderId)
      if (replacementOrder) {
        doc.setFontSize(12)
        doc.text(`Replacement Order: ${replacementOrder.orderNumber}`, 14, yPos)
        yPos += 7
      }
    }

    // Cancellation Info
    if (order.status === 'cancelled') {
      doc.setFontSize(12)
      doc.text(`Cancelled At: ${order.cancelledAt || 'N/A'}`, 14, yPos)
      yPos += 7
      doc.text(`Cancelled By: ${order.cancelledBy || 'N/A'}`, 14, yPos)
      yPos += 7
    }

    // Notes
    if (order.notes) {
      doc.setFontSize(12)
      doc.text('Notes:', 14, yPos)
      yPos += 7
      doc.setFontSize(10)
      const splitNotes = doc.splitTextToSize(order.notes, 180)
      doc.text(splitNotes, 14, yPos)
    }

    doc.save(`CustomerOrder_${order.orderNumber}.pdf`)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
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
      in_production: { class: 'badge-info', label: 'In Production' },
      ready: { class: 'badge-success', label: 'Ready' },
      in_transit: { class: 'badge-primary', label: 'In Transit' },
      delivered: { class: 'badge-success', label: 'Delivered' },
      cancelled: { class: 'badge-danger', label: 'Cancelled' }
    }
    return badges[status] || badges.pending
  }

  const canDelete = (order) => {
    return order.status !== 'in_transit' && order.status !== 'delivered' && order.status !== 'cancelled'
  }

  const canEdit = (order) => {
    return order.status !== 'in_transit' && order.status !== 'delivered' && order.status !== 'cancelled'
  }

  return (
    <div className="customer-orders">
      <div className="page-header">
        <div>
          <h1>Customer Orders</h1>
          <p>Manage customer orders, production, delivery, and tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {orders.filter(o => o.status === 'ready' || o.status === 'in_transit').length > 0 && (
            <button 
              className="btn-secondary" 
              onClick={() => {
                const readyOrder = orders.find(o => o.status === 'ready' || o.status === 'in_transit')
                if (readyOrder) {
                  handleStatusChange(readyOrder, 'in_transit')
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Truck size={18} />
              Delivery Inspection ({orders.filter(o => o.status === 'ready' || o.status === 'in_transit').length})
            </button>
          )}
          <button className="btn-primary" onClick={() => {
            setSelectedOrder(null)
            setFormData({
              customerId: '',
              date: new Date().toISOString().split('T')[0],
              deliveryDate: '',
              items: [{ productId: '', quantity: '', unitPrice: '', producedQuantity: '' }],
              notes: '',
              orderFile: null,
              invoiceFile: null,
              deliveryChallanFile: null
            })
            setShowModal(true)
          }}>
            <Plus size={20} />
            New Order
          </button>
        </div>
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
          <option value="in_production">In Production</option>
          <option value="ready">Ready</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Components</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No customer orders found</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                    {order.replacementOrderId && (
                      <small className="replacement-badge">Replacement</small>
                    )}
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.date}</td>
                  <td>
                    <div className="items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <span>{item.productName}</span>
                          <small>Ordered: {item.quantity} | Produced: {item.producedQuantity || item.quantity}</small>
                          {item.excessQuantity > 0 && (
                            <small className="excess-info">+{item.excessQuantity} excess</small>
                          )}
                          {item.deliveredQuantity > 0 && (
                            <small>Delivered: {item.deliveredQuantity} (Good: {item.goodQuantity || 0}, Damaged: {item.damagedQuantity || 0})</small>
                          )}
                          {item.damagedQuantity > 0 && (
                            <small className="damage-alert">
                              <AlertCircle size={12} /> {item.damagedQuantity} damaged
                            </small>
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
                    {order.componentsCheck?.available ? (
                      <span className="text-success">Available</span>
                    ) : (
                      <span className="text-warning">
                        <AlertCircle size={14} /> Missing
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleView(order)} title="View">
                        <Eye size={16} />
                      </button>
                      {canEdit(order) && (
                        <button className="btn-icon" onClick={() => handleEdit(order)} title="Edit">
                          <Edit size={16} />
                        </button>
                      )}
                      {(order.status === 'ready' || order.status === 'in_transit') && (
                        <button 
                          className="btn-icon" 
                          onClick={() => handleStatusChange(order, 'in_transit')} 
                          title={order.status === 'ready' ? 'Start Delivery Inspection' : 'Update Delivery Inspection'}
                          style={{ 
                            color: order.status === 'ready' ? '#3b82f6' : '#10b981',
                            backgroundColor: order.status === 'ready' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            padding: '6px',
                            borderRadius: '6px',
                            border: `1px solid ${order.status === 'ready' ? '#3b82f6' : '#10b981'}`
                          }}
                        >
                          {order.status === 'ready' ? <Truck size={18} /> : <CheckCircle size={18} />}
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'in_production') && (
                        <button 
                          className="btn-icon" 
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowStatusModal(true)
                          }} 
                          title="Change Status to Ready"
                          style={{ color: '#6b7280' }}
                        >
                          <ArrowRight size={16} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => generateOrderPDF(order)} title="Download PDF">
                        <Download size={16} />
                      </button>
                      {canDelete(order) && (
                        <>
                          <button className="btn-icon" onClick={() => handleCancel(order)} title="Cancel Order">
                            <XCircle size={16} />
                          </button>
                          <button className="btn-icon" onClick={() => handleDelete(order.id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </>
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

      {/* Order Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedOrder ? 'Edit Order' : 'New Customer Order'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer *</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
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
                <label>Delivery Date *</label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
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
                      {finishedGoods.map(product => (
                        <option key={product.productId} value={product.productId}>
                          {product.productId} - {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Ordered Quantity"
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
                      placeholder="Produced Quantity"
                      value={item.producedQuantity}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].producedQuantity = e.target.value || item.quantity
                        setFormData({ ...formData, items: newItems })
                      }}
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
                    items: [...formData.items, { productId: '', quantity: '', unitPrice: '', producedQuantity: '' }]
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
                  {selectedOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Order Status</h2>
              <button className="modal-close" onClick={() => setShowStatusModal(false)}>×</button>
            </div>
            <div className="status-options">
              {['pending', 'in_production', 'ready', 'in_transit'].map(status => (
                <button
                  key={status}
                  className="btn-secondary"
                  onClick={() => {
                    if (status === 'in_transit') {
                      setShowStatusModal(false)
                      handleStatusChange(selectedOrder, 'in_transit')
                    } else {
                      saveStatusChange(status)
                    }
                  }}
                >
                  {getStatusBadge(status).label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delivery Inspection Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDeliveryModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delivery Inspection - {selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setShowDeliveryModal(false)}>×</button>
            </div>
            <div className="delivery-inspection">
              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Date *</label>
                  <input
                    type="date"
                    value={deliveryData.deliveryDate}
                    onChange={(e) => setDeliveryData({ ...deliveryData, deliveryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Delivered By *</label>
                  <input
                    type="text"
                    value={deliveryData.deliveredBy}
                    onChange={(e) => setDeliveryData({ ...deliveryData, deliveredBy: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Item Inspection</label>
                {deliveryData.items.map((item, idx) => {
                  const maxDelivered = item.producedQuantity
                  const excessQty = item.excessQuantity || 0
                  return (
                    <div key={idx} className="delivery-item-card">
                      <h4>{item.productName}</h4>
                      <div className="delivery-stats">
                        <div className="stat-box">
                          <label>Ordered:</label>
                          <span>{item.orderedQuantity}</span>
                        </div>
                        <div className="stat-box">
                          <label>Produced:</label>
                          <span>{item.producedQuantity}</span>
                        </div>
                        {excessQty > 0 && (
                          <div className="stat-box excess">
                            <label>Excess:</label>
                            <span>+{excessQty}</span>
                          </div>
                        )}
                      </div>
                      <div className="delivery-inputs">
                        <div className="input-group">
                          <label>Good Items *</label>
                          <input
                            type="number"
                            value={item.goodQuantity || ''}
                            onChange={(e) => {
                              const goodQty = parseInt(e.target.value) || 0
                              const maxGood = maxDelivered
                              const updated = [...deliveryData.items]
                              updated[idx].goodQuantity = Math.min(goodQty, maxGood)
                              // Don't auto-calculate damaged - let user enter manually
                              setDeliveryData({ ...deliveryData, items: updated })
                            }}
                            min="0"
                            max={maxDelivered}
                            required
                          />
                          <small className="info-text">
                            Maximum: {maxDelivered} (Produced: {item.producedQuantity})
                          </small>
                        </div>
                        <div className="input-group">
                          <label>Damaged Items</label>
                          <input
                            type="number"
                            value={item.damagedQuantity || ''}
                            onChange={(e) => {
                              const damagedQty = parseInt(e.target.value) || 0
                              const updated = [...deliveryData.items]
                              updated[idx].damagedQuantity = Math.min(damagedQty, maxDelivered - (updated[idx].goodQuantity || 0))
                              setDeliveryData({ ...deliveryData, items: updated })
                            }}
                            min="0"
                            max={maxDelivered}
                          />
                        </div>
                      </div>
                      {item.damagedQuantity > 0 && (
                        <div className="damage-handling">
                          <p className="info-text">
                            {item.damagedQuantity} damaged items recorded. You can handle replacement orders separately if needed.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowDeliveryModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={saveDelivery}>
                  Save Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replacement Order Modal */}
      {showReplacementModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowReplacementModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Replacement Order</h2>
              <button className="modal-close" onClick={() => setShowReplacementModal(false)}>×</button>
            </div>
            <div className="replacement-content">
              <p className="info-text">
                Damaged items detected. Create a replacement order for {selectedOrder.customerName}?
              </p>
              <div className="replacement-items">
                {replacementData.items.map((item, idx) => (
                  <div key={idx} className="replacement-item">
                    <strong>{item.productName}</strong>
                    <span>Quantity: {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReplacementModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={createReplacementOrder}>
                  Create Replacement Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excess Items to Raw Materials Modal */}
      {showExcessModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowExcessModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Excess Items to Raw Materials</h2>
              <button className="modal-close" onClick={() => setShowExcessModal(false)}>×</button>
            </div>
            <div className="excess-items-content">
              <p className="info-text">
                Order <strong>{selectedOrder.orderNumber}</strong> has excess items. Add them to Raw Materials inventory.
              </p>
              
              {excessItemsData.map((item, idx) => {
                const existingMaterial = rawMaterials.find(rm => rm.productId === item.selectedProductId)
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
                          const updated = [...excessItemsData]
                          updated[idx].action = e.target.value
                          if (e.target.value === 'add_existing') {
                            updated[idx].selectedProductId = item.productId
                          }
                          setExcessItemsData(updated)
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
                        <label>Select Raw Material</label>
                        <select
                          value={item.selectedProductId || item.productId}
                          onChange={(e) => {
                            const updated = [...excessItemsData]
                            updated[idx].selectedProductId = e.target.value
                            setExcessItemsData(updated)
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
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Product ID *</label>
                            <input
                              type="text"
                              value={item.newProductId}
                              onChange={(e) => {
                                const updated = [...excessItemsData]
                                updated[idx].newProductId = e.target.value
                                setExcessItemsData(updated)
                              }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Product Name *</label>
                            <input
                              type="text"
                              value={item.newProductName}
                              onChange={(e) => {
                                const updated = [...excessItemsData]
                                updated[idx].newProductName = e.target.value
                                setExcessItemsData(updated)
                              }}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            value={item.newProductDescription}
                            onChange={(e) => {
                              const updated = [...excessItemsData]
                              updated[idx].newProductDescription = e.target.value
                              setExcessItemsData(updated)
                            }}
                            rows="2"
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Category</label>
                            <input
                              type="text"
                              value={item.newCategory}
                              onChange={(e) => {
                                const updated = [...excessItemsData]
                                updated[idx].newCategory = e.target.value
                                setExcessItemsData(updated)
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label>Unit</label>
                            <input
                              type="text"
                              value={item.newUnit}
                              onChange={(e) => {
                                const updated = [...excessItemsData]
                                updated[idx].newUnit = e.target.value
                                setExcessItemsData(updated)
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Price per Unit</label>
                            <input
                              type="number"
                              value={item.newPrice}
                              onChange={(e) => {
                                const updated = [...excessItemsData]
                                updated[idx].newPrice = e.target.value
                                setExcessItemsData(updated)
                              }}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="form-group">
                            <label>Minimum Stock</label>
                            <input
                              type="number"
                              value={item.newMinStock}
                              onChange={(e) => {
                                const updated = [...excessItemsData]
                                updated[idx].newMinStock = e.target.value
                                setExcessItemsData(updated)
                              }}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Location</label>
                          <input
                            type="text"
                            value={item.newLocation}
                            onChange={(e) => {
                              const updated = [...excessItemsData]
                              updated[idx].newLocation = e.target.value
                              setExcessItemsData(updated)
                            }}
                          />
                        </div>
                      </>
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
                  onClick={handleAddExcessToRawMaterials}
                  disabled={excessItemsData.some(item => 
                    (item.action === 'add_new' && (!item.newProductId || !item.newProductName)) ||
                    (item.action === 'add_existing' && !item.selectedProductId)
                  )}
                >
                  Add to Raw Materials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancel Order - {selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            <div className="cancel-content">
              <p className="warning-text">
                This order will be cancelled. Items produced will be returned to inventory.
              </p>
              <div className="form-group">
                <label>Items to Return to Inventory</label>
                {cancelData.items.map((item, idx) => {
                  const existingProduct = finishedGoods.find(fg => fg.productId === item.productId)
                  return (
                    <div key={idx} className="cancel-item-card">
                      <h4>{item.productName}</h4>
                      <div className="cancel-stats">
                        <div className="stat-box">
                          <label>Produced:</label>
                          <span>{item.producedQuantity}</span>
                        </div>
                        {item.excessQuantity > 0 && (
                          <div className="stat-box excess">
                            <label>Excess:</label>
                            <span>+{item.excessQuantity}</span>
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Action *</label>
                        <select
                          value={item.action}
                          onChange={(e) => {
                            const updated = [...cancelData.items]
                            updated[idx].action = e.target.value
                            setCancelData({ items: updated })
                          }}
                        >
                          {existingProduct ? (
                            <>
                              <option value="add_existing">Add to Existing: {item.productName}</option>
                              <option value="add_new">Add as New Item</option>
                            </>
                          ) : (
                            <option value="add_new">Add as New Item (Not in inventory)</option>
                          )}
                        </select>
                      </div>
                      {item.action === 'add_existing' && existingProduct && (
                        <div className="form-group">
                          <label>Select Product</label>
                          <select
                            value={item.selectedProductId || item.productId}
                            onChange={(e) => {
                              const updated = [...cancelData.items]
                              updated[idx].selectedProductId = e.target.value
                              setCancelData({ items: updated })
                            }}
                          >
                            {finishedGoods.map(fg => (
                              <option key={fg.productId} value={fg.productId}>
                                {fg.productId} - {fg.name} (Current Stock: {fg.stock} {fg.unit})
                              </option>
                            ))}
                          </select>
                          <small className="info-text">
                            Current stock: {existingProduct.stock} {existingProduct.unit} → Will become: {existingProduct.stock + item.producedQuantity} {existingProduct.unit}
                          </small>
                        </div>
                      )}
                      {item.action === 'add_new' && (
                        <>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Product ID *</label>
                              <input
                                type="text"
                                value={item.newProductId}
                                onChange={(e) => {
                                  const updated = [...cancelData.items]
                                  updated[idx].newProductId = e.target.value
                                  setCancelData({ items: updated })
                                }}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Product Name *</label>
                              <input
                                type="text"
                                value={item.newProductName}
                                onChange={(e) => {
                                  const updated = [...cancelData.items]
                                  updated[idx].newProductName = e.target.value
                                  setCancelData({ items: updated })
                                }}
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={item.newProductDescription}
                              onChange={(e) => {
                                const updated = [...cancelData.items]
                                updated[idx].newProductDescription = e.target.value
                                setCancelData({ items: updated })
                              }}
                              rows="2"
                            />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Category</label>
                              <input
                                type="text"
                                value={item.newCategory}
                                onChange={(e) => {
                                  const updated = [...cancelData.items]
                                  updated[idx].newCategory = e.target.value
                                  setCancelData({ items: updated })
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <label>Unit</label>
                              <input
                                type="text"
                                value={item.newUnit}
                                onChange={(e) => {
                                  const updated = [...cancelData.items]
                                  updated[idx].newUnit = e.target.value
                                  setCancelData({ items: updated })
                                }}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Price per Unit</label>
                              <input
                                type="number"
                                value={item.newPrice}
                                onChange={(e) => {
                                  const updated = [...cancelData.items]
                                  updated[idx].newPrice = e.target.value
                                  setCancelData({ items: updated })
                                }}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Minimum Stock</label>
                              <input
                                type="number"
                                value={item.newMinStock}
                                onChange={(e) => {
                                  const updated = [...cancelData.items]
                                  updated[idx].newMinStock = e.target.value
                                  setCancelData({ items: updated })
                                }}
                                min="0"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Location</label>
                            <input
                              type="text"
                              value={item.newLocation}
                              onChange={(e) => {
                                const updated = [...cancelData.items]
                                updated[idx].newLocation = e.target.value
                                setCancelData({ items: updated })
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCancelModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={saveCancellation}>
                  Cancel Order & Return to Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            {(selectedOrder.status === 'ready' || selectedOrder.status === 'in_transit') && (
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setShowViewModal(false)
                    handleStatusChange(selectedOrder, 'in_transit')
                  }}
                  style={{ width: '100%' }}
                >
                  <Truck size={18} style={{ marginRight: '8px' }} />
                  {selectedOrder.status === 'ready' ? 'Start Delivery Inspection' : 'Update Delivery Inspection'}
                </button>
              </div>
            )}
            <div className="order-details">
              <div className="detail-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Order Date:</strong> {selectedOrder.date}</p>
                <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
                <p><strong>Invoice Number:</strong> {selectedOrder.invoiceNumber}</p>
                <p><strong>Status:</strong> <span className={`badge ${getStatusBadge(selectedOrder.status).class}`}>
                  {getStatusBadge(selectedOrder.status).label}
                </span></p>
              </div>

              <div className="detail-section">
                <h3>Items</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Ordered</th>
                      <th>Produced</th>
                      <th>Excess</th>
                      <th>Delivered</th>
                      <th>Good</th>
                      <th>Damaged</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{item.producedQuantity || item.quantity}</td>
                        <td>{item.excessQuantity || 0}</td>
                        <td>{item.deliveredQuantity || 0}</td>
                        <td>{item.goodQuantity || 0}</td>
                        <td>{item.damagedQuantity || 0}</td>
                        <td>₹{item.unitPrice}</td>
                        <td>₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="total-amount"><strong>Total Amount: ₹{selectedOrder.totalAmount.toLocaleString()}</strong></p>
              </div>

              <div className="detail-section">
                <h3>Component Availability</h3>
                {selectedOrder.componentsCheck?.available ? (
                  <p className="text-success">✓ All components available</p>
                ) : (
                  <div>
                    <p className="text-warning">⚠ Missing components:</p>
                    <ul>
                      {selectedOrder.componentsCheck?.missingItems?.map((item, idx) => (
                        <li key={idx}>
                          {item.productName}: Required {item.required}, Available {item.available}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {selectedOrder.replacementOrderId && (
                <div className="detail-section">
                  <h3>Replacement Order</h3>
                  <p>Replacement Order Number: {orders.find(o => o.id === selectedOrder.replacementOrderId)?.orderNumber || 'N/A'}</p>
                </div>
              )}

              {selectedOrder.status === 'cancelled' && (
                <div className="detail-section">
                  <h3>Cancellation Details</h3>
                  <p><strong>Cancelled At:</strong> {selectedOrder.cancelledAt || 'N/A'}</p>
                  <p><strong>Cancelled By:</strong> {selectedOrder.cancelledBy || 'N/A'}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Files</h3>
                <div className="file-list">
                  {selectedOrder.orderFile && (
                    <div className="file-item">
                      <FileText size={18} />
                      <span>Order Document: {selectedOrder.orderFile.name}</span>
                    </div>
                  )}
                  {selectedOrder.invoiceFile && (
                    <div className="file-item">
                      <FileText size={18} />
                      <span>Invoice: {selectedOrder.invoiceFile.name}</span>
                    </div>
                  )}
                  {selectedOrder.deliveryChallanFile && (
                    <div className="file-item">
                      <FileText size={18} />
                      <span>Delivery Challan: {selectedOrder.deliveryChallanFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerOrders
