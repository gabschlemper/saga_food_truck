const MenuService = require("../services/menuService");

// ------------------- CRIAR ITEM -------------------
async function create(req, res) {
  try {
    const data = req.body;
    const result = await MenuService.createMenuItem(data);

    res.status(201).json({
      message: "Item do cardápio criado com sucesso",
      menuItem: result.menuItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// ------------------- ATUALIZAR ITEM -------------------
async function update(req, res) {
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
}

// ------------------- LISTAR TODOS -------------------
async function listAll(req, res) {
  try {
    const menuItems = await MenuService.getAllMenuItems();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------- BUSCAR POR ID -------------------
async function getById(req, res) {
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
}

// ------------------- ATIVAR / DESATIVAR -------------------
async function toggleActive(req, res) {
  try {
    const id = req.params.id;
    const menuItem = await MenuService.toggleMenuItemActive(id);

    res.status(200).json({
      message: `Item do cardápio ${
        menuItem.active ? "ativado" : "desativado"
      } com sucesso`,
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------- EXPORTAÇÃO -------------------
module.exports = {
  create,
  update,
  listAll,
  getById,
  toggleActive,
};
