import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import './styles.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with real API call later
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          customer: 'João Silva',
          items: ['Hambúrguer Artesanal', 'Batata Frita'],
          total: 26.50,
          status: 'Preparando',
          time: '10:30'
        },
        {
          id: 2,
          customer: 'Maria Santos',
          items: ['Hot Dog Completo'],
          total: 12.00,
          status: 'Pronto',
          time: '10:25'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="dashboard-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Pedidos</h1>
            <p className="page-subtitle">Gerencie os pedidos do food truck</p>
          </div>
          <button className="new-order-button">
            + Novo Pedido
          </button>
        </header>

        <div className="orders-section">
          {loading ? (
            <div className="loading-state">
              🔄 Carregando pedidos...
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-time">{order.time}</span>
                  </div>
                  <div className="order-customer">{order.customer}</div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <span key={index} className="order-item">{item}</span>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="order-total">R$ {order.total.toFixed(2)}</span>
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
