// src/models/User.js
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../database.cjs");

// ---------- PAPÉIS POSSÍVEIS ----------
const roles = ["admin", "cashier"];

// ---------- FUNÇÕES DE VALIDAÇÃO ----------
function validateName(value) {
  const regex = /^[A-Za-zÀ-ÿ\s'-]+$/;
  if (!regex.test(value.trim()))
    throw new Error("Nome não pode conter números ou caracteres inválidos");
}

function validateEmail(value) {
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
  if (!allowedDomains.includes(domain))
    throw new Error("Domínio de email não permitido");
  if (tempEmailDomains.includes(domain))
    throw new Error("Emails temporários não são permitidos");

  const specialCharRegex = /[<>()\[\]{};:,\\|^~`!#$%&*+=?/'"]/;
  if (specialCharRegex.test(value.split("@")[0]))
    throw new Error("Email não pode conter caracteres especiais");
}

function validatePassword(value) {
  if (value.length < 8)
    throw new Error("Senha deve ter no mínimo 8 caracteres");
  if (!/[A-Z]/.test(value))
    throw new Error("Senha deve conter pelo menos uma letra maiúscula");
  if (!/[a-z]/.test(value))
    throw new Error("Senha deve conter pelo menos uma letra minúscula");
  if (!/\d/.test(value))
    throw new Error("Senha deve conter pelo menos um número");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
    throw new Error("Senha deve conter pelo menos um caractere especial");
}

// ---------- MODELO USER ----------
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, isValidName: validateName },
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
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },

    password: {
      type: DataTypes.VIRTUAL,
      validate: { notEmpty: true, isValidPassword: validatePassword },
    },

    passwordHash: { type: DataTypes.STRING, allowNull: false },

    userType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: { isIn: [[1, 2]] },
    },

    registry: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, isInt: true, min: 1, max: 999999 },
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

// ---------- HOOKS ----------
User.beforeCreate(async (user) => {
  if (user.password) user.passwordHash = await bcrypt.hash(user.password, 10);
});

User.beforeValidate(async (user) => {
  if (user.password && !user.passwordHash) {
    user.passwordHash = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("password"))
    user.passwordHash = await bcrypt.hash(user.password, 10);
});

// ---------- MÉTODOS DE INSTÂNCIA SIMPLIFICADOS ----------
User.prototype.getRole = function () {
  return roles[this.userType - 1] || "unknown";
};

User.prototype.getPermissions = function () {
  const permissions = {
    admin: {
      orders: { create: true, read: true, update: true, delete: true },
      products: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      cashRegister: {
        open: true,
        close: true,
        read: true,
        update: true,
        delete: true,
      },
    },
    cashier: {
      orders: { create: true, read: true, update: false, delete: false },
      products: { create: false, read: true, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      cashRegister: {
        open: true,
        close: true,
        read: true,
        update: false,
        delete: false,
      },
    },
  };
  return permissions[this.getRole()] || {};
};

// ---------- EXPORTA ----------
module.exports = { User, roles };
