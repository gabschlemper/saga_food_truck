import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchDashboardStats } from '../../store/slices/dashboardSlice'
import Sidebar from '../../components/Sidebar'
import './styles.css'

function Dashboard() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { stats, recentActivity, loading, error } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardStats())
    }
  }, [dispatch, isAuthenticated])

  if (!isAuthenticated || !user) {
    return (
      <div className="loading-container">
        🔄 Carregando...
      </div>
    )
  }

  return (  
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Visão geral das suas vendas e estoque</p>
          </div>
          <button className="new-order-button">
            + Novo Pedido
          </button>
        </header>

        {loading ? (
          <div className="dashboard-loading">
            🔄 Carregando dados do dashboard...
          </div>
        ) : error ? (
          <div className="dashboard-error">
            ❌ Erro ao carregar dados: {error}
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3 className="stat-title">Vendas Hoje</h3>
                  <p className="stat-value">R$ {stats.todaySales.value.toFixed(2)}</p>
                  <p className="stat-change">{stats.todaySales.change} {stats.todaySales.changeText}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-content">
                  <h3 className="stat-title">Pedidos Hoje</h3>
                  <p className="stat-value">{stats.todayOrders.value}</p>
                  <p className="stat-change">{stats.todayOrders.change} {stats.todayOrders.changeText}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3 className="stat-title">Produtos</h3>
                  <p className="stat-value">{stats.totalProducts.value}</p>
                  <p className="stat-change">{stats.totalProducts.changeText}</p>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <h3 className="stat-title">Estoque Baixo</h3>
                  <p className="stat-value">{stats.lowStock.value}</p>
                  <p className="stat-change">{stats.lowStock.changeText}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-bottom">
              <div className="recent-orders-card">
                <div className="card-header">
                  <h2 className="card-title">Últimos Pedidos</h2>
                  <p className="card-subtitle">Pedidos mais recentes do seu food truck</p>
                </div>
                <div className="orders-list">
                  <div className="order-row">
                    <div className="order-info">
                      <span className="customer-name">João Silva</span>
                      <span className="order-time">14:30</span>
                    </div>
                    <span className="order-status pago">Pago</span>
                    <span className="order-value">R$ 35.50</span>
                  </div>
                  <div className="order-row">
                    <div className="order-info">
                      <span className="customer-name">Maria Santos</span>
                      <span className="order-time">14:25</span>
                    </div>
                    <span className="order-status pendente">Pendente</span>
                    <span className="order-value">R$ 42.00</span>
                  </div>
                  <div className="order-row">
                    <div className="order-info">
                      <span className="customer-name">Pedro Costa</span>
                      <span className="order-time">14:20</span>
                    </div>
                    <span className="order-status pago">Pago</span>
                    <span className="order-value">R$ 28.90</span>
                  </div>
                </div>
              </div>

              <div className="low-stock-card">
                <div className="card-header">
                  <div className="header-with-icon">
                    <span className="warning-icon">⚠️</span>
                    <div>
                      <h2 className="card-title">Estoque Baixo</h2>
                      <p className="card-subtitle">Produtos que precisam de reposição</p>
                    </div>
                  </div>
                </div>
                <div className="stock-list">
                  <div className="stock-item">
                    <div className="stock-info">
                      <span className="product-name">Hambúrguer Artesanal</span>
                      <span className="stock-minimum">Mínimo: 5 unidades</span>
                    </div>
                    <span className="stock-remaining">2 restante</span>
                  </div>
                  <div className="stock-item">
                    <div className="stock-info">
                      <span className="product-name">Refrigerante Lata</span>
                      <span className="stock-minimum">Mínimo: 10 unidades</span>
                    </div>
                    <span className="stock-remaining">1 restante</span>
                  </div>
                  <div className="stock-item">
                    <div className="stock-info">
                      <span className="product-name">Batata Frita</span>
                      <span className="stock-minimum">Mínimo: 3 unidades</span>
                    </div>
                    <span className="stock-remaining">0 restante</span>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="view-all-button">Ver Todos os Produtos</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard