import express from "express";
import sequelize from "./db.js";
import cors from "cors";

import defineUser from "../back/src/models/admin.js";
import defineCustomer from "../back/src/models/customer.js";
import defineEmployee from "../back/src/models/Employee.js";
import defineProduct from "../back/src/models/Product.js";
import defineOrder from "../back/src/models/Order.js";
import defineOrderItem from "../back/src/models/OrderItem.js";
import defineOrderAudit from "../back/src/models/OrderAudit.js";
import defineProductAudit from "../back/src/models/ProductAudit.js";
import admin from "../back/src/models/admin.js";

// Inicializa os modelos
const User = defineUser(sequelize);
const Customer = defineCustomer(sequelize);
const Employee = defineEmployee(sequelize);
const Product = defineProduct(sequelize);
const Order = defineOrder(sequelize);
const OrderItem = defineOrderItem(sequelize);
const OrderAudit = defineOrderAudit(sequelize);
const ProductAudit = defineProductAudit(sequelize);

// Associações
Order.belongsTo(User, { foreignKey: "adminId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });
Order.belongsTo(Employee, { foreignKey: "employeeId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// Cria app Express
const app = express();
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Porta do .env ou padrão
const PORT = process.env.PORT || 3002;

// Inicia servidor
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco estabelecida com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});

export {
  sequelize,
  Customer,
  Employee,
  Product,
  Order,
  OrderItem,
  OrderAudit,
  ProductAudit,
};
