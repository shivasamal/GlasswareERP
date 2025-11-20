import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' // Still needed for mock hasAccess
import {
  LayoutDashboard, Package, Factory, ShoppingCart, ShoppingBag,
  Users, DollarSign, BarChart3, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import './Sidebar.css'

const Sidebar = () => {
  // COMMENTED OUT FOR STATIC HOSTING - hasAccess now always returns true
  const { hasAccess } = useAuth() // Returns function that always returns true for static hosting
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Main Dashboard', module: 'dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory', module: 'inventory', submenu: [
      { path: '/inventory/products', label: 'Base Products' },
      { path: '/inventory/components', label: 'Components' },
      { path: '/inventory/packaging', label: 'Packaging' },
      { path: '/inventory/damaged', label: 'Damaged/Scrap' }
    ]},
    { path: '/production', icon: Factory, label: 'Production', module: 'production', submenu: [
      { path: '/production/orders', label: 'Production Orders' },
      { path: '/production/batches', label: 'Batches' },
      { path: '/production/quality', label: 'Quality Control' }
    ]},
    { path: '/sales', icon: ShoppingCart, label: 'Sales & Distribution', module: 'sales', submenu: [
      { path: '/sales/customers', label: 'Customers' },
      { path: '/sales/orders', label: 'Orders' },
      { path: '/sales/invoices', label: 'Invoices' },
      { path: '/sales/shipments', label: 'Shipments' }
    ]},
    { path: '/purchase', icon: ShoppingBag, label: 'Purchase & Suppliers', module: 'purchase', submenu: [
      { path: '/purchase/suppliers', label: 'Suppliers' },
      { path: '/purchase/orders', label: 'Purchase Orders' },
      { path: '/purchase/receipts', label: 'Receipts' },
      { path: '/purchase/inspection', label: 'Inspection' },
      { path: '/purchase/payments', label: 'Payments' }
    ]},
    { path: '/hr', icon: Users, label: 'HR & Payroll', module: 'hr', submenu: [
      { path: '/hr/employees', label: 'Employees' },
      { path: '/hr/attendance', label: 'Attendance' },
      { path: '/hr/payroll', label: 'Payroll' },
      { path: '/hr/roles', label: 'Roles & Permissions' }
    ]},
    { path: '/accounting', icon: DollarSign, label: 'Accounting & Finance', module: 'accounting', submenu: [
      { path: '/accounting/ledgers', label: 'Ledgers' },
      { path: '/accounting/ap', label: 'Accounts Payable' },
      { path: '/accounting/ar', label: 'Accounts Receivable' },
      { path: '/accounting/reports', label: 'Reports' }
    ]},
    { path: '/analytics', icon: BarChart3, label: 'Analytics', module: 'analytics' }
  ]

  // COMMENTED OUT FOR STATIC HOSTING - Show all menu items
  // const filteredMenuItems = menuItems.filter(item => hasAccess(item.module))
  const filteredMenuItems = menuItems // Show all items for static hosting

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Glassware ERP</h3>
        </div>
        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <div key={item.path} className="nav-item-wrapper">
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
              {item.submenu && (
                <div className="submenu">
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  )
}

export default Sidebar

