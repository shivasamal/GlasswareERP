import { useAuth } from '../contexts/AuthContext' // Still needed for mock user data
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import './Header.css'

const Header = () => {
  // COMMENTED OUT FOR STATIC HOSTING - Using mock auth values
  const { user, logout } = useAuth() // Returns mock user for static hosting
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">Glassware ERP System</h2>
      </div>
      <div className="header-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="user-info">
          <User size={18} />
          <span>{user?.name}</span>
          <span className="role-badge">{user?.role?.name}</span>
        </div>
        <button className="icon-btn" onClick={logout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default Header

