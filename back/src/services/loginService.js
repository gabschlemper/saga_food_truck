// services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function registerService({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw { status: 400, message: "Campos obrigatórios ausentes" };
  }

  const exists = await userRepository.findByEmail(email);
  if (exists) {
    throw { status: 400, message: "Email já cadastrado" };
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    password: hash,
    role,
  });

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

async function loginService({ email, password }) {
  if (!email || !password) {
    throw { status: 400, message: "Email e senha são obrigatórios" };
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw { status: 401, message: "Credenciais inválidas" };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: "Credenciais inválidas" };
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

async function meService(id) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado" };
  }

  const { password, ...safeUser } = user.dataValues;

  return { user: safeUser };
}

module.exports = {
  registerService,
  loginService,
  meService,
};
