import OrderRepository from "../repositories/orderRepositories.js";
import OrderItemRepository from "../repositories/orderItemRepository.js";
import EmployeeRepository from "../repositories/employeeRepository.js";
import CustomerRepository from "../repositories/customerRepository.js";
// Buscar todos os pedidos com relações
async function getAll() {
  return OrderRepository.findAll({
    include: [
      { model: EmployeeRepository, attributes: ["id", "name"] },
      { model: CustomerRepository, attributes: ["id", "name"] },
      { model: OrderItemRepository },
    ],
  });
}
// Buscar pedido por ID com itens
async function getById(id) {
  const order = await OrderRepository.findByPk(id, {
    include: [OrderItemRepository],
  });

  if (!order) throw new Error("Order not found");

  return order;
}
// Criar pedido com itens
async function create(data, items = []) {
  const order = await OrderRepository.create(data);

  if (items.length > 0) {
    for (const item of items) {
      await OrderItemRepository.create({
        ...item,
        orderId: order.id,
      });
    }
  }

  return getById(order.id);
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
// Exportações
export { getAll, getById, create, update, remove };

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
