const OrderAudit = require("../models/orderAudit");
const ProductAudit = require("../models/productAudit");

// ===========================================================
// CONSULTA AUDITORIA DE PEDIDOS
// ===========================================================
async function getOrderAudit(orderId) {
  return OrderAudit.findAll({
    where: { orderId },
    order: [["actionDate", "DESC"]],
  });
}

// ===========================================================
// CONSULTA AUDITORIA DE PRODUTOS
// ===========================================================
async function getProductAudit(productId) {
  return ProductAudit.findAll({
    where: { productId },
    order: [["actionDate", "DESC"]],
  });
}

// ===========================================================
// EXPORTAÇÃO (mantém compatibilidade com require atual)
// ===========================================================
module.exports = {
  getOrderAudit,
  getProductAudit,
};
