import express from 'express';

const router = express.Router();

// Mock orders data
let orders = [
  {
    id: 1,
    customer: 'João Silva',
    items: [
      { productId: 1, name: 'Hambúrguer Artesanal', quantity: 1, price: 18.50 },
      { productId: 2, name: 'Batata Frita', quantity: 1, price: 8.00 }
    ],
    total: 26.50,
    paymentMethod: 'Pix',
    paymentStatus: 'Pago',
    status: 'Preparando',
    createdAt: new Date('2024-01-15T10:30:00').toISOString(),
    updatedAt: new Date('2024-01-15T10:30:00').toISOString()
  },
  {
    id: 2,
    customer: 'Maria Santos',
    items: [
      { productId: 4, name: 'Hot Dog Completo', quantity: 1, price: 12.00 }
    ],
    total: 12.00,
    paymentMethod: 'Dinheiro',
    paymentStatus: 'Pago',
    status: 'Pronto',
    createdAt: new Date('2024-01-15T10:25:00').toISOString(),
    updatedAt: new Date('2024-01-15T10:35:00').toISOString()
  }
];

// GET /api/orders - List all orders
router.get('/', (req, res) => {
  console.log('📋 Listando pedidos...');
  
  try {
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/orders/:id - Update order status or payment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`✏️ Atualizando pedido ID: ${id}`);
  
  try {
    const orderIndex = orders.findIndex(o => o.id === parseInt(id));
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const { status, paymentStatus } = req.body;
    const order = orders[orderIndex];

    // Update status
    if (status) {
      if (!['Aguardando Pagamento', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
      }
      order.status = status;
    }

    // Update payment status
    if (paymentStatus) {
      if (!['Pendente', 'Pago', 'Cancelado'].includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Status de pagamento inválido'
        });
      }
      order.paymentStatus = paymentStatus;
    }

    order.updatedAt = new Date().toISOString();
    orders[orderIndex] = order;

    console.log(`✅ Pedido atualizado: #${order.id}`);
    
    res.json({
      success: true,
      data: order,
      message: 'Pedido atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/orders - Create new order
router.post('/', (req, res) => {
  console.log('➕ Criando novo pedido...');
  
  try {
    const { customer, items, paymentMethod } = req.body;
    
    // Validation
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: customer, items (array não vazio)'
      });
    }

    if (!paymentMethod || !['Pix', 'Cartão Crédito', 'Cartão Débito', 'Dinheiro'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Forma de pagamento inválida'
      });
    }

    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });

    const newOrder = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      customer: customer.trim(),
      items,
      total: parseFloat(total.toFixed(2)),
      paymentMethod,
      paymentStatus: paymentMethod === 'Dinheiro' ? 'Pago' : 'Pendente',
      status: paymentMethod === 'Dinheiro' ? 'Preparando' : 'Aguardando Pagamento',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    console.log(`✅ Pedido criado: #${newOrder.id} - ${newOrder.customer}`);
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Pedido criado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
