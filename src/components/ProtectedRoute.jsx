import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  
  // Since we auto-login, this should rarely happen, but redirect to inventory if no user
  if (!user) {
    return <Navigate to="/inventory" replace />
  }
  
  return children
}

export default ProtectedRoute

