import { DataTypes } from "sequelize";
import sequelize from "../../database.js";
// Importar os outros models
import Employee from "./employee.js";
import Customer from "./customer.js";
import OrderItem from "./orderItem.js";

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: true }, // pode ser nulo
    customerName: { type: DataTypes.STRING, allowNull: true }, // 👈 renomeado para evitar colisão

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
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

// 🔗 Associações
Order.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });
Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });

export default Order;
