const orderService = require("../services/orderService");
const service = orderService();
const Sequelize = require("sequelize");

// Configuração do Sequelize (mantida)
const sequelize = new Sequelize("db_name", "user", "pass", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;

// ---------- FUNÇÃO DE ERROS ----------
function handleError(res, error, origin = "Controller") {
  console.error(`❌ [${origin}] Error details:`, error);

  if (error.name === "SequelizeValidationError") {
    const errors =
      error.errors?.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      })) || [];

    return res.status(400).json({
      success: false,
      message: "Dados inválidos",
      errors,
      receivedData: error.receivedData || null,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  if (error.name === "NotFoundError") {
    return res.status(404).json({ success: false, message: error.message });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Erro interno do servidor",
    errorDetails:
      process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}

// ---------- CONTROLADORES ----------
async function getAllOrders(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      customer,
      startDate,
      endDate,
      paid,
      payment_method,
    } = req.query;

    const filters = {
      customer,
      startDate,
      endDate,
      paid: paid !== undefined ? paid === "true" : undefined,
      payment_method,
    };

    console.log("📥 [Controller] getAllOrders - filtros:", filters);

    const orders = await service.getAllOrders(
      filters,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: orders.data,
      pagination: orders.pagination,
    });
  } catch (error) {
    handleError(res, error, "Controller/getAllOrders");
  }
}

async function getOrderById(req, res) {
  try {
    console.log("📥 [Controller] getOrderById:", req.params.id);
    const order = await service.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    handleError(res, error, "Controller/getOrderById");
  }
}

async function createOrder(req, res) {
  try {
    console.log("📥 [Controller] createOrder - body:", req.body);

    const { customer, order_items, payment_method } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não autenticado" });
    }

    const orderData = {
      customer,
      order_items,
      payment_method,
      userId,
      date: new Date(),
    };

    console.log("➡️ [Controller] Enviando para Service:", orderData);

    const order = await service.createOrder(orderData);

    console.log(
      "✅ [Controller] Venda criada com order_code:",
      order.order_code
    );

    res.status(201).json({
      success: true,
      message: "Venda criada com sucesso",
      data: order,
    });
  } catch (error) {
    handleError(res, error, "Controller/createOrder");
  }
}

async function updateOrder(req, res) {
  try {
    console.log("📥 [Controller] updateOrder - id:", req.params.id);
    const orderData = req.body;
    const order = await service.updateOrder(req.params.id, orderData);
    res
      .status(200)
      .json({
        success: true,
        message: "Venda atualizada com sucesso",
        data: order,
      });
  } catch (error) {
    handleError(res, error, "Controller/updateOrder");
  }
}

async function deleteOrder(req, res) {
  try {
    console.log("📥 [Controller] deleteOrder - id:", req.params.id);
    const order = await service.deleteOrder(req.params.id);
    res
      .status(200)
      .json({
        success: true,
        message: "Venda excluída com sucesso",
        data: order,
      });
  } catch (error) {
    handleError(res, error, "Controller/deleteOrder");
  }
}

async function markAsPaid(req, res) {
  try {
    console.log("📥 [Controller] markAsPaid - id:", req.params.id);
    const order = await service.markAsPaid(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Venda marcada como paga", data: order });
  } catch (error) {
    handleError(res, error, "Controller/markAsPaid");
  }
}

async function markAsPending(req, res) {
  try {
    console.log("📥 [Controller] markAsPending - id:", req.params.id);
    const order = await service.markAsPending(req.params.id);
    res
      .status(200)
      .json({
        success: true,
        message: "Venda marcada como pendente",
        data: order,
      });
  } catch (error) {
    handleError(res, error, "Controller/markAsPending");
  }
}

async function getOrdersByPaymentStatus(req, res) {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    console.log("📥 [Controller] getOrdersByPaymentStatus - status:", status);

    if (!["paid", "pending"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Status deve ser "paid" ou "pending"',
        });
    }

    const orders = await service.getOrdersByPaymentStatus(
      status === "paid",
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: orders.data,
      pagination: orders.pagination,
    });
  } catch (error) {
    handleError(res, error, "Controller/getOrdersByPaymentStatus");
  }
}

// ---------- EXPORTAÇÃO ----------
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  markAsPaid,
  markAsPending,
  getOrdersByPaymentStatus,
};
