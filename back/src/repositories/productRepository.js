import BaseRepository from "./baseRepository.js";
import Product from "../models/product.js";
import { Op, Sequelize } from "sequelize";

const baseRepository = BaseRepository(Product);

const ProductRepository = {
  ...baseRepository,
  // Busca produtos com estoque baixo
  async findLowStock() {
    return Product.findAll({
      where: {
        stock: {
          [Op.lte]: Sequelize.col("minimumStock"),
        },
      },
    });
  },
};

export default ProductRepository;
