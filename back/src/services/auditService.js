import OrderAudit from "../models/orderAudit.js";
import ProductAudit from "../models/productAudit.js";
// CONSULTA AUDITORIA DE PEDIDO
async function getOrderAudits(orderId) {
  return OrderAudit.findAll({
    where: { orderId },
    order: [["actionDate", "DESC"]],
  });
}
// CONSULTA AUDITORIA DE PRODUTO
async function getProductAudits(productId) {
  return ProductAudit.findAll({
    where: { productId },
    order: [["actionDate", "DESC"]],
  });
}
// EXPORTAÇÃO DEFAULT
export default {
  getOrderAudits,
  getProductAudits,
};
