const Customer = require("../models/customer");

async function getAll() {
  return Customer.findAll();
}

async function getById(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new Error("Customer not found");
  return customer;
}

async function create(data) {
  return Customer.create(data);
}

async function update(id, data) {
  const customer = await getById(id);
  return customer.update(data);
}

async function remove(id) {
  const customer = await getById(id);
  return customer.destroy();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
