/*require('dotenv').config();
const Order = require("../Models/Order");
const { Op } = require("sequelize");

class OrderRepository {
  constructor() {
    this.model = Order;
  }

  // ---------- VALIDAÇÕES E AUXILIARES ----------
  findOrderOrThrow = async (id) => {
    const order = await this.model.findByPk(id);
    if (!order) throw new Error("Venda não encontrada");
    return order;
  };

  handleSequelizeError = (error, defaultMessage) => {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));
      throw new Error(`Erro de validação: ${JSON.stringify(validationErrors)}`);
    }
    console.error(defaultMessage, error);
    throw new Error(defaultMessage);
  };

  // ---------- CRUD ----------
  findById = async (id) => {
    try {
      return await this.model.findByPk(id);
    } catch (error) {
      throw new Error("Erro ao buscar venda por ID");
    }
  };

  create = async (orderData) => {
    try {
      return await this.model.create(orderData);
    } catch (error) {
      this.handleSequelizeError(error, "Erro ao criar venda");
    }
    console.log("✅ [Repository] Criado com order_code:", order.order_code);
  };

  update = async (id, orderData) => {
    try {
      const order = await this.findOrderOrThrow(id);
      return await order.update(orderData);
    } catch (error) {
      this.handleSequelizeError(error, "Erro ao atualizar venda");
    }
  };

  delete = async (id) => {
    try {
      const order = await this.findOrderOrThrow(id);
      return await order.update({ active: false });
    } catch (error) {
      throw new Error("Erro ao excluir venda");
    }
  };

  restore = async (id) => {
    try {
      const order = await this.findOrderOrThrow(id);
      return await order.update({ active: true });
    } catch (error) {
      throw new Error("Erro ao restaurar venda");
    }
  };

  // ---------- CONSULTAS ESPECÍFICAS ----------
  findAllWithPagination = async (where = {}, page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      const { rows, count } = await this.model.findAndCountAll({
        where,
        limit,
        offset,
        order: [["date", "DESC"]],
      });
      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error("Erro ao buscar vendas");
    }
  };

  findByDateRange = async (startDate, endDate) => {
    try {
      const whereClause = {
        active: true,
        date: {
          [Op.gte]: new Date(startDate),
          [Op.lte]: new Date(endDate),
        },
      };
      return this.findAllWithPagination(whereClause);
    } catch (error) {
      throw new Error("Erro ao buscar vendas por intervalo de datas");
    }
  };

  findByCustomer = async (customerName) => {
    try {
      const whereClause = {
        active: true,
        customer: { [Op.like]: `%${customerName}%` },
      };
      return await this.model.findAll({
        where: whereClause,
        order: [["date", "DESC"]],
      });
    } catch (error) {
      throw new Error("Erro ao buscar vendas por cliente");
    }
  };

  getordersSummary = async () => {
    try {
      const totalorders = await this.model.count({ where: { active: true } });
      const totalRevenue = await this.model.sum("total_payable", {
        where: { active: true, paid: true },
      });
      const pendingorders = await this.model.count({
        where: { active: true, paid: false },
      });
      return { totalorders, totalRevenue: totalRevenue || 0, pendingorders };
    } catch (error) {
      throw new Error("Erro ao obter resumo de vendas");
    }
  };
  // No repository create method
async create(orderData) {
  try {
    console.log("Dados FINAIS no repository:", orderData);
    console.log("Order_code no repository:", orderData.order_code);
    
    const order = await this.model.create(orderData);
    console.log("Venda criada com sucesso:", order.order_code);
    return order;
  } catch (error) {
    console.error("ERRO NO REPOSITORY:", error);
    this.handleSequelizeError(error);
  }
}
}

module.exports = OrderRepository;*/

// Repositories/OrderRepository.js
require("dotenv").config();
const { Order } = require("../models/order");
const { Op } = require("sequelize");

function orderRepository() {
  const model = Order;

  // ---------- VALIDAÇÕES E AUXILIARES ----------
  const findOrderOrThrow = async (id) => {
    const order = await model.findByPk(id);
    if (!order) throw new Error("Venda não encontrada");
    return order;
  };

  const handleSequelizeError = (error, defaultMessage) => {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));
      throw new Error(`Erro de validação: ${JSON.stringify(validationErrors)}`);
    }
    console.error(defaultMessage, error);
    throw new Error(defaultMessage);
  };

  // ---------- CRUD ----------
  const findById = async (id) => {
    try {
      return await model.findByPk(id);
    } catch (error) {
      throw new Error("Erro ao buscar venda por ID");
    }
  };

  const create = async (orderData) => {
    try {
      console.log("Dados FINAIS no repository:", orderData);
      console.log("Order_code no repository:", orderData.order_code);

      const order = await model.create(orderData);
      console.log("✅ [Repository] Venda criada com sucesso:", order.order_code);
      return order;
    } catch (error) {
      console.error("❌ [Repository] Erro ao criar venda:", error);
      handleSequelizeError(error, "Erro ao criar venda");
    }
  };

  const update = async (id, orderData) => {
    try {
      const order = await findOrderOrThrow(id);
      return await order.update(orderData);
    } catch (error) {
      handleSequelizeError(error, "Erro ao atualizar venda");
    }
  };

  const deleteOrder = async (id) => {
    try {
      const order = await findOrderOrThrow(id);
      return await order.update({ active: false });
    } catch (error) {
      throw new Error("Erro ao excluir venda");
    }
  };

  const restore = async (id) => {
    try {
      const order = await findOrderOrThrow(id);
      return await order.update({ active: true });
    } catch (error) {
      throw new Error("Erro ao restaurar venda");
    }
  };

  // ---------- CONSULTAS ESPECÍFICAS ----------
  const findAllWithPagination = async (where = {}, page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      const { rows, count } = await model.findAndCountAll({
        where,
        limit,
        offset,
        order: [["date", "DESC"]],
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error("Erro ao buscar vendas");
    }
  };

  const findByDateRange = async (startDate, endDate) => {
    try {
      const whereClause = {
        active: true,
        date: {
          [Op.gte]: new Date(startDate),
          [Op.lte]: new Date(endDate),
        },
      };
      return findAllWithPagination(whereClause);
    } catch (error) {
      throw new Error("Erro ao buscar vendas por intervalo de datas");
    }
  };

  const findByCustomer = async (customerName) => {
    try {
      const whereClause = {
        active: true,
        customer: { [Op.like]: `%${customerName}%` },
      };
      return await model.findAll({
        where: whereClause,
        order: [["date", "DESC"]],
      });
    } catch (error) {
      throw new Error("Erro ao buscar vendas por cliente");
    }
  };

  const getOrdersSummary = async () => {
    try {
      const totalOrders = await model.count({ where: { active: true } });
      const totalRevenue = await model.sum("total_payable", {
        where: { active: true, paid: true },
      });
      const pendingOrders = await model.count({
        where: { active: true, paid: false },
      });

      return {
        totalOrders,
        totalRevenue: totalRevenue || 0,
        pendingOrders,
      };
    } catch (error) {
      throw new Error("Erro ao obter resumo de vendas");
    }
  };

  // ---------- RETORNO PÚBLICO ----------
  return {
    findById,
    create,
    update,
    delete: deleteOrder,
    restore,
    findAllWithPagination,
    findByDateRange,
    findByCustomer,
    getOrdersSummary,
  };
}

module.exports = orderRepository;
