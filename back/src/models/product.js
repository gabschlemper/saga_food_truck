import { DataTypes } from "sequelize";

const Product = (sequelize) => {
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
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      tableName: "products",
    }
  );

  return Product;
};

export default Product;
