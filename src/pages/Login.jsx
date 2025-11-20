import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' // Still needed for mock login
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  // COMMENTED OUT FOR STATIC HOSTING - login now always succeeds
  const { login } = useAuth() // Returns function that always succeeds for static hosting
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // COMMENTED OUT FOR STATIC HOSTING - Always navigate to dashboard
    const result = login(email, password) // Always returns success for static hosting
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Glassware ERP System</h1>
        <p className="login-subtitle">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@glassware.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        <div className="login-hint">
          <p>Demo Accounts:</p>
          <p>Admin: admin@glassware.com / admin123</p>
          <p>Inventory Manager: inventory@glassware.com / inv123</p>
          <p>Sales Manager: sales@glassware.com / sales123</p>
        </div>
      </div>
    </div>
  )
}

export default Login

