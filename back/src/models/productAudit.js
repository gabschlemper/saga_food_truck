import { DataTypes } from "sequelize";
import sequelize from "../../database.js";

const ProductAudit = sequelize.define(
  "ProductAudit",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    employeeId: { type: DataTypes.INTEGER },
    fieldChanged: { type: DataTypes.STRING },
    previousValue: { type: DataTypes.TEXT },
    newValue: { type: DataTypes.TEXT },
    actionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "product_audit",
    timestamps: false,
  }
);

export default ProductAudit;
