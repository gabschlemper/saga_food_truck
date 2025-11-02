/*const Stock = require("../models/stock");

const StockRepository = {
  // Cria um novo item de estoque
  async create(stockData) {
    return await Stock.create(stockData);
  },

  // Atualiza um item existente
  async update(id, data) {
    const stockItem = await Stock.findByPk(id);
    if (!stockItem) return null;
    return await stockItem.update(data);
  },

  // Busca item por ID
  async findById(id) {
    return await Stock.findByPk(id);
  },

  // Busca item pelo código
  async findByCode(code) {
    return await Stock.findOne({ where: { code } });
  },

  // Lista todos os itens do estoque
  async findAll(options = {}) {
    return await Stock.findAll({
      order: [["description", "ASC"]],
      ...options,
    });
  },

  // Remove item do estoque
  async delete(id) {
    const stockItem = await Stock.findByPk(id);
    if (!stockItem) return null;
    await stockItem.destroy();
    return stockItem;
  },
};

module.exports = StockRepository;*/

const { Stock } = require("../models/stock");

// -------------------- Cria um novo item de estoque --------------------
async function createStock(stockData) {
  try {
    const stockItem = await Stock.create(stockData);
    return stockItem;
  } catch (err) {
    console.error("Erro ao criar item de estoque:", err.message);
    throw err;
  }
}

// -------------------- Atualiza um item existente --------------------
async function updateStock(id, data) {
  try {
    const stockItem = await Stock.findByPk(id);
    if (!stockItem) return null;
    return await stockItem.update(data);
  } catch (err) {
    console.error("Erro ao atualizar item de estoque:", err.message);
    throw err;
  }
}

// -------------------- Busca item por ID --------------------
async function findStockById(id) {
  try {
    return await Stock.findByPk(id);
  } catch (err) {
    console.error("Erro ao buscar item de estoque por ID:", err.message);
    throw err;
  }
}

// -------------------- Busca item pelo código --------------------
async function findStockByCode(code) {
  try {
    return await Stock.findOne({ where: { code } });
  } catch (err) {
    console.error("Erro ao buscar item de estoque por código:", err.message);
    throw err;
  }
}

// -------------------- Lista todos os itens do estoque --------------------
async function findAllStocks(options = {}) {
  try {
    return await Stock.findAll({
      order: [["description", "ASC"]],
      ...options,
    });
  } catch (err) {
    console.error("Erro ao listar itens de estoque:", err.message);
    throw err;
  }
}

// -------------------- Remove item do estoque --------------------
async function deleteStock(id) {
  try {
    const stockItem = await Stock.findByPk(id);
    if (!stockItem) return null;
    await stockItem.destroy();
    return stockItem;
  } catch (err) {
    console.error("Erro ao remover item de estoque:", err.message);
    throw err;
  }
}

// -------------------- Exportação --------------------
module.exports = {
  createStock,
  updateStock,
  findStockById,
  findStockByCode,
  findAllStocks,
  deleteStock,
};
