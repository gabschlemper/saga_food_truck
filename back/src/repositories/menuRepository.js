/*const Menu = require("../models/menu");

const MenuRepository = {
  // Cria um novo item no banco
  async create(menuData) {
    return await Menu.create(menuData);
  },

  // Atualiza um item existente
  async update(id, data) {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) return null;
    return await menuItem.update(data);
  },

  // Busca item por ID
  async findById(id) {
    return await Menu.findByPk(id);
  },

  // Lista todos os itens
  async findAll(options = {}) {
    return await Menu.findAll({
      order: [["name", "ASC"]],
      ...options,
    });
  },

  // Ativa ou desativa um item
  async toggleActive(id) {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) return null;
    menuItem.active = !menuItem.active;
    await menuItem.save();
    return menuItem;
  },

  // Busca item pelo código
  async findByCode(code) {
    return await Menu.findOne({ where: { code } });
  },

  // Busca item pelo nome
  async findByName(name) {
    return await Menu.findOne({ where: { name } });
  },
};

module.exports = MenuRepository;*/

const { Menu } = require("../models/menu");

// ------------------- CRIAR ITEM -------------------
async function create(menuData) {
  try {
    return await Menu.create(menuData);
  } catch (error) {
    throw new Error(error.message || "Erro ao criar item no cardápio");
  }
}

// ------------------- ATUALIZAR ITEM -------------------
async function update(id, data) {
  try {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) return null;
    return await menuItem.update(data);
  } catch (error) {
    throw new Error(error.message || "Erro ao atualizar item no cardápio");
  }
}

// ------------------- BUSCAR POR ID -------------------
async function findById(id) {
  try {
    return await Menu.findByPk(id);
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar item por ID");
  }
}

// ------------------- LISTAR TODOS -------------------
async function findAll(options = {}) {
  try {
    return await Menu.findAll({
      order: [["name", "ASC"]],
      ...options,
    });
  } catch (error) {
    throw new Error(error.message || "Erro ao listar itens do cardápio");
  }
}

// ------------------- ATIVAR / DESATIVAR -------------------
async function toggleActive(id) {
  try {
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) return null;
    menuItem.active = !menuItem.active;
    await menuItem.save();
    return menuItem;
  } catch (error) {
    throw new Error(error.message || "Erro ao alterar status do item");
  }
}

// ------------------- BUSCAR POR CÓDIGO -------------------
async function findByCode(code) {
  try {
    return await Menu.findOne({ where: { code } });
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar item por código");
  }
}

// ------------------- BUSCAR POR NOME -------------------
async function findByName(name) {
  try {
    return await Menu.findOne({ where: { name } });
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar item por nome");
  }
}

// ------------------- EXPORTAÇÃO -------------------
module.exports = {
  create,
  update,
  findById,
  findAll,
  toggleActive,
  findByCode,
  findByName,
};

