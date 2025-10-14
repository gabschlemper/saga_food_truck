const stock = require("../Models/Stock");
const stockAlert = require("../Job/StockAlert");

const stockController = {
  // Listar todos os itens do estoque
  async index(req, res) {
    try {
      const stocks = await Stock.findAll();
      return res.json(stocks);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Criar novo item no estoque
  async create(req, res) {
    try {
      const stock = await Stock.create(req.body);
      return res.status(201).json(stock);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // Atualizar item do estoque
  async update(req, res) {
    try {
      const { id } = req.params;
      const stock = await Stock.findByPk(id);
      if (!stock) return res.status(404).json({ error: "Item não encontrado" });

      await stock.update(req.body);
      return res.json(stock);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // Registrar saída do estoque (venda, desperdício, higiene, etc.)
  async decrease(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const stock = await Stock.findByPk(id);
      if (!stock) return res.status(404).json({ error: "Item não encontrado" });

      if (quantity > stock.quantity) return res.status(400).json({ error: "Quantidade insuficiente" });

      stock.quantity -= quantity;
      await stock.save();

      return res.json(stock);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // Consultar alertas de reposição
  async alerts(req, res) {
    try {
      const alerts = await StockAlert.findAll({ include: Stock });
      return res.json(alerts);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = stockController;
