import "./styles.css";

export default function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
      {/* imagem opcional */}
      {product.image && (
        <img src={product.image} alt={product.name} className="product-image" />
      )}

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p className="price">R$ {product.price.toFixed(2).replace(".", ",")}</p>
        <p className="stock">{isOutOfStock ? "Sem estoque" : `Estoque: ${product.stock}`}</p>
      </div>

      <button
        disabled={isOutOfStock}
        onClick={() => onAdd(product)}
        className="add-btn"
      >
        {isOutOfStock ? "Sem estoque" : "Adicionar"}
      </button>
    </div>
  );
}
