const Employee = require("../models/employee");

async function getAll() {
  return Employee.findAll();
}

async function getById(id) {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}

async function create(data) {
  return Employee.create(data);
}

async function update(id, data) {
  const employee = await getById(id);
  return employee.update(data);
}

async function remove(id) {
  const employee = await getById(id);
  return employee.destroy();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
