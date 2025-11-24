import { DataTypes } from "sequelize";

export default function defineOrder(sequelize) {
  return sequelize.define(
    "Order",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: DataTypes.INTEGER, allowNull: false },
      customerId: { type: DataTypes.INTEGER },
      customer: { type: DataTypes.STRING, allowNull: false },

      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

      paymentMethod: {
        type: DataTypes.ENUM(
          "Pix",
          "Cartão Crédito",
          "Cartão Débito",
          "Dinheiro"
        ),
        allowNull: false,
      },

      paymentStatus: {
        type: DataTypes.ENUM("Pendente", "Pago", "Cancelado"),
        defaultValue: "Pendente",
      },

      status: {
        type: DataTypes.ENUM(
          "Aguardando Pagamento",
          "Preparando",
          "Pronto",
          "Entregue",
          "Cancelado"
        ),
        defaultValue: "Aguardando Pagamento",
      },

      notes: { type: DataTypes.TEXT },

      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      tableName: "orders",
    }
  );
}
