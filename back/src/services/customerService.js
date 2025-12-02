import CustomerRepository from "../repositories/customerRepository.js";
// Buscar todos
async function getAll() {
  return CustomerRepository.findAll();
}
// Buscar por ID
async function getById(id) {
  const customer = await CustomerRepository.findByPk(id);
  if (!customer) throw new Error("Customer not found");
  return customer;
}
// Criar
async function create(data) {
  return CustomerRepository.create(data);
}
// Atualizar
async function update(id, data) {
  const customer = await getById(id);
  return customer.update(data);
}
// Remover
async function remove(id) {
  const customer = await getById(id);
  return customer.destroy();
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
