const Product = require("../models/product");
const { Op, Sequelize } = require("sequelize");

async function getAll() {
  return Product.findAll();
}

async function getById(id) {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");
  return product;
}

async function create(data) {
  return Product.create(data);
}

async function update(id, data) {
  const product = await getById(id);
  return product.update(data);
}

async function remove(id) {
  const product = await getById(id);
  return product.destroy();
}

async function getLowStock() {
  return Product.findAll({
    where: {
      stock: {
        [Op.lte]: Sequelize.col("minimumStock"),
      },
    },
  });
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  getLowStock,
};
