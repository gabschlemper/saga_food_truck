/*const bcrypt = require("bcrypt");
const userRepository = require("../repositories/UserRepository");

class userService {
  constructor() {
    // Cria instância do repositório de usuários
    this.userRepository = new userRepository();
  }

  // ---------- Criação ----------
  // Cria um novo usuário
  createUser = async (userData) => {
    const { name, email, password, userType, registry } = userData;

    // Garante que email e matrícula sejam únicos
    await this.ensureUniqueEmail(email);
    await this.ensureUniqueRegistry(registry);

    // Cria o usuário no repositório
    const user = await this.userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      userType: userType || 4, // tipo padrão 4 se não fornecido
      registry,
    });

    // Retorna o usuário sem campos sensíveis
    return this.sanitizeUser(user);
  };

  // ---------- Buscas ----------
  // Retorna todos os usuários ativos
  getAllUsers = async () => {
    const users = await this.userRepository.findAllActive();
    return users.map((u) => this.sanitizeUser(u));
  };

  // Retorna usuário pelo ID
  getUserById = async (id) => {
    const user = await this.userRepository.findById(id);
    if (!user) throw this.notFoundError();
    return this.sanitizeUser(user);
  };

  // Retorna usuário pelo email (completo, usado para autenticação)
  getUserByEmail = async (email) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw this.notFoundError();
    return user;
  };

  // ---------- Atualizações ----------
  // Atualiza um usuário existente
  updateUser = async (id, updates) => {
    const user = await this.userRepository.findById(id);
    if (!user) throw this.notFoundError();

    // Garante email único se for alterado
    if (updates.email && updates.email !== user.email) {
      await this.ensureUniqueEmail(updates.email, id);
    }

    // Garante matrícula única se for alterada
    if (updates.registry && updates.registry !== user.registry) {
      await this.ensureUniqueRegistry(updates.registry, id);
    }

    // Remove campos que não podem ser atualizados diretamente
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.passwordHash;

    // Atualiza no repositório
    const updatedUser = await this.userRepository.update(id, safeUpdates);
    return this.sanitizeUser(updatedUser);
  };

  // Desativa (soft delete) um usuário
  deleteUser = async (id) => {
    const user = await this.userRepository.findById(id);
    if (!user) throw this.notFoundError();

    await this.userRepository.softDelete(id);
    return { message: "Usuário desativado com sucesso" };
  };

  // ---------- Senha----------
  // Valida senha do usuário
  validatePassword = async (user, password) => {
    return bcrypt.compare(password, user.passwordHash);
  };

  // Altera a senha do usuário
  changePassword = async (id, currentPassword, newPassword) => {
    const user = await this.userRepository.findById(id);
    if (!user) throw this.notFoundError();

    const valid = await this.validatePassword(user, currentPassword);
    if (!valid) throw this.validationError("Senha atual incorreta");

    await this.userRepository.update(id, { password: newPassword });
    return { message: "Senha alterada com sucesso" };
  };

  // ---------- Validações----------
  // Garante que email seja único (exceto um ID opcional)
  ensureUniqueEmail = async (email, excludeId = null) => {
    const exists = excludeId
      ? await this.userRepository.findByEmailExcludingId(email, excludeId)
      : await this.userRepository.findByEmail(email);

    if (exists) throw this.validationError("Email já cadastrado", 409);
  };

  // Garante que matrícula seja única (exceto um ID opcional)
  ensureUniqueRegistry = async (registry, excludeId = null) => {
    const exists = excludeId
      ? await this.userRepository.findByRegistryExcludingId(registry, excludeId)
      : await this.userRepository.findByRegistry(registry);

    if (exists) throw this.validationError("Matrícula já cadastrada", 409);
  };

  // Remove campos sensíveis antes de retornar o usuário
  sanitizeUser = (user) => {
    const data = user.get ? user.get() : user;
    const { passwordHash, password, ...safeUser } = data;
    return safeUser;
  };

  // Lança erro de usuário não encontrado
  notFoundError = (message = "Usuário não encontrado") => {
    const error = new Error(message);
    error.name = "NotFoundError";
    error.status = 404;
    throw error;
  };

  // Lança erro de validação
  validationError = (message, status = 400) => {
    const error = new Error(message);
    error.name = "ValidationError";
    error.status = status;
    throw error;
  };
}

module.exports = userService;*/

const { User } = require("../models/user");

// ---------- FUNÇÃO PARA REMOVER CAMPOS SENSÍVEIS ----------
function toSafeJSON(user) {
  if (!user) return null;
  const { id, name, email, userType, registry, createdAt, updatedAt } = user;
  return { id, name, email, userType, registry, createdAt, updatedAt };
}

// ---------- CREATE USER ----------
async function createUser({ name, email, password, userType = 2, registry }) {
  const user = await User.create({ name, email, password, userType, registry });
  return user;
}

// ---------- GET ALL USERS ----------
async function getAllUsers() {
  const users = await User.findAll();
  return users;
}

// ---------- GET USER BY ID ----------
async function getUserById(id) {
  const user = await User.findByPk(id);
  return user;
}

// ---------- FIND USER BY EMAIL ----------
async function findByEmail(email, includePassword = false) {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  // Se não quiser expor a senha
  if (!includePassword && user.password) {
    const safeUser = user.toJSON ? user.toJSON() : user;
    delete safeUser.password;
    return safeUser;
  }

  return user;
}

// ---------- UPDATE USER ----------
async function updateUser(id, updates) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.update(updates);
  return user;
}

// ---------- DELETE USER (soft delete ou desativação) ----------
async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return { id, deleted: true };
}

// ---------- EXPORTA TODAS AS FUNÇÕES ----------
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  findByEmail, // 👈 agora está aqui
  updateUser,
  deleteUser,
  toSafeJSON,
};

