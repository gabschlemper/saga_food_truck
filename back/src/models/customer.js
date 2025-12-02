import { DataTypes } from "sequelize";
import sequelize from "../../database.js"; // caminho correto

const Customer = sequelize.define(
  "Customer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "customer_name", // 👈 coluna real no banco
    },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
  },

  {
    tableName: "customer",
    timestamps: true,
    underscored: true, // gera created_at e updated_a
  }
);

export default Customer;
