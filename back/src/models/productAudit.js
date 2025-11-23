import { DataTypes } from "sequelize";

const ProductAudit = (sequelize) => {
  const ProductAudit = sequelize.define(
    "ProductAudit",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      productId: { type: DataTypes.INTEGER },
      action: { type: DataTypes.STRING, allowNull: false },
      employeeId: { type: DataTypes.INTEGER },
      fieldChanged: { type: DataTypes.STRING },
      previousValue: { type: DataTypes.TEXT },
      newValue: { type: DataTypes.TEXT },
      actionDate: { type: DataTypes.DATE },
    },
    {
      tableName: "product_audit",
      timestamps: false,
    }
  );

  return ProductAudit;
};

export default ProductAudit;
