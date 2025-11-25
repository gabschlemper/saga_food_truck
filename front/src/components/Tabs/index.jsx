import "./styles.css";

export default function Tabs({ categories, active, onChange }) {
  return (
    <div className="tabs-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tab-btn ${active === cat ? "active" : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
