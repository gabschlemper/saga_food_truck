import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database.js';
import productsRoutes from './routes/products.js';
import authRoutes from './routes/authRoutes.js';
import ordersRoutes from './routes/orders.js';

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
const PORT = process.env.PORT || 3000;

// Test database connection on startup (não bloqueia o servidor)
testConnection().catch(err => {
  console.error('⚠️ Erro na conexão inicial, mas servidor continuará rodando:', err.message);
});

// CORS middleware - must be before routes (permite file:// para teste local)
app.use(cors({
  origin: true, // Aceita qualquer origem em desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
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
