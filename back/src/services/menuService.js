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
