const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../database");

class Stock extends Model {
  /**
   * Verifica se o item precisa ser reabastecido
   * - baseado em reposição automática
   * - baseado na última reposição e intervalo de dias
   */
  needsRestock() {
  if (!this.autoRestock) return false; // não repor automaticamente
  if (!this.lastRestockDate) return true; // nunca reposto

  // Define intervalos por categoria
  const categoryIntervals = {
    Perishable: 2,
    Frozen: 7,
    Canned: 7,
    Bottled: 7,
    Hygiene: 14,    
    Disposable: 14,
  };

  // pega o intervalo da categoria ou mínimo de 1 dia
  let intervalDays = categoryIntervals[this.category] || 1;
  intervalDays = Math.max(intervalDays, 1); // garante pelo menos 1 dia

  const nextRestock = new Date(this.lastRestockDate);
  nextRestock.setDate(nextRestock.getDate() + intervalDays);
  return new Date() >= nextRestock;
}


  /**
   * Calcula o valor total do estoque disponível
   */
  getTotalValue() {
    return (this.quantity * this.price).toFixed(2);
  }
}

Stock.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, len: [2, 50] },
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [2, 255] },
    },

    category: {
      type: DataTypes.ENUM(
        "Perishable",
        "Frozen",
        "Canned",
        "Bottled",
        "Hygiene",        
        "Disposable"
      ),
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },

    // -------------------- Políticas de reposição --------------------
    /*restockDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7, // intervalo padrão de reposição
    },*/

    lastRestockDate: {
      type: DataTypes.DATE,
      allowNull: true, // data da última reposição
    },

    autoRestock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // por padrão, segue regras automáticas
    },
  },
  {
    sequelize,
    modelName: "Stock",
    tableName: "stocks",
    timestamps: true,
  }
);

module.exports = Stock;
