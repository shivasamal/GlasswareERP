import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// COMMENTED OUT FOR STATIC HOSTING - Router is now in App.jsx with basename
// import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <BrowserRouter basename="/GlasswareERP"> COMMENTED OUT - Router moved to App.jsx
    <App />
  // </BrowserRouter>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
)

