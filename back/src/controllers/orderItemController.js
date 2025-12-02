import OrderItemService from "../services/orderItemService.js";
// LISTAR ITENS DO PEDIDO
async function listByOrder(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);
    const items = await OrderItemService.listByOrder(orderId);
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar itens" });
  }
}
// ATUALIZAR QUANTIDADE DO ITEM
async function updateQuantity(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "quantity > 0 obrigatório" });
    }

    const updatedItem = await OrderItemService.updateQuantity(id, quantity);
    return res.json(updatedItem);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar quantidade do item" });
  }
}
// REMOVER ITEM DO PEDIDO
async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const removed = await OrderItemService.remove(id);

    if (!removed) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir item" });
  }
}
// EXPORT DEFAULT
export default {
  listByOrder,
  updateQuantity,
  remove,
};
