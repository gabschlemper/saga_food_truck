import { DataTypes } from "sequelize";

export default function OrderAudit(sequelize) {
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

  return OrderAudit;
}
