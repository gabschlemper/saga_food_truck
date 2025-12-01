import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOrders, updateOrder } from "../../store/slices/ordersSlice";
import Sidebar from "../../components/Sidebar";
import "./styles.css";

function Orders() {
  const dispatch = useAppDispatch();
  const ordersState = useAppSelector((state) => state.orders);
  const { orders = [], loading = false, error = null } = ordersState || {};
  const [filter, setFilter] = useState("all");

  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleAddOrderClick = () => {
    setShowOrderModal(true);
  };

  const handleOrderModalClose = () => {
    setShowOrderModal(false);
  };

  console.log("Orders State:", ordersState);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pronto":
        return "status-ready";
      case "Preparando":
        return "status-preparing";
      case "Aguardando Pagamento":
        return "status-pending";
      case "Entregue":
        return "status-delivered";
      case "Cancelado":
        return "status-cancelled";
      default:
        return "status-preparing";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Pago":
        return "payment-paid";
      case "Pendente":
        return "payment-pending";
      case "Cancelado":
        return "payment-cancelled";
      default:
        return "payment-pending";
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrder({ id: orderId, orderData: { status: newStatus } }));
  };

  const handlePaymentUpdate = (orderId, newPaymentStatus) => {
    dispatch(
      updateOrder({
        id: orderId,
        orderData: { paymentStatus: newPaymentStatus },
      })
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending") return order.paymentStatus === "Pendente";
    if (filter === "preparing") return order.status === "Preparando";
    if (filter === "ready") return order.status === "Pronto";
    return true;
  });

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Pedidos</h1>
            <p className="page-subtitle">Gerencie os pedidos do food truck</p>
          </div>
          <button
            className="new-order-button"
            onClick={handleAddOrderClick} // 👉 adiciona o onClick aqui
          >
            + Novo Pedido
          </button>
        </header>

        <div className="orders-filters">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({orders.length})
          </button>
          <button
            className={`filter-button ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pagamento Pendente (
            {orders.filter((o) => o.paymentStatus === "Pendente").length})
          </button>
          <button
            className={`filter-button ${
              filter === "preparing" ? "active" : ""
            }`}
            onClick={() => setFilter("preparing")}
          >
            Preparando ({orders.filter((o) => o.status === "Preparando").length}
            )
          </button>
          <button
            className={`filter-button ${filter === "ready" ? "active" : ""}`}
            onClick={() => setFilter("ready")}
          >
            Prontos ({orders.filter((o) => o.status === "Pronto").length})
          </button>
        </div>

        <div className="orders-section">
          {loading ? (
            <div className="loading-state">🔄 Carregando pedidos...</div>
          ) : error ? (
            <div className="error-state">
              ❌ Erro ao carregar pedidos: {error}
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-time">
                      {formatTime(order.createdAt)}
                    </span>
                  </div>
                  <div className="order-customer">
                    {order.customer?.name ||
                      order.customerName ||
                      "Cliente não informado"}
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <span key={index} className="order-item">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                  <div className="order-payment">
                    <span className="payment-method">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`payment-status ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="order-footer">
                    <span className="order-total">
                      R$ {Number(order.total).toFixed(2)}
                    </span>
                    <span
                      className={`order-status ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  {order.paymentStatus === "Pago" &&
                    order.status !== "Entregue" &&
                    order.status !== "Cancelado" && (
                      <div className="order-actions">
                        {order.status === "Preparando" && (
                          <button
                            className="action-button ready-button"
                            onClick={() =>
                              handleStatusUpdate(order.id, "Pronto")
                            }
                          >
                            Marcar como Pronto
                          </button>
                        )}
                        {order.status === "Pronto" && (
                          <button
                            className="action-button deliver-button"
                            onClick={() =>
                              handleStatusUpdate(order.id, "Entregue")
                            }
                          >
                            Marcar como Entregue
                          </button>
                        )}
                      </div>
                    )}
                  {order.paymentStatus === "Pendente" && (
                    <div className="order-actions">
                      <button
                        className="action-button pay-button"
                        onClick={() => handlePaymentUpdate(order.id, "Pago")}
                      >
                        Confirmar Pagamento
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {showOrderModal && (
            <OrderModal
              isOpen={showOrderModal}
              onClose={handleOrderModalClose}
              onSubmit={(orderData) => {
                dispatch(createOrder(orderData)); // cria o pedido
                handleOrderModalClose(); // fecha modal
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
