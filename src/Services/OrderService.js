// Services/orderService.js
const orderRepository = require("../Repositories/OrderRepository");
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

module.exports = orderService;
