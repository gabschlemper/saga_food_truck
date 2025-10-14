const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../database");
const Stock = require("./Stock");

// ---------- CATEGORIAS POSSÍVEIS ----------
const categories = ["Food", "Drink", "Snack", "Dessert", "Other"];

// ---------- FUNÇÃO DE VALIDAÇÃO ----------
const validateName = (value) => {
  if (!value || value.trim().length < 2)
    throw new Error("Nome do produto deve ter no mínimo 2 caracteres");
};

// ---------- MODELO Menu ----------
class Menu extends Model {
  // ---------- MÉTODOS DE INSTÂNCIA ----------

  // Retorna o nome formatado
  getNameFormatted = () => {
    const raw = this.name;
    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : null;
  };

  // Retorna preço formatado
  getPriceFormatted = () => {
    return parseFloat(this.price).toFixed(2);
  };
}

// ---------- INICIALIZAÇÃO DO MODELO ----------
Menu.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    // Código único do item
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, isValidName: validateName },
      get() {
        const raw = this.getDataValue("name");
        return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : null;
      },
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { len: [0, 255] },
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

    // URL da imagem do produto
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    stockId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Stock, key: "id" },
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Menu",
    tableName: "menu",
    timestamps: true,
    hooks: {
      // Antes de criar o item: opcionalmente vincular ao estoque
      beforeCreate: async (menuItem) => {
        if (!menuItem.stockId) {
          const stockItem = await Stock.create({
            code: `STK-${Date.now()}`,
            description: menuItem.name,
            price: menuItem.price,
            quantity: 0,
            unit: "unit",
            autoRestock: true,
          });
          menuItem.stockId = stockItem.id;
        }
      },
      // Antes de atualizar: sincroniza preço com o estoque, se houver
      beforeUpdate: async (menuItem) => {
        if (menuItem.stockId && menuItem.changed("price")) {
          const stockItem = await Stock.findByPk(menuItem.stockId);
          if (stockItem) {
            stockItem.price = menuItem.price;
            await stockItem.save();
          }
        }
      },
    },
  }
);

module.exports = Menu;
