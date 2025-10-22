const Menu = require("../Models/Menu");

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

module.exports = MenuRepository;
