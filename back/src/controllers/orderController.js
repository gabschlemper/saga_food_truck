const {
  Order,
  OrderItem,
  Product,
  Employee,
  Customer,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * LISTAR PEDIDOS
 */
async function list(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus;
    if (req.query.employeeId) where.employeeId = parseInt(req.query.employeeId);

    const { count, rows } = await Order.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [
        { model: Employee, attributes: ["id", "name"] },
        { model: Customer, attributes: ["id", "name"] },
      ],
    });

    return res.json({ data: rows, meta: { total: count, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

/**
 * BUSCAR POR ID
 */
async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const order = await Order.findByPk(id, {
      include: [
        { model: Employee, attributes: ["id", "name"] },
        { model: Customer, attributes: ["id", "name"] },
        { model: OrderItem },
      ],
    });

    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar pedido" });
  }
}

/**
 * CRIAR PEDIDO
 */
async function create(req, res) {
  const t = await sequelize.transaction();

  try {
    const {
      employeeId,
      customerId = null,
      customer,
      paymentMethod,
      paymentStatus = "Pendente",
      notes = "",
      items,
    } = req.body;

    if (!employeeId) {
      await t.rollback();
      return res.status(400).json({ error: "employeeId é obrigatório" });
    }

    if (!customer && !customerId) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "customer (nome) ou customerId é obrigatório" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: "items (array) obrigatório" });
    }

    const order = await Order.create(
      {
        employeeId,
        customerId,
        customer,
        total: 0,
        paymentMethod,
        paymentStatus,
        notes,
      },
      { transaction: t }
    );

    let totalCents = 0;

    for (const it of items) {
      const productId = parseInt(it.productId);
      const quantity = parseInt(it.quantity);

      if (!productId || !quantity || quantity <= 0) {
        await t.rollback();
        return res.status(400).json({
          error: "Cada item precisa de productId e quantity > 0",
        });
      }

      const product = await Product.findByPk(productId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!product) {
        await t.rollback();
        return res
          .status(400)
          .json({ error: `Produto ${productId} não encontrado` });
      }

      const price = it.price != null ? it.price : product.price;

      const priceCents = Math.round(parseFloat(price) * 100);
      const subtotalCents = priceCents * quantity;

      await OrderItem.create(
        {
          orderId: order.id,
          productId,
          name: product.name,
          quantity,
          price: (priceCents / 100).toFixed(2),
          subtotal: (subtotalCents / 100).toFixed(2),
        },
        { transaction: t }
      );

      const newStock = product.stock - quantity;
      if (newStock < 0) {
        await t.rollback();
        return res.status(400).json({
          error: `Estoque insuficiente para produto ${product.name}`,
        });
      }

      await product.update({ stock: newStock }, { transaction: t });

      totalCents += subtotalCents;
    }

    await order.update(
      { total: (totalCents / 100).toFixed(2) },
      { transaction: t }
    );

    await t.commit();

    const created = await Order.findByPk(order.id, { include: [OrderItem] });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    try {
      await t.rollback();
    } catch {}
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
}

/**
 * ATUALIZAR PEDIDO
 */
async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const order = await Order.findByPk(id);

    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

    const { status, paymentStatus, paymentMethod, notes } = req.body;

    await order.update({ status, paymentStatus, paymentMethod, notes });

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
}

/**
 * REMOVER PEDIDO (com reestorno de estoque)
 */
async function remove(req, res) {
  const t = await sequelize.transaction();

  try {
    const id = parseInt(req.params.id);

    const order = await Order.findByPk(id, {
      include: [OrderItem],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    for (const item of order.OrderItems) {
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
    }

    await OrderItem.destroy(
      { where: { orderId: order.id } },
      { transaction: t }
    );

    await order.destroy({ transaction: t });

    await t.commit();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    try {
      await t.rollback();
    } catch {}
    return res.status(500).json({ error: "Erro ao excluir pedido" });
  }
}

/**
 * EXPORTAÇÃO COMO FUNÇÕES
 */
module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
