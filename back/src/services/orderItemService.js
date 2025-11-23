const OrderItem = require("../models/orderItem");

async function create(data) {
  return OrderItem.create(data);
}

async function remove(id) {
  const item = await OrderItem.findByPk(id);
  if (!item) throw new Error("Item not found");
  return item.destroy();
}

module.exports = {
  create,
  delete: remove,
};
// rever falta update e listagem
