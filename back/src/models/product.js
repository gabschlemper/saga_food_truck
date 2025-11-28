import { DataTypes } from "sequelize";
import sequelize from "../../database.js"; // caminho correto

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    minimumStock: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM(
        "Disponível",
        "Estoque Baixo",
        "Sem Estoque",
        "Em Estoque"
      ),
      defaultValue: "Disponível",
    },
    category: {
      type: DataTypes.ENUM("Lanches", "Acompanhamentos", "Bebidas", "Outros"),
      defaultValue: "Outros",
    },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "products" }
);

export default Product;
