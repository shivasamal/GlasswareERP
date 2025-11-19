import './InvoiceView.css'

const InvoiceView = ({ invoice, order, customer }) => {
  if (!invoice) return null

  // Calculate tax (assuming 18% GST)
  const taxRate = 0.18
  const subtotal = order?.totalAmount || invoice.amount || 0
  const tax = subtotal * taxRate
  const total = subtotal + tax

  // Company details (you can move this to a config file)
  const companyDetails = {
    name: 'Glassware Manufacturing Co.',
    address: '123 Industrial Area, Phase 2',
    city: 'Mumbai, Maharashtra 400001',
    phone: '+91-22-1234-5678',
    email: 'info@glassware.com',
    gst: 'GST123456789',
    pan: 'ABCDE1234F'
  }

  return (
    <div className="invoice-view">
      <div className="invoice-header">
        <div className="invoice-company">
          <h2>{companyDetails.name}</h2>
          <p>{companyDetails.address}</p>
          <p>{companyDetails.city}</p>
          <p>Phone: {companyDetails.phone} | Email: {companyDetails.email}</p>
          <p>GSTIN: {companyDetails.gst} | PAN: {companyDetails.pan}</p>
        </div>
        <div className="invoice-title">
          <h1>TAX INVOICE</h1>
          <div className="invoice-number">
            <strong>Invoice No:</strong> {invoice.invoiceNumber}
          </div>
          <div className="invoice-date">
            <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="invoice-parties">
        <div className="invoice-bill-to">
          <h3>Bill To:</h3>
          <p><strong>{customer?.name || invoice.customerName}</strong></p>
          {customer && (
            <>
              <p>{customer.address}</p>
              <p>Phone: {customer.phone}</p>
              <p>Email: {customer.email}</p>
              {customer.gst && <p>GSTIN: {customer.gst}</p>}
            </>
          )}
        </div>
        <div className="invoice-ship-to">
          <h3>Ship To:</h3>
          <p><strong>{customer?.name || invoice.customerName}</strong></p>
          {customer && (
            <>
              <p>{customer.address}</p>
              <p>Phone: {customer.phone}</p>
            </>
          )}
        </div>
      </div>

      <div className="invoice-order-info">
        <p><strong>Order Number:</strong> {invoice.orderNumber}</p>
        {order?.deliveryDate && (
          <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString('en-IN')}</p>
        )}
      </div>

      <div className="invoice-items">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Product Code</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productCode}</td>
                  <td>
                    <div>
                      <strong>{item.productName}</strong>
                      {item.customization && item.customization !== 'None' && (
                        <div className="customization-note">
                          Customization: {item.customization}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice.toLocaleString()}</td>
                  <td>₹{item.total.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                  No items found for this invoice
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="invoice-totals">
        <div className="invoice-totals-right">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="total-row">
            <span>GST (18%):</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>
          <div className="total-row total-final">
            <span><strong>Total Amount:</strong></span>
            <span><strong>₹{total.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      <div className="invoice-footer">
        <div className="invoice-terms">
          <h4>Terms & Conditions:</h4>
          <ul>
            <li>Payment due within 30 days of invoice date</li>
            <li>Goods once sold will not be taken back</li>
            <li>Subject to Mumbai jurisdiction</li>
          </ul>
        </div>
        <div className="invoice-status">
          <div className={`status-badge-invoice ${invoice.status}`}>
            {invoice.status.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="invoice-signature">
        <div>
          <p>Authorized Signatory</p>
          <p>{companyDetails.name}</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceView

