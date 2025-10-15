import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import './styles.css'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="loading-container">
        🔄 Carregando...
      </div>
    )
  }

  return (  
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🚚 SAGA Food Truck</h1>
          <p className="dashboard-welcome">
            Bem-vindo(a), {user?.name || user?.email} (<strong>{user?.role}</strong>)
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Sair
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="card-title">📋 Pedidos</h3>
          <p className="card-description">Gerencie os pedidos do food truck</p>
          <button className="card-button">
            Ver Pedidos
          </button>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">🍔 Cardápio</h3>
          <p className="card-description">Gerencie os itens do cardápio</p>
          <button className="card-button">
            Editar Cardápio
          </button>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">📊 Relatórios</h3>
          <p className="card-description">Visualize relatórios de vendas</p>
          <button className="card-button">
            Ver Relatórios
          </button>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">⚙️ Configurações</h3>
          <p className="card-description">Ajuste as configurações do sistema</p>
          <button className="card-button">
            Configurar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard