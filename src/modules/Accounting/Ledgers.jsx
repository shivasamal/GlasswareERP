import { useState } from 'react'
import { Eye } from 'lucide-react'
import '../../modules/Production/Orders.css'

const AccountingLedgers = () => {
  const [ledgers] = useState([
    { id: 1, account: 'Sales Revenue', type: 'Income', balance: 525000, transactions: 15 },
    { id: 2, account: 'Purchase Expenses', type: 'Expense', balance: 215000, transactions: 12 },
    { id: 3, account: 'Salary Expenses', type: 'Expense', balance: 125000, transactions: 3 },
    { id: 4, account: 'Accounts Receivable', type: 'Asset', balance: 150000, transactions: 8 },
    { id: 5, account: 'Accounts Payable', type: 'Liability', balance: 50000, transactions: 5 }
  ])
  const [selectedLedger, setSelectedLedger] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleView = (ledger) => {
    setSelectedLedger(ledger)
    setShowModal(true)
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Ledgers</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Transactions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledgers.map((ledger) => (
              <tr key={ledger.id}>
                <td>{ledger.account}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: ledger.type === 'Income' ? '#10b98120' : ledger.type === 'Expense' ? '#ef444420' : '#3b82f620',
                    color: ledger.type === 'Income' ? '#10b981' : ledger.type === 'Expense' ? '#ef4444' : '#3b82f6'
                  }}>
                    {ledger.type}
                  </span>
                </td>
                <td>₹{ledger.balance.toLocaleString()}</td>
                <td>{ledger.transactions}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => handleView(ledger)}>
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedLedger && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ledger Details</h2>
            <div className="order-detail-view">
              <div className="detail-section">
                <p><strong>Account:</strong> {selectedLedger.account}</p>
                <p><strong>Type:</strong> {selectedLedger.type}</p>
                <p><strong>Balance:</strong> ₹{selectedLedger.balance.toLocaleString()}</p>
                <p><strong>Transactions:</strong> {selectedLedger.transactions}</p>
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

export default AccountingLedgers

