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
