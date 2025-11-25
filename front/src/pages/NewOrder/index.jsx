import { useState } from "react";
import ProductCard from "../../components/ProductCard";
import Tabs from "../../components/Tabs";
import Sidebar from "../../components/Sidebar";

const products = [
  { category: "Lanches", name: "X-Salada", price: 12.50 },
  { category: "Lanches", name: "X-Bacon", price: 15.00 },
  { category: "Bebidas", name: "Coca-Cola Lata", price: 6.00 },
  { category: "Bebidas", name: "Suco Natural", price: 8.00 }
];

export default function NewOrder() {
  const categories = ["Lanches", "Bebidas"];
  const [active, setActive] = useState("Lanches");
  const [order, setOrder] = useState([]);

  const filtered = products.filter(item => item.category === active);

  function addToOrder(item) {
    setOrder([...order, item]);
  }

  function removeFromOrder(index) {
    setOrder(order.filter((_, i) => i !== index));
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, padding: "20px" }}>
        <Tabs categories={categories} active={active} onChange={setActive} />

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "10px" 
        }}>
          {filtered.map((item, index) => (
            <ProductCard key={index} product={item} onAdd={addToOrder} />
          ))}
        </div>
      </div>

      <Sidebar order={order} onRemove={removeFromOrder} />
    </div>
  );
}
