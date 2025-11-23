const BaseRepository = require("./baseRepository");
const Order = require("../models/Order");
const OrderItem = require("../models/orderItem");
const Customer = require("../models/customer");
const Employee = require("../models/employee");

// cria os métodos básicos: findAll, findById, create, update, delete
const base = BaseRepository(Order);

async function findWithRelations(id) {
  return Order.findByPk(id, {
    include: [
      { model: Employee, attributes: ["id", "name"] },
      { model: Customer, attributes: ["id", "name"] },
      { model: OrderItem },
    ],
  });
}

async function findAllWithRelations() {
  return Order.findAll({
    include: [{ model: Employee }, { model: Customer }, { model: OrderItem }],
  });
}

module.exports = {
  ...base,
  findWithRelations,
  findAllWithRelations,
};
