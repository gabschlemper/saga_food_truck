const { OrderAudit, ProductAudit } = require("../models");

async function listOrderAudit(req, res) {
  try {
    const { orderId } = req.query;

    const where = orderId ? { orderId: parseInt(orderId) } : {};

    const rows = await OrderAudit.findAll({
      where,
      order: [["actionDate", "DESC"]],
    });

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar auditoria de pedidos" });
  }
}

async function listProductAudit(req, res) {
  try {
    const { productId } = req.query;

    const where = productId ? { productId: parseInt(productId) } : {};

    const rows = await ProductAudit.findAll({
      where,
      order: [["actionDate", "DESC"]],
    });

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar auditoria de produtos" });
  }
}

module.exports = {
  listOrderAudit,
  listProductAudit,
};
