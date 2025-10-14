// src/models/User.js
const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../database");

// ---------- PAPÉIS POSSÍVEIS ----------
const roles = ["admin", "cashier"]; // 1 = admin, 2 = cashier

// ---------- FUNÇÕES DE VALIDAÇÃO ----------
const validateName = (value) => {
  const regex = /^[A-Za-zÀ-ÿ\s'-]+$/;
  if (!regex.test(value.trim()))
    throw new Error("Nome não pode conter números ou caracteres inválidos");
};

const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) throw new Error("Formato de email inválido");

  const allowedDomains = [
    "gmail.com",
    "google.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
  ];

  const tempEmailDomains = [
    "tempmail.com",
    "10minutemail.com",
    "mailinator.com",
    "guerrillamail.com",
    "yopmail.com",
  ];

  const domain = value.split("@")[1].toLowerCase();

  if (!allowedDomains.includes(domain)) throw new Error("Domínio de email não permitido");
  if (tempEmailDomains.includes(domain)) throw new Error("Emails temporários não são permitidos");

  const specialCharRegex = /[<>()\[\]{};:,\\|^~`!#$%&*+=?/'"]/;
  if (specialCharRegex.test(value.split("@")[0]))
    throw new Error("Email não pode conter caracteres especiais");
};

const validatePassword = (value) => {
  if (value.length < 8) throw new Error("Senha deve ter no mínimo 8 caracteres");
  if (!/[A-Z]/.test(value)) throw new Error("Senha deve conter pelo menos uma letra maiúscula");
  if (!/[a-z]/.test(value)) throw new Error("Senha deve conter pelo menos uma letra minúscula");
  if (!/\d/.test(value)) throw new Error("Senha deve conter pelo menos um número");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
    throw new Error("Senha deve conter pelo menos um caractere especial");
};

// ---------- MODELO USER ----------
class User extends Model {
  // ---------- MÉTODOS DE INSTÂNCIA ----------
  validatePassword = async (password) => bcrypt.compare(password, this.passwordHash);
  getFullName = () => this.name;
  getRole = () => roles[this.user_Type - 1] || "unknown";
  getEmailFormatted = () => this.email.toLowerCase();

  getPermissions = () => {
    const permissions = {
      admin: {
        orders: { create: true, read: true, update: true, delete: true },
        products: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        cashRegister: { open: true, close: true, read: true, update: true, delete: true },
      },
      cashier: {
        orders: { create: true, read: true, update: false, delete: false },
        products: { create: false, read: true, update: false, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        cashRegister: { open: true, close: true, read: true, update: false, delete: false },
      },
    };
    return permissions[this.getRole()] || {};
  };
}

// ---------- INICIALIZAÇÃO DO MODELO ----------
User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [2, 100], isValidName: validateName },
      get() {
        const raw = this.getDataValue("name");
        return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : null;
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, isValidEmail: validateEmail },
      set: (value) => value.toLowerCase(),
    },

    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: { notEmpty: true, isValidPassword: validatePassword },
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },

    user_Type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2, // 1 = admin, 2 = cashier
      validate: { isIn: [[1, 2]] },
    },

    registry: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, isNumeric: true, min: 1, max: 999999 },
      get() {
        const raw = this.getDataValue("registry");
        return raw ? raw.toString().padStart(6, "0") : null;
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.passwordHash = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) user.passwordHash = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

module.exports = User;
