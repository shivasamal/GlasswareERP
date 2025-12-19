import React, { createContext, useContext, useState } from 'react'
import { users, roles } from '../data/staticData'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  // Auto-login with admin user for direct dashboard access
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      return JSON.parse(saved)
    }
    // Auto-login with admin user
    const adminUser = users.find(u => u.roleId === 1)
    if (adminUser) {
      const userWithRole = {
        ...adminUser,
        role: roles.find(r => r.id === adminUser.roleId)
      }
      localStorage.setItem('user', JSON.stringify(userWithRole))
      return userWithRole
    }
    return null
  })

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password)
    if (foundUser) {
      const userWithRole = {
        ...foundUser,
        role: roles.find(r => r.id === foundUser.roleId)
      }
      setUser(userWithRole)
      localStorage.setItem('user', JSON.stringify(userWithRole))
      return { success: true, user: userWithRole }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const hasAccess = (module) => {
    if (!user) return false
    if (user.role?.name === 'Admin') return true
    return user.role?.modules?.includes(module) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

