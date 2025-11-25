import "./styles.css";

export default function OrderSidebar({ order, onRemove }) {
  const total = order.reduce((sum, item) => sum + item.price, 0);

  return (
    <aside className="order-sidebar">
      <h2>Seu pedido</h2>

      <ul>
        {order.map((item, index) => (
          <li key={index}>
            {item.name} - R${item.price.toFixed(2)}
            <button onClick={() => onRemove(index)}>X</button>
          </li>
        ))}
      </ul>

      <div className="order-total">
        Total: <strong>R${total.toFixed(2)}</strong>
      </div>
    </aside>
  );
}
