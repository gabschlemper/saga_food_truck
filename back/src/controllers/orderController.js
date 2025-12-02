import OrderService from "../services/orderService.js";
import Employee from "../models/employee.js";
import Customer from "../models/customer.js";
import OrderItem from "../models/orderItem.js";
// LISTAR PEDIDOS
async function list(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus;
    if (req.query.employeeId) where.employeeId = parseInt(req.query.employeeId);

    const { count, rows } = await OrderService.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
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

    return res.json({ data: rows, meta: { total: count, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}
// BUSCAR POR ID
async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const order = await OrderService.getById(id, {
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

    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar pedido" });
  }
}
// CRIAR PEDIDO
async function create(req, res) {
  try {
    const { customer, items, ...orderData } = req.body;
    const { order, createdCustomer } = await OrderService.create(
      orderData,
      customer,
      items
    );
    return res.status(201).json({ order, customer: createdCustomer });
  } catch (err) {
    console.error("💥 [CREATE ORDER] Erro:", err);
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
}
// ATUALIZAR PEDIDO
async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await OrderService.getById(id);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // 👇 aqui você passa o body inteiro
    await OrderService.update(id, req.body);

    const updatedOrder = await OrderService.getById(id);
    return res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
}
// REMOVER PEDIDO
async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const order = await OrderService.getById(id);

    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

    await OrderService.remove(id);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir pedido" });
  }
}
// EXPORT DEFAULT
export default {
  list,
  getById,
  create,
  update,
  remove,
};
