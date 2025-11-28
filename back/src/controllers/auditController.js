import AuditService from "../services/auditService.js";
// LISTAR AUDITORIA DE PEDIDOS
async function listOrderAudit(req, res) {
  try {
    const { orderId } = req.query;
    const where = orderId ? { orderId: parseInt(orderId) } : {};

    const rows = await AuditService.getOrderAudits(where.orderId);

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar auditoria de pedidos" });
  }
}
// LISTAR AUDITORIA DE PRODUTOS
async function listProductAudit(req, res) {
  try {
    const { productId } = req.query;
    const where = productId ? { productId: parseInt(productId) } : {};

    const rows = await AuditService.getProductAudits(where.productId);

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar auditoria de produtos" });
  }
}
// EXPORT DEFAULT
export default {
  listOrderAudit,
  listProductAudit,
};
