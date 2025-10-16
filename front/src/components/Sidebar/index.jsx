import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import './styles.css'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'produtos',
      label: 'Produtos',
      icon: '🍔',
      path: '/produtos'
    },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: '📋',
      path: '/pedidos'
    },
    // {
    //   id: 'relatorios',
    //   label: 'Relatórios',
    //   icon: '📈',
    //   path: '/relatorios'
    // },
    {
      id: 'regras',
      label: 'Regras de Negócio',
      icon: '⚙️',
      path: '/regras-negocio'
    }
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">SAGA Food Truck</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                onClick={() => navigate(item.path)}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-link">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
