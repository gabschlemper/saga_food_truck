import BaseRepository from "./baseRepository.js";
import Product from "../models/product.js";
import { Op, Sequelize } from "sequelize";

// Repositório base com CRUD (create, update, delete, findByPk, findAll, etc.)
const baseRepository = BaseRepository(Product);

const ProductRepository = {
  ...baseRepository,

  // Buscar produto por ID
  async findByPk(id, options = {}) {
    return Product.findByPk(id, { ...options });
  },

  // Buscar todos os produtos
  async findAll(options = {}) {
    return Product.findAll({ ...options });
  },

  // Buscar paginado (com count)
  async findAndCountAll(options = {}) {
    return Product.findAndCountAll({ ...options });
  },

  // Exemplo de busca com filtro (usando Op do Sequelize)
  async findByName(name) {
    return Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`, // busca case-insensitive
        },
      },
    });
  },
};

export default ProductRepository;
