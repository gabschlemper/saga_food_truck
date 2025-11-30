import BaseRepository from "./baseRepository.js";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Customer from "../models/customer.js";
import Employee from "../models/employee.js";

// Repositório base com CRUD (create, update, delete, findByPk, findAll, etc.)
const baseRepository = BaseRepository(Order);

// Configuração padrão de relações
const defaultRelations = [
  { model: Employee, as: "employee", attributes: ["id", "name"] },
  {
    model: Customer,
    as: "customer",
    attributes: ["id", "customerName", "email", "phone"],
  },
  { model: OrderItem, as: "items" },
];

const OrderRepository = {
  ...baseRepository,

  // Buscar pedido por ID (sem relações)
  async findByPk(id, options = {}) {
    return Order.findByPk(id, { ...options });
  },

  // Buscar pedido por ID com relações
  async findWithRelations(id, options = {}) {
    return Order.findByPk(id, { ...options, include: defaultRelations });
  },

  // Buscar todos os pedidos com relações
  async findAllWithRelations(options = {}) {
    return Order.findAll({ ...options, include: defaultRelations });
  },

  // Buscar paginado com relações
  async findAndCountAll(options = {}) {
    return Order.findAndCountAll({ ...options, include: defaultRelations });
  },
};

export default OrderRepository;
