import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' // Still needed for mock user data
import { useTheme } from '../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'

const Layout = () => {
  // COMMENTED OUT FOR STATIC HOSTING - Using mock auth values (not actually used in Layout)
  // const { user, hasAccess } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout

