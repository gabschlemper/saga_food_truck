const Stock = require("../Models/Stock");

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

module.exports = StockRepository;
