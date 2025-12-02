import ProductRepository from "../repositories/productRepository.js";
import { Op, Sequelize } from "sequelize";
// Buscar todos
async function getAll() {
  return ProductRepository.findAll();
}
// Buscar por ID
async function getById(id) {
  const product = await ProductRepository.findByPk(id);
  if (!product) throw new Error("Product not found");
  return product;
}
// Criar
async function create(data) {
  return ProductRepository.create(data);
}
// Atualizar
async function update(id, data) {
  const product = await getById(id);
  return product.update(data);
}
// Remover
async function remove(id) {
  const product = await getById(id);
  return product.destroy();
}
// Buscar produtos com estoque baixo
async function getLowStock() {
  return ProductRepository.findAll({
    where: {
      stock: {
        [Op.lte]: Sequelize.col("minimumStock"),
      },
    },
  });
}
// Exportações
export { getAll, getById, create, update, remove, getLowStock };

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getLowStock,
};
