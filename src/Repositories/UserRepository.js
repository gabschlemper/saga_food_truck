/*const User  = require("../models/user");
const { Op } = require("sequelize");

class userRepository {
  constructor() {
    this.model = User;
    this.defaultAttributes = { exclude: ["passwordHash", "password"] };
  }

  // ---------- Validações ----------
  findUserOrThrow = async (id) => {
    const user = await this.model.findByPk(id);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  };

  handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    throw new Error(`${defaultMessage}: ${error.message || error}`);
  };

  // ---------- CRUD ----------
  create = async (userData) => {
    try {
      return await this.model.create(userData);
    } catch (error) {
      this.handleError(error, "Erro ao criar usuário");
    }
  };

  findById = async (id, includePassword = false) => {
    try {
      const attributes = includePassword ? {} : this.defaultAttributes;
      return await this.model.findByPk(id, { attributes });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuário por ID");
    }
  };

  update = async (id, updates) => {
    try {
      const user = await this.findUserOrThrow(id);
      await user.update(updates);
      return user;
    } catch (error) {
      this.handleError(error, "Erro ao atualizar usuário");
    }
  };

  hardDelete = async (id) => {
    try {
      const result = await this.model.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      this.handleError(error, "Erro ao excluir usuário");
    }
  };

  // ---------- BUSCAS COM FILTROS ----------
  findByEmail = async (email, includePassword = false) => {
    try {
      const attributes = includePassword ? {} : this.defaultAttributes;
      return await this.model.findOne({
        where: { email: email.toLowerCase() },
        attributes,
      });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuário por email");
    }
  };

  findByEmailExcludingId = async (email, excludeId) => {
    try {
      return await this.model.findOne({
        where: {
          email: email.toLowerCase(),
          id: { [Op.ne]: excludeId },
        },
        attributes: this.defaultAttributes,
      });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuário por email excluindo ID");
    }
  };

  findByRegistry = async (registry) => {
    try {
      return await this.model.findOne({
        where: { registry },
        attributes: this.defaultAttributes,
      });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuário por matrícula");
    }
  };

  findByRegistryExcludingId = async (registry, excludeId) => {
    try {
      return await this.model.findOne({
        where: { registry, id: { [Op.ne]: excludeId } },
        attributes: this.defaultAttributes,
      });
    } catch (error) {
      this.handleError(
        error,
        "Erro ao buscar usuário por matrícula excluindo ID"
      );
    }
  };

  emailExists = async (email) => {
    try {
      const count = await this.model.count({
        where: { email: email.toLowerCase() },
      });
      return count > 0;
    } catch (error) {
      this.handleError(error, "Erro ao verificar email");
    }
  };

  registryExists = async (registry) => {
    try {
      const count = await this.model.count({ where: { registry } });
      return count > 0;
    } catch (error) {
      this.handleError(error, "Erro ao verificar matrícula");
    }
  };

  findByType = async (userType) => {
    try {
      return await this.model.findAll({
        where: { userType: userType },
        attributes: this.defaultAttributes,
      });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuários por tipo");
    }
  };

  findByName = async (name) => {
    try {
      return await this.model.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
        attributes: this.defaultAttributes,
        order: [["name", "ASC"]],
      });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuários por nome");
    }
  };

  findAll = async () => {
    try {
      return await this.model.findAll({
        attributes: this.defaultAttributes,
        order: [["name", "ASC"]],
      });
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuários");
    }
  };

  count = async () => {
    try {
      return await this.model.count();
    } catch (error) {
      this.handleError(error, "Erro ao contar usuários");
    }
  };

  findWithPagination = async (page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await this.model.findAndCountAll({
        attributes: this.defaultAttributes,
        limit,
        offset,
        order: [["name", "ASC"]],
      });
      return {
        users: rows,
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      this.handleError(error, "Erro ao buscar usuários com paginação");
    }
  };
}

module.exports = userRepository;*/

const { User } = require("../models/User");
const { Op } = require("sequelize");

const defaultAttributes = { exclude: ["passwordHash", "password"] };

// ---------- CREATE ----------
async function create(userData) {
  return User.create(userData);
}

// ---------- FIND BY ID ----------
async function findById(id, includePassword = false) {
  const attributes = includePassword ? {} : defaultAttributes;
  return User.findByPk(id, { attributes });
}

// ---------- FIND BY EMAIL ----------
async function findByEmail(email, includePassword = false) {
  const attributes = includePassword ? {} : defaultAttributes;
  return User.findOne({ where: { email: email.toLowerCase() }, attributes });
}

// ---------- FIND ALL ----------
async function findAll() {
  return User.findAll({
    attributes: defaultAttributes,
    order: [["name", "ASC"]],
  });
}

// ---------- UPDATE ----------
async function update(id, updates) {
  const user = await findById(id, true);
  if (!user) throw new Error("not found");
  await user.update(updates);
  return user;
}

// ---------- DELETE ----------
async function hardDelete(id) {
  const deleted = await User.destroy({ where: { id } });
  return deleted > 0;
}

// ---------- EXPORTA TODAS AS FUNÇÕES ----------
module.exports = {
  create,
  findById,
  findByEmail,
  findAll,
  update,
  hardDelete,
};
