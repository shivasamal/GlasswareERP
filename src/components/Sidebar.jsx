import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import './Sidebar.css'

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { path: '/inventory', icon: LayoutDashboard, label: 'Dashboard', submenu: [
      { path: '/inventory/raw-materials', label: 'Raw Materials' },
      { path: '/inventory/finished-goods', label: 'Finished Goods' },
      { path: '/inventory/stock-movements', label: 'Stock Movements' },
      { path: '/inventory/suppliers', label: 'Suppliers' },
      { path: '/inventory/purchase-orders', label: 'Purchase Orders' },
      { path: '/inventory/customer-orders', label: 'Customer Orders' },
      { path: '/inventory/reports', label: 'Reports' }
    ]}
  ]

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
          {menuItems.map((item) => (
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

