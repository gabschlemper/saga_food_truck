const { OrderItem, Order, Product, sequelize } = require("../models");

// =========================================================
// LISTAR ITENS DO PEDIDO
// =========================================================
async function listByOrder(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);
    const items = await OrderItem.findAll({ where: { orderId } });
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar itens" });
  }
}

// =========================================================
// ATUALIZAR QUANTIDADE DO ITEM
// =========================================================
async function updateQuantity(req, res) {
  const t = await sequelize.transaction();
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      await t.rollback();
      return res.status(400).json({ error: "quantity > 0 obrigatório" });
    }

    const item = await OrderItem.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: "Item não encontrado" });
    }

    const product = await Product.findByPk(item.productId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ error: "Produto do item não encontrado" });
    }

    // cálculo de estoque
    const oldQty = item.quantity;
    const diff = quantity - oldQty;

    if (diff > 0 && product.stock < diff) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Estoque insuficiente para aumentar quantidade" });
    }

    await product.update({ stock: product.stock - diff }, { transaction: t });

    // recalcular subtotal
    const priceCents = Math.round(parseFloat(item.price) * 100);
    const newSubtotalCents = priceCents * quantity;

    await item.update(
      {
        quantity,
        subtotal: (newSubtotalCents / 100).toFixed(2),
      },
      { transaction: t }
    );

    // recalcular total do pedido
    const orderItems = await OrderItem.findAll({
      where: { orderId: item.orderId },
      transaction: t,
    });

    let totalCents = 0;
    for (const it of orderItems) {
      totalCents += Math.round(parseFloat(it.subtotal) * 100);
    }

    await Order.update(
      { total: (totalCents / 100).toFixed(2) },
      { where: { id: item.orderId }, transaction: t }
    );

    await t.commit();
    return res.json(item);
  } catch (err) {
    console.error(err);
    try {
      await t.rollback();
    } catch {}
    return res
      .status(500)
      .json({ error: "Erro ao atualizar quantidade do item" });
  }
}

// =========================================================
// REMOVER ITEM DO PEDIDO
// =========================================================
async function remove(req, res) {
  const t = await sequelize.transaction();
  try {
    const id = parseInt(req.params.id);

    const item = await OrderItem.findByPk(id, { transaction: t });
    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: "Item não encontrado" });
    }

    const product = await Product.findByPk(item.productId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (product) {
      await product.update(
        { stock: product.stock + item.quantity },
        { transaction: t }
      );
    }

    await item.destroy({ transaction: t });

    // recalcular total do pedido
    const orderItems = await OrderItem.findAll({
      where: { orderId: item.orderId },
      transaction: t,
    });

    let totalCents = 0;
    for (const it of orderItems) {
      totalCents += Math.round(parseFloat(it.subtotal) * 100);
    }

    await Order.update(
      { total: (totalCents / 100).toFixed(2) },
      { where: { id: item.orderId }, transaction: t }
    );

    await t.commit();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    try {
      await t.rollback();
    } catch {}
    return res.status(500).json({ error: "Erro ao excluir item" });
  }
}

// =========================================================
// EXPORTAR COMO MÓDULO DE FUNÇÕES (SEM CLASSE)
// =========================================================
module.exports = {
  listByOrder,
  updateQuantity,
  remove,
};
