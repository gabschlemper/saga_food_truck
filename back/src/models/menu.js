const { DataTypes } = require("sequelize");
const { sequelize } = require("../../database.cjs");
//const { Stock } = require("./stock");

// ---------- CATEGORIAS POSSÍVEIS ----------
const categories = ["Food", "Drink", "Snack", "Dessert", "Other"];

// ---------- FUNÇÃO DE VALIDAÇÃO ----------
const validateName = (value) => {
  if (!value || value.trim().length < 2)
    throw new Error("Nome do produto deve ter no mínimo 2 caracteres");
};

// ---------- DEFINIÇÃO DO MODELO (SEM CLASSES) ----------
const Menu = sequelize.define(
  "Menu",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isValidName: validateName,
      },
      get() {
        const raw = this.getDataValue("name");
        return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : null;
      },
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255],
      },
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },

    category: {
      type: DataTypes.ENUM(...categories),
      allowNull: false,
      defaultValue: "Other",
    },

    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },

  {
    tableName: "menu",
    timestamps: true,
  }
);

// ---------- FUNÇÕES AUXILIARES EQUIVALENTES AOS MÉTODOS DE INSTÂNCIA ----------
const getNameFormatted = (menuItem) => {
  const raw = menuItem.name;
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : null;
};

const getPriceFormatted = (menuItem) => {
  return parseFloat(menuItem.price).toFixed(2);
};

// Exporta tanto o modelo quanto as funções utilitárias
module.exports = {
  Menu,
  getNameFormatted,
  getPriceFormatted,
  validateName,
  categories,
};
