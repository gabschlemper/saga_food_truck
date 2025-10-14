const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../../database");
const { startOfHour, endOfHour } = require("date-fns");

// ---------- FUNÇÕES AUXILIARES ----------
const calculateTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce(
    (sum, item) => sum + (Number(item.qtd) || 0) * (Number(item.price) || 0),
    0
  );
};

const hourToLetter = (hour) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[hour] || "Z";

const generateOrderCode = async (date) => {
  const now = date instanceof Date ? date : new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const hourLetter = hourToLetter(now.getHours());

  const start = startOfHour(now);
  const end = endOfHour(now);

  const lastOrder = await Order.findOne({
    where: { date: { [Op.between]: [start, end] }, active: true },
    order: [["createdAt", "DESC"]],
  });

  let nextNumber = 1;
  if (lastOrder?.order_code) {
    const parts = lastOrder.order_code.split("-");
    const lastNumber = parseInt(parts[1], 10);
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `${yyyymmdd}${hourLetter}-${String(nextNumber).padStart(4, "0")}`;
};

// ---------- MODELO PEDIDO ----------
const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_code: {
      type: DataTypes.STRING,
      unique: true,
      // ⚠️ allowNull removido para permitir preenchimento via hook
      validate: {
        notEmpty: {
          msg: "Código do pedido não pode estar vazio",
        },
      },
    },

    customer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nome do cliente não pode estar vazio" },
        len: {
          args: [2, 100],
          msg: "Nome do cliente deve ter entre 2 e 100 caracteres",
        },
        isAlphaWithSpaces: (value) => {
          if (!/^[A-Za-zÀ-ÿ\s]+$/.test(value)) {
            throw new Error(
              "Nome do cliente deve conter apenas letras e espaços"
            );
          }
        },
      },
    },

    order_items: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isArrayOfObjects: (value) => {
          if (!Array.isArray(value)) {
            throw new Error("order_items precisa ser um array");
          }
          if (value.length === 0) {
            throw new Error("Deve haver pelo menos um item no pedido");
          }
          value.forEach((obj, i) => {
            if (typeof obj.item !== "string" || !obj.item.trim()) {
              throw new Error(
                `Item ${i + 1}: nome do produto não pode estar vazio`
              );
            }
            if (
              typeof obj.qtd !== "number" ||
              obj.qtd <= 0 ||
              !Number.isInteger(obj.qtd)
            ) {
              throw new Error(`Item ${i + 1}: quantidade inválida`);
            }
            if (typeof obj.price !== "number" || obj.price <= 0) {
              throw new Error(`Item ${i + 1}: preço inválido`);
            }
          });
        },
      },
    },

    total_payable: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const raw = this.getDataValue("total_payable");
        return raw !== null ? parseFloat(raw) : null;
      },
      validate: {
        isDecimal: { msg: "Total deve ser um valor decimal válido" },
        min: { args: [0.01], msg: "Total deve ser maior que zero" },
      },
    },

    payment_method: {
      type: DataTypes.ENUM(
        "pix",
        "cartão de crédito",
        "cartão de débito",
        "dinheiro"
      ),
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: { isDate: true },
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      validate: {
        notNull: { msg: "Usuário é obrigatório" },
      },
    },
  },
  {
    tableName: "orders",
    timestamps: true,

    hooks: {
      // Hook síncrono para preparar dados antes da validação
      beforeValidate: (order) => {
        if (!order.date) order.date = new Date();

        if (Array.isArray(order.order_items)) {
          order.total_payable = parseFloat(
            calculateTotal(order.order_items).toFixed(2)
          );
        }

        if (typeof order.paid === "string") {
          order.paid = order.paid === "true" || order.paid === "efetuado";
        }
      },

      // Hook assíncrono para gerar código do pedido
      beforeCreate: async (order) => {
        if (!order.order_code) {
          order.order_code = await generateOrderCode(order.date);
        }
      },
    },
  }
);

// ---------- MÉTODOS DE INSTÂNCIA ----------
Order.prototype.getPaymentStatus = function () {
  return this.paid ? "efetuado" : "pendente";
};

Order.prototype.markAsPaid = function () {
  this.paid = true;
  return this.save();
};

Order.prototype.markAsPending = function () {
  this.paid = false;
  return this.save();
};

// ---------- MÉTODOS ESTÁTICOS ----------
Order.findPaid = () => Order.findAll({ where: { paid: true, active: true } });
Order.findPending = () => Order.findAll({ where: { paid: false, active: true } });

module.exports = Order;
