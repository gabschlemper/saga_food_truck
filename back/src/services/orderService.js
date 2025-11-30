import { sequelize } from "../../database.js";
import OrderRepository from "../repositories/orderRepositories.js";
import OrderItem from "../models/orderItem.js";
import Employee from "../models/employee.js";
import Customer from "../models/customer.js";
// Paginação e listagem
async function findAndCountAll(options) {
  return OrderRepository.findAndCountAll({
    ...options,
    include: [
      { model: Employee, attributes: ["id", "name"] },
      { model: Customer, attributes: ["id", "name", "email", "phone"] },
      { model: OrderItem },
    ],
  });
}
// Buscar todos
async function getAll() {
  return OrderRepository.findAll({
    include: [
      { model: Employee, attributes: ["id", "name"] },
      { model: Customer, attributes: ["id", "name", "email", "phone"] },
      { model: OrderItem },
    ],
  });
}
// Buscar por ID
async function getById(id, options = {}) {
  const order = await OrderRepository.findByPk(id, {
    ...options,
    include: [
      { model: Employee, as: "employee", attributes: ["id", "name"] },
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "name", "email", "phone"],
      },
      { model: OrderItem, as: "items" },
    ],
  });

  if (!order) throw new Error("Order not found");
  return order;
}
// Criar pedido com cliente e itens
async function create(orderData, customerData, items = []) {
  return sequelize.transaction(async (t) => {
    // 1. Criar cliente
    const createdCustomer = await Customer.create(customerData, {
      transaction: t,
    });
    // 2. Criar pedido
    const order = await OrderRepository.create(
      {
        ...orderData,
        customerId: createdCustomer.id,
        customer: createdCustomer.name, // ✅ evita null
      },
      { transaction: t }
    );
    // 3. Criar itens vinculados
    if (items.length > 0) {
      for (const item of items) {
        await OrderItem.create(
          { ...item, orderId: order.id },
          { transaction: t }
        );
      }
    }
    // 4. Retornar pedido completo
    return { order, createdCustomer };
  });
}
// Atualizar pedido
async function update(id, data) {
  const order = await getById(id);
  return order.update(data);
}
// Remover pedido
async function remove(id) {
  const order = await getById(id);
  return order.destroy();
}

export { findAndCountAll, getAll, getById, create, update, remove };

export default {
  findAndCountAll,
  getAll,
  getById,
  create,
  update,
  remove,
};
