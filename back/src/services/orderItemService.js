import OrderItemRepository from "../repositories/orderItemRepository.js";
// Criar novo item de pedido
async function create(data) {
  return OrderItemRepository.create(data);
}
// Remover item de pedido
async function remove(id) {
  const item = await OrderItemRepository.findByPk(id);
  if (!item) throw new Error("Item not found");
  return item.destroy();
}
// Exportações
export { create, remove };

export default {
  create,
  remove,
};
