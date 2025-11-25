const Order = require("../models/Order");
const OrderItem = require("../models/orderItem");
const Employee = require("../models/employee");
const Customer = require("../models/customer");

async function getAll() {
  return Order.findAll({
    include: [
      { model: Employee, attributes: ["id", "name"] },
      { model: Customer, attributes: ["id", "name"] },
      { model: OrderItem },
    ],
  });
}

async function getById(id) {
  const order = await Order.findByPk(id, {
    include: [OrderItem],
  });

  if (!order) throw new Error("Order not found");

  return order;
}

async function create(data, items = []) {
  const order = await Order.create(data);

  if (items.length > 0) {
    for (const item of items) {
      await OrderItem.create({
        ...item,
        orderId: order.id,
      });
    }
  }

  return getById(order.id); // mantém o mesmo comportamento da classe
}

async function update(id, data) {
  const order = await getById(id);
  return order.update(data);
}

async function remove(id) {
  const order = await getById(id);
  return order.destroy();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
