// COMMENTED OUT FOR STATIC HOSTING - USING MOCK AUTH VALUES
import React, { createContext, useContext, useState, useEffect } from 'react'
import { users, roles } from '../data/staticData'

const AuthContext = createContext()

// Mock admin user for static hosting
const mockUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@glassware.com',
  role: { id: 1, name: 'Admin', modules: ['dashboard', 'inventory', 'production', 'sales', 'purchase', 'hr', 'accounting', 'analytics'] }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  // COMMENTED OUT FOR STATIC HOSTING - Always return mock context
  // if (!context) {
  //   throw new Error('useAuth must be used within AuthProvider')
  // }
  // Return mock context if AuthProvider is not used
  if (!context) {
    return {
      user: mockUser,
      login: () => ({ success: true, user: mockUser }),
      logout: () => {},
      hasAccess: () => true // Always return true for static hosting
    }
  }
  return context
}

export const AuthProvider = ({ children }) => {
  // COMMENTED OUT FOR STATIC HOSTING - Using mock user instead
  // const [user, setUser] = useState(() => {
  //   const saved = localStorage.getItem('user')
  //   return saved ? JSON.parse(saved) : null
  // })

  // Always use mock user for static hosting
  const [user] = useState(mockUser)

  const login = (email, password) => {
    // COMMENTED OUT FOR STATIC HOSTING - Always return success
    // const foundUser = users.find(u => u.email === email && u.password === password)
    // if (foundUser) {
    //   const userWithRole = {
    //     ...foundUser,
    //     role: roles.find(r => r.id === foundUser.roleId)
    //   }
    //   setUser(userWithRole)
    //   localStorage.setItem('user', JSON.stringify(userWithRole))
    //   return { success: true, user: userWithRole }
    // }
    // return { success: false, error: 'Invalid credentials' }
    return { success: true, user: mockUser }
  }

  const logout = () => {
    // COMMENTED OUT FOR STATIC HOSTING - Do nothing
    // setUser(null)
    // localStorage.removeItem('user')
  }

  const hasAccess = (module) => {
    // COMMENTED OUT FOR STATIC HOSTING - Always return true
    // if (!user) return false
    // if (user.role?.name === 'Admin') return true
    // return user.role?.modules?.includes(module) || false
    return true // Always allow access for static hosting
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

