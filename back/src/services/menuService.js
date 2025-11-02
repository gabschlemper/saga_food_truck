/*const Menu = require("../models/menu");
const Stock = require("../models/stock");

const MenuService = {
  // Cria item do cardápio e estoque, se necessário
  async createMenuItem(data) {
    let stockItem = null;

    // Se não veio stockId, cria item de estoque
    if (!data.stockId) {
      stockItem = await Stock.create({
        code: `STK-${Date.now()}`,
        description: data.name,
        price: data.price,
        quantity: 0,
        unit: "unit",
        autoRestock: true,
      });
      data.stockId = stockItem.id;
    }

    // Cria o item no cardápio
    const menuItem = await Menu.create(data);

    return { menuItem, stockItem };
  },

  // Atualiza item do cardápio e sincroniza preço com estoque
  async updateMenuItem(id, data) {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) throw new Error("Item do cardápio não encontrado");

    await menuItem.update(data);

    // Se tiver stock vinculado e o preço mudou, atualiza estoque
    if (menuItem.stockId && data.price !== undefined) {
      const stockItem = await Stock.findByPk(menuItem.stockId);
      if (stockItem) {
        stockItem.price = data.price;
        await stockItem.save();
      }
    }

    return menuItem;
  },

  // Lista todos os itens do cardápio
  async getAllMenuItems() {
    return await Menu.findAll({ order: [["name", "ASC"]] });
  },

  // Busca item do cardápio por ID
  async getMenuItemById(id) {
    return await Menu.findByPk(id);
  },

  // Ativa ou desativa item do cardápio
  async toggleMenuItemActive(id) {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) throw new Error("Item do cardápio não encontrado");

    menuItem.active = !menuItem.active;
    await menuItem.save();

    return menuItem;
  },
};

module.exports = MenuService;*/

const { Menu } = require("../models/menu");
//const { Stock } = require("../models/stock");

// ------------------- CRIAR ITEM -------------------
async function createMenuItem(data) {
  try {
    // Cria o item no cardápio diretamente
    const menuItem = await Menu.create(data);
    return menuItem;
  } catch (error) {
    throw new Error(error.message || "Erro ao criar item do cardápio");
  }
}

// ------------------- ATUALIZAR ITEM -------------------
async function updateMenuItem(id, data) {
  try {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) throw new Error("Item do cardápio não encontrado");

    await menuItem.update(data);
    return menuItem;
  } catch (error) {
    throw new Error(error.message || "Erro ao atualizar item do cardápio");
  }
}

// ------------------- LISTAR TODOS -------------------
async function getAllMenuItems() {
  try {
    return await Menu.findAll({ order: [["name", "ASC"]] });
  } catch (error) {
    throw new Error(error.message || "Erro ao listar itens do cardápio");
  }
}

// ------------------- BUSCAR POR ID -------------------
async function getMenuItemById(id) {
  try {
    const menuItem = await Menu.findByPk(id);
    return menuItem;
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar item do cardápio");
  }
}

// ------------------- ATIVAR / DESATIVAR -------------------
async function toggleMenuItemActive(id) {
  try {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) throw new Error("Item do cardápio não encontrado");

    menuItem.active = !menuItem.active;
    await menuItem.save();

    return menuItem;
  } catch (error) {
    throw new Error(error.message || "Erro ao alterar status do item");
  }
}

// ------------------- EXPORTAÇÃO -------------------
module.exports = {
  createMenuItem,
  updateMenuItem,
  getAllMenuItems,
  getMenuItemById,
  toggleMenuItemActive,
};
