// COMMENTED OUT FOR STATIC HOSTING - ALL ROUTES ARE NOW PUBLIC
// import { Navigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  // const { user } = useAuth() // COMMENTED OUT FOR STATIC HOSTING
  
  // if (!user) { // COMMENTED OUT FOR STATIC HOSTING
  //   return <Navigate to="/login" replace />
  // }
  
  // Always allow access for static hosting
  return children
}

export default ProtectedRoute

