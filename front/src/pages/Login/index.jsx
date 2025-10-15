import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loginUser, clearError } from '../../store/slices/authSlice'
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Clear error when component unmounts or form changes
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError())
      }
    }
  }, [error, dispatch])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return // Form validation will handle this
    }

    dispatch(clearError())
    dispatch(loginUser(formData))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form-container">
          <div className="login-header">
          <div className="logo">
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>SAGA Food Truck</h1>
          </div>
          <p className="subtitle">Faça login para acessar o sistema</p>
        </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {showPassword ? (
                      <path d="M17.94 17.94C16.2 19.57 13.71 20.5 12 20.5C5.45 20.5 2 12 2 12C3.73 8.39 7.14 6.1 10.94 5.12M4.27 4.27L19.73 19.73M12 9C13.66 9 15 10.34 15 12C15 12.64 14.76 13.2 14.37 13.63M12 5C7.03 5 2.73 8.11 1 12C2.73 15.89 7.03 19 12 19C13.55 19 15.03 18.64 16.38 17.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M1 12S4.5 4.5 12 4.5 23 12 23 12 19.5 19.5 12 19.5 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login