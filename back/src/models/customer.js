import { DataTypes } from "sequelize";
import sequelize from "../../database.js"; // caminho correto

const Customer = sequelize.define(
  "Customer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    tableName: "customer",
  }
);

export default Customer;
