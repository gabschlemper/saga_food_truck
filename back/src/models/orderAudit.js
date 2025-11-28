import { DataTypes } from "sequelize";
import sequelize from "../../database.js"; // caminho correto

const OrderAudit = sequelize.define(
  "OrderAudit",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING, allowNull: false },
    employeeId: { type: DataTypes.INTEGER },
    previousData: { type: DataTypes.JSONB },
    newData: { type: DataTypes.JSONB },
    actionDate: { type: DataTypes.DATE },
  },
  {
    tableName: "order_audit",
    timestamps: false,
  }
);

export default OrderAudit;
