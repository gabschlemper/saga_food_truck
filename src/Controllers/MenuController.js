const menuService = require("../Services/MenuService");

const menuController = {
  // Cria um novo item do cardápio
  create: async (req, res) => {
    try {
      const data = req.body;
      const result = await MenuService.createMenuItem(data);
      res.status(201).json({
        message: "Item do cardápio criado com sucesso",
        menuItem: result.menuItem,
        stockItem: result.stockItem || null,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Atualiza item do cardápio
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const menuItem = await MenuService.updateMenuItem(id, data);
      res.status(200).json({
        message: "Item do cardápio atualizado com sucesso",
        menuItem,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lista todos os itens do cardápio
  listAll: async (req, res) => {
    try {
      const menuItems = await MenuService.getAllMenuItems();
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Busca item do cardápio por ID
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const menuItem = await MenuService.getMenuItemById(id);
      if (!menuItem) {
        return res.status(404).json({ error: "Item do cardápio não encontrado" });
      }
      res.status(200).json(menuItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Ativa ou desativa item do cardápio
  toggleActive: async (req, res) => {
    try {
      const id = req.params.id;
      const menuItem = await MenuService.toggleMenuItemActive(id);
      res.status(200).json({
        message: `Item do cardápio ${menuItem.active ? "ativado" : "desativado"} com sucesso`,
        menuItem,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = menuController;
