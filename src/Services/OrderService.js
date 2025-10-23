/*const orderRepository = require("../Repositories/OrderRepository");
const { Op } = require("sequelize");

class orderService {
  constructor() {
    this.repository = new orderRepository();
    this.allowedPaymentMethods = ["pix", "cartão de crédito", "cartão de débito", "dinheiro"];
  }

  validationError = (message) => ({ name: "ValidationError", message, status: 400 });
  notFoundError = (message) => ({ name: "NotFoundError", message, status: 404 });

  validateOrderData = (order) => {
    if (!order) throw this.validationError("Dados da venda são obrigatórios");

    if (!order.customer || order.customer.trim() === "") {
      throw this.validationError("Nome do cliente é obrigatório");
    }

    if (!order.order_items || !Array.isArray(order.order_items) || order.order_items.length === 0) {
      throw this.validationError("Pedido deve conter pelo menos um item");
    }

    order.order_items.forEach((item, i) => {
      if (!item.item || item.item.trim() === "") {
        throw this.validationError(`Item ${i + 1}: nome do produto é obrigatório`);
      }
      if (!Number.isInteger(item.qtd) || item.qtd <= 0) {
        throw this.validationError(`Item ${i + 1}: quantidade inválida`);
      }
      if (typeof item.price !== "number" || item.price <= 0) {
        throw this.validationError(`Item ${i + 1}: preço inválido`);
      }
    });

    if (!order.payment_method || !this.allowedPaymentMethods.includes(order.payment_method)) {
      throw this.validationError("Método de pagamento válido é obrigatório");
    }

    if (!order.userId) {
      throw this.validationError("Usuário é obrigatório");
    }

    return true;
  };

  validateOrderId = (id) => {
    if (!id || isNaN(parseInt(id)))
      throw this.validationError("ID de venda válido é obrigatório");
  };

  ensureOrderExists = async (id) => {
    const order = await this.repository.findById(id);
    if (!order || !order.active) throw this.notFoundError(`Venda com ID ${id} não encontrada`);
    return order;
  };

  getAllOrders = async (filters = {}, page = 1, limit = 10) => {
    const where = { active: true };
    if (filters.customer) where.customer = { [Op.like]: `%${filters.customer}%` };
    if (filters.paid !== undefined) where.paid = filters.paid;
    if (filters.payment_method) where.payment_method = filters.payment_method;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date[Op.gte] = new Date(filters.startDate);
      if (filters.endDate) where.date[Op.lte] = new Date(filters.endDate);
    }
    return this.repository.findAllWithPagination(where, page, limit);
  };

  getOrderById = async (id) => {
    this.validateOrderId(id);
    return this.ensureOrderExists(id);
  };

  createOrder = async (orderData) => {
    try {
      console.log("🟡 [Service] createOrder - recebido:", orderData);
      this.validateOrderData(orderData);

      // Não geramos order_code aqui: o Model tem hook beforeValidate que o faz.
      const created = await this.repository.create(orderData);
      console.log("✅ [Service] createOrder - criado:", created.order_code);
      return created;
    } catch (error) {
      console.error("❌ [Service] Erro:", error);
      // se for erro de validação do repo/Sequelize, deixe passar (já tem name)
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  updateOrder = async (id, orderData) => {
    try {
      this.validateOrderId(id);
      await this.ensureOrderExists(id);
      return this.repository.update(id, orderData);
    } catch (error) {
      console.error("❌ [Service] updateOrder erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  deleteOrder = async (id) => {
    try {
      this.validateOrderId(id);
      await this.ensureOrderExists(id);
      return this.repository.delete(id);
    } catch (error) {
      console.error("❌ [Service] deleteOrder erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  markAsPaid = async (id) => {
    try {
      this.validateOrderId(id);
      await this.ensureOrderExists(id);
      return this.repository.update(id, { paid: true });
    } catch (error) {
      console.error("❌ [Service] markAsPaid erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  markAsPending = async (id) => {
    try {
      this.validateOrderId(id);
      await this.ensureOrderExists(id);
      return this.repository.update(id, { paid: false });
    } catch (error) {
      console.error("❌ [Service] markAsPending erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  getOrdersByPaymentStatus = async (paid, page = 1, limit = 10) => {
    const where = { active: true, paid };
    return this.repository.findAllWithPagination(where, page, limit);
  };
}

module.exports = orderService;*/

// Services/OrderService.js
const orderRepository = require("../repositories/orderRepository");
const { Op } = require("sequelize");

function orderService() {
  const repository = orderRepository(); // ✅ Agora o repository também deve ser funcional
  const allowedPaymentMethods = [
    "pix",
    "cartão de crédito",
    "cartão de débito",
    "dinheiro",
  ];

  // ---------- ERROS ----------
  const validationError = (message) => ({
    name: "ValidationError",
    message,
    status: 400,
  });

  const notFoundError = (message) => ({
    name: "NotFoundError",
    message,
    status: 404,
  });

  // ---------- VALIDAÇÕES ----------
  const validateOrderData = (order) => {
    if (!order) throw validationError("Dados da venda são obrigatórios");

    if (!order.customer || order.customer.trim() === "") {
      throw validationError("Nome do cliente é obrigatório");
    }

    if (
      !order.order_items ||
      !Array.isArray(order.order_items) ||
      order.order_items.length === 0
    ) {
      throw validationError("Pedido deve conter pelo menos um item");
    }

    order.order_items.forEach((item, i) => {
      if (!item.item || item.item.trim() === "") {
        throw validationError(`Item ${i + 1}: nome do produto é obrigatório`);
      }
      if (!Number.isInteger(item.qtd) || item.qtd <= 0) {
        throw validationError(`Item ${i + 1}: quantidade inválida`);
      }
      if (typeof item.price !== "number" || item.price <= 0) {
        throw validationError(`Item ${i + 1}: preço inválido`);
      }
    });

    if (
      !order.payment_method ||
      !allowedPaymentMethods.includes(order.payment_method)
    ) {
      throw validationError("Método de pagamento válido é obrigatório");
    }

    if (!order.userId) {
      throw validationError("Usuário é obrigatório");
    }

    return true;
  };

  const validateOrderId = (id) => {
    if (!id || isNaN(parseInt(id))) {
      throw validationError("ID de venda válido é obrigatório");
    }
  };

  const ensureOrderExists = async (id) => {
    const order = await repository.findById(id);
    if (!order || !order.active)
      throw notFoundError(`Venda com ID ${id} não encontrada`);
    return order;
  };

  // ---------- MÉTODOS PRINCIPAIS ----------
  const getAllOrders = async (filters = {}, page = 1, limit = 10) => {
    const where = { active: true };

    if (filters.customer) where.customer = { [Op.like]: `%${filters.customer}%` };
    if (filters.paid !== undefined) where.paid = filters.paid;
    if (filters.payment_method) where.payment_method = filters.payment_method;

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date[Op.gte] = new Date(filters.startDate);
      if (filters.endDate) where.date[Op.lte] = new Date(filters.endDate);
    }

    return repository.findAllWithPagination(where, page, limit);
  };

  const getOrderById = async (id) => {
    validateOrderId(id);
    return ensureOrderExists(id);
  };

  const createOrder = async (orderData) => {
    try {
      console.log("🟡 [Service] createOrder - recebido:", orderData);
      validateOrderData(orderData);

      // O Model já gera o order_code via hook
      const created = await repository.create(orderData);
      console.log("✅ [Service] createOrder - criado:", created.order_code);
      return created;
    } catch (error) {
      console.error("❌ [Service] Erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      validateOrderId(id);
      await ensureOrderExists(id);
      return repository.update(id, orderData);
    } catch (error) {
      console.error("❌ [Service] updateOrder erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      validateOrderId(id);
      await ensureOrderExists(id);
      return repository.delete(id);
    } catch (error) {
      console.error("❌ [Service] deleteOrder erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  const markAsPaid = async (id) => {
    try {
      validateOrderId(id);
      await ensureOrderExists(id);
      return repository.update(id, { paid: true });
    } catch (error) {
      console.error("❌ [Service] markAsPaid erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  const markAsPending = async (id) => {
    try {
      validateOrderId(id);
      await ensureOrderExists(id);
      return repository.update(id, { paid: false });
    } catch (error) {
      console.error("❌ [Service] markAsPending erro:", error);
      if (!error.name) error.name = "ServiceError";
      throw error;
    }
  };

  const getOrdersByPaymentStatus = async (paid, page = 1, limit = 10) => {
    const where = { active: true, paid };
    return repository.findAllWithPagination(where, page, limit);
  };

  // ---------- RETORNO PÚBLICO ----------
  return {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    markAsPaid,
    markAsPending,
    getOrdersByPaymentStatus,
  };
}

module.exports = orderService;
