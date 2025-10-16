// src/App.jsx

import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { store } from './store'
import { useAppSelector } from './store/hooks'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home' // Keep for testing purposes
import Products from './pages/Products'
import Orders from './pages/Orders'
import './styles.css'

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Keep home for testing API connectivity */}
          <Route path="/test" element={<Home />} />
          
          {/* Products and Orders routes */}
          <Route path="/produtos" element={<Products />} />
          <Route path="/pedidos" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App