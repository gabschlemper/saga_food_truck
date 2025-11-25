import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../store/slices/authSlice'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles.css'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user?.role?.toLowerCase()
      if (role === 'admin') navigate('/dashboard')
      else if (role === 'atendente') navigate('/atendente')
    }
  }, [isAuthenticated, user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form-container">
          <div className="login-header">
            <div className="logo">
              <svg
                className="cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff6600"
                strokeWidth="2"
              >
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5A1.5 1.5 0 1 1 9 22.5A1.5 1.5 0 1 1 9 19.5M20 19.5A1.5 1.5 0 1 1 20 22.5A1.5 1.5 0 1 1 20 19.5" />
              </svg>
              <h1>SAGA Food Truck</h1>
            </div>
            <p className="subtitle">Faça login para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
