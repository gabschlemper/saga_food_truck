const OrderAudit = require("../models/orderAudit");
const ProductAudit = require("../models/productAudit");

async function getOrderAudits(orderId) {
  return OrderAudit.findAll({
    where: { orderId },
    order: [["actionDate", "DESC"]],
  });
}

async function getProductAudits(productId) {
  return ProductAudit.findAll({
    where: { productId },
    order: [["actionDate", "DESC"]],
  });
}

module.exports = {
  getOrderAudits,
  getProductAudits,
};
