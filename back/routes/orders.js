import express from 'express';

const router = express.Router();

// Mock database for orders
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
  },
  {
    id: 3,
    customer: 'Ana Costa',
    items: [
      { productId: 1, name: 'Hambúrguer Artesanal', quantity: 2, price: 18.50 },
      { productId: 3, name: 'Refrigerante Lata', quantity: 2, price: 4.50 }
    ],
    total: 46.00,
    paymentMethod: 'Cartão Crédito',
    paymentStatus: 'Pendente',
    status: 'Aguardando Pagamento',
    createdAt: new Date('2024-01-15T11:00:00').toISOString(),
    updatedAt: new Date('2024-01-15T11:00:00').toISOString()
  }
];

import { getProducts, updateProductStock } from './products.js';

// GET /api/orders - List all orders with optional filters
router.get('/', (req, res) => {
  console.log('📋 Listando pedidos...');
  
  try {
    const { status, paymentStatus, date } = req.query;
    let filteredOrders = [...orders];

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by payment status
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(order => 
        order.paymentStatus.toLowerCase() === paymentStatus.toLowerCase()
      );
    }

    // Filter by date (RF0006)
    if (date) {
      const filterDate = new Date(date).toDateString();
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt).toDateString() === filterDate
      );
    }

    // Sort by most recent
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: filteredOrders,
      count: filteredOrders.length
    });
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/orders - Create new order (RF0001, RF0002, RF0003)
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
        message: 'Forma de pagamento inválida. Use: Pix, Cartão Crédito, Cartão Débito ou Dinheiro'
      });
    }

    // Get current products for stock validation
    const products = getProducts();
    let total = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Produto com ID ${item.productId} não encontrado`
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantidade deve ser maior que zero'
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const newOrder = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      customer: customer.trim(),
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      paymentMethod,
      paymentStatus: paymentMethod === 'Dinheiro' ? 'Pago' : 'Pendente',
      status: paymentMethod === 'Dinheiro' ? 'Preparando' : 'Aguardando Pagamento',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);

    // Update stock only if payment is confirmed (RF0003)
    if (newOrder.paymentStatus === 'Pago') {
      for (const item of orderItems) {
        updateProductStock(item.productId, item.quantity);
      }
    }

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

    // Update payment status (RF0002)
    if (paymentStatus) {
      if (!['Pendente', 'Pago', 'Cancelado'].includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Status de pagamento inválido'
        });
      }

      const oldPaymentStatus = order.paymentStatus;
      order.paymentStatus = paymentStatus;

      // If payment confirmed, update stock and change status (RF0003)
      if (oldPaymentStatus === 'Pendente' && paymentStatus === 'Pago') {
        for (const item of order.items) {
          updateProductStock(item.productId, item.quantity);
        }
        order.status = 'Preparando';
      }
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

// GET /api/orders/:id - Get single order
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📋 Buscando pedido ID: ${id}`);
  
  try {
    const order = orders.find(o => o.id === parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
