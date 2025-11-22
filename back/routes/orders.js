import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// GET /api/orders - List all orders with items
router.get('/', async (req, res) => {
  console.log('📋 Listando pedidos...');
  
  try {
    // Usa JOIN para retornar pedidos completos com itens agregados
    const result = await pool.query(`
      SELECT 
        o.id,
        o.customer,
        o."employeeId",
        e.name as "employeeName",
        o.total,
        o."paymentMethod",
        o."paymentStatus",
        o.status,
        o.notes,
        o."createdAt",
        o."updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi."productId",
              'name', oi.name,
              'quantity', oi.quantity,
              'price', oi.price,
              'subtotal', oi.subtotal
            ) ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN employees e ON o."employeeId" = e.id
      LEFT JOIN order_items oi ON o.id = oi."orderId"
      GROUP BY o.id, o.customer, o."employeeId", e.name, o.total,
               o."paymentMethod", o."paymentStatus", o.status, o.notes,
               o."createdAt", o."updatedAt"
      ORDER BY o.id DESC
    `);

    console.log(`✅ ${result.rows.length} pedidos encontrados`);

    // Convert numeric fields
    const orders = result.rows.map(order => ({
      ...order,
      total: parseFloat(order.total),
      items: order.items?.map(item => ({
        ...item,
        quantity: parseInt(item.quantity),
        unitprice: parseFloat(item.unitprice),
        subtotal: parseFloat(item.subtotal)
      }))
    }));

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get single order with items
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`🔍 Buscando pedido ID: ${id}`);
  
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.customer,
        o."employeeId",
        e.name as "employeeName",
        o.total,
        o."paymentMethod",
        o."paymentStatus",
        o.status,
        o.notes,
        o."createdAt",
        o."updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi."productId",
              'name', oi.name,
              'quantity', oi.quantity,
              'price', oi.price,
              'subtotal', oi.subtotal
            ) ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN employees e ON o."employeeId" = e.id
      LEFT JOIN order_items oi ON o.id = oi."orderId"
      WHERE o.id = $1
      GROUP BY o.id, o.customer, o."employeeId", e.name, o.total,
               o."paymentMethod", o."paymentStatus", o.status, o.notes,
               o."createdAt", o."updatedAt"
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    console.log(`✅ Pedido encontrado: #${id}`);

    const order = result.rows[0];

    res.json({
      success: true,
      data: {
        ...order,
        total: parseFloat(order.total),
        items: order.items?.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          unitprice: parseFloat(item.unitprice),
          subtotal: parseFloat(item.subtotal)
        }))
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/orders - Create new order with items (transação)
router.post('/', async (req, res) => {
  console.log('➕ Criando novo pedido...');
  
  const client = await pool.connect();
  
  try {
    const { customer, items, paymentMethod, employeeId, notes } = req.body;
    
    // Validações
    if (!customer || typeof customer !== 'string' || customer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Campo "customer" é obrigatório e deve ser uma string não vazia'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Campo "items" é obrigatório e deve ser um array não vazio'
      });
    }

    // Validar estrutura dos itens
    for (const item of items) {
      if (!item.productId || !item.name || !item.quantity || !item.price) {
        return res.status(400).json({
          success: false,
          message: 'Cada item deve ter: productId, name, quantity, price'
        });
      }
      if (item.quantity <= 0 || item.price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantidade deve ser > 0 e preço >= 0'
        });
      }
    }

    const validPaymentMethods = ['Pix', 'Cartão Crédito', 'Cartão Débito', 'Dinheiro'];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Forma de pagamento inválida. Opções: ${validPaymentMethods.join(', ')}`
      });
    }

    // employeeId é obrigatório no banco (NOT NULL)
    // Em produção, virá do token JWT
    // Por enquanto, usar ID 1 (admin) se não fornecido
    const finalEmployeeId = employeeId || 1;

    // Calcular total
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });
    total = parseFloat(total.toFixed(2));

    // Determinar status inicial baseado na forma de pagamento
    const paymentStatus = paymentMethod === 'Dinheiro' ? 'Pago' : 'Pendente';
    const orderStatus = paymentMethod === 'Dinheiro' ? 'Preparando' : 'Aguardando Pagamento';

    // Iniciar transação
    await client.query('BEGIN');

    // 1. Inserir pedido
    const orderResult = await client.query(`
      INSERT INTO orders (
        "employeeId", customer, total, "paymentMethod", 
        "paymentStatus", status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      finalEmployeeId,
      customer.trim(),
      total,
      paymentMethod,
      paymentStatus,
      orderStatus,
      notes || null
    ]);

    const order = orderResult.rows[0];

    // 2. Inserir itens do pedido
    const itemsInserted = [];
    for (const item of items) {
      const itemResult = await client.query(`
        INSERT INTO order_items (
          "orderId", "productId", name, quantity, price
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        order.id,
        item.productId,
        item.name,
        item.quantity,
        item.price
      ]);
      itemsInserted.push(itemResult.rows[0]);
    }

    // Commit da transação
    await client.query('COMMIT');

    // Buscar funcionário para incluir no response
    const employeeResult = await pool.query(
      'SELECT name FROM employees WHERE id = $1',
      [finalEmployeeId]
    );

    const responseData = {
      ...order,
      total: parseFloat(order.total),
      employeeName: employeeResult.rows[0]?.name || 'Desconhecido',
      items: itemsInserted.map(item => ({
        ...item,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        subtotal: parseFloat(item.subtotal)
      }))
    };

    console.log(`✅ Pedido criado: #${order.id} - ${order.customer} - Total: R$ ${order.total}`);
    
    res.status(201).json({
      success: true,
      data: responseData,
      message: 'Pedido criado com sucesso'
    });

  } catch (error) {
    // Rollback em caso de erro
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar pedido:', error);
    
    // Tratar erro de FK constraint (employeeId inválido)
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Funcionário não encontrado (employeeId inválido)'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// PUT /api/orders/:id - Update order status or payment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`✏️ Atualizando pedido ID: ${id}`);
  
  try {
    const { status, paymentStatus, notes } = req.body;

    // Validações
    const validOrderStatuses = ['Aguardando Pagamento', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'];
    const validPaymentStatuses = ['Pendente', 'Pago', 'Cancelado'];

    if (status && !validOrderStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status inválido. Opções: ${validOrderStatuses.join(', ')}`
      });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Status de pagamento inválido. Opções: ${validPaymentStatuses.join(', ')}`
      });
    }

    // Construir query dinâmica
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (paymentStatus !== undefined) {
      updates.push(`"paymentStatus" = $${paramCount++}`);
      values.push(paymentStatus);
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    // Adicionar updatedAt automático
    updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);

    // Executar update
    const result = await pool.query(`
      UPDATE orders 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Buscar pedido completo com itens
    const orderComplete = await pool.query(`
      SELECT 
        o.id,
        o.customer,
        o."employeeId",
        e.name as "employeeName",
        o.total,
        o."paymentMethod",
        o."paymentStatus",
        o.status,
        o.notes,
        o."createdAt",
        o."updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi."productId",
              'name', oi.name,
              'quantity', oi.quantity,
              'price', oi.price,
              'subtotal', oi.subtotal
            ) ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN employees e ON o."employeeId" = e.id
      LEFT JOIN order_items oi ON o.id = oi."orderId"
      WHERE o.id = $1
      GROUP BY o.id, o.customer, o."employeeId", e.name, o.total,
               o."paymentMethod", o."paymentStatus", o.status, o.notes,
               o."createdAt", o."updatedAt"
    `, [id]);

    console.log(`✅ Pedido atualizado: #${id}`);

    const updatedOrder = orderComplete.rows[0];

    res.json({
      success: true,
      data: {
        ...updatedOrder,
        total: parseFloat(updatedOrder.total),
        items: updatedOrder.items?.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          subtotal: parseFloat(item.subtotal)
        }))
      },
      message: 'Pedido atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE /api/orders/:id - Delete order (hard delete com CASCADE nos itens)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deletando pedido ID: ${id}`);
  
  try {
    // DELETE CASCADE vai remover automaticamente os order_items
    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    console.log(`✅ Pedido deletado: #${id}`);

    res.json({
      success: true,
      message: 'Pedido deletado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Erro ao deletar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

export default router;
