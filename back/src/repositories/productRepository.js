const BaseRepository = require("./baseRepository");
const Product = require("../models/product");
const { Op, Sequelize } = require("sequelize");

// Reaproveita os métodos base: findAll, findById, create, update, delete
const base = BaseRepository(Product);

async function findLowStock() {
  return Product.findAll({
    where: {
      stock: {
        [Op.lte]: Sequelize.col("minimumStock"),
      },
    },
  });
}

module.exports = {
  ...base,
  findLowStock,
};
