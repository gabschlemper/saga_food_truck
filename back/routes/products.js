import express from 'express';

const router = express.Router();

// Helper function to calculate product status
function calculateStatus(stock, minimumStock) {
  if (stock === 0) return 'Sem Estoque';
  if (stock <= minimumStock) return 'Estoque Baixo';
  return 'Em Estoque';
}

// Mock database - replace with real database later
let products = [
  {
    id: 1,
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer com carne 150g, queijo, alface e tomate',
    price: 18.50,
    stock: 2,
    minimumStock: 5,
    status: 'Estoque Baixo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Batata Frita',
    description: 'Porção de batata frita crocante (200g)',
    price: 8.00,
    stock: 0,
    minimumStock: 3,
    status: 'Sem Estoque',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Refrigerante Lata',
    description: 'Refrigerante em lata 350ml',
    price: 4.50,
    stock: 1,
    minimumStock: 10,
    status: 'Estoque Baixo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Hot Dog Completo',
    description: 'Hot dog com salsicha, queijo e batata palha',
    price: 12.00,
    stock: 5,
    minimumStock: 2,
    status: 'Em Estoque',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
  console.log('📦 Listando todos os produtos...');
  
  try {
    // Update status for all products
    const updatedProducts = products.map(product => ({
      ...product,
      status: calculateStatus(product.stock, product.minimumStock)
    }));
    
    res.json({
      success: true,
      data: updatedProducts,
      count: updatedProducts.length
    });
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📦 Buscando produto ID: ${id}`);
  
  try {
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    // Update status
    product.status = calculateStatus(product.stock, product.minimumStock);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/products - Create new product
router.post('/', (req, res) => {
  console.log('➕ Criando novo produto...');
  
  try {
    const { name, description, price, stock, minimumStock } = req.body;
    
    // Basic validation
    if (!name || !price || stock === undefined || minimumStock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: name, price, stock, minimumStock'
      });
    }
    
    if (price <= 0 || stock < 0 || minimumStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Preço deve ser maior que 0 e estoques não podem ser negativos'
      });
    }
    
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      minimumStock: parseInt(minimumStock),
      status: calculateStatus(parseInt(stock), parseInt(minimumStock)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    console.log(`✅ Produto criado: ${newProduct.name}`);
    
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`✏️ Atualizando produto ID: ${id}`);
  
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    const { name, description, price, stock, minimumStock } = req.body;
    
    // Basic validation
    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Preço deve ser maior que 0'
      });
    }
    
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoque não pode ser negativo'
      });
    }
    
    if (minimumStock !== undefined && minimumStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoque mínimo não pode ser negativo'
      });
    }
    
    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(minimumStock !== undefined && { minimumStock: parseInt(minimumStock) }),
      updatedAt: new Date().toISOString()
    };
    
    // Recalculate status
    updatedProduct.status = calculateStatus(updatedProduct.stock, updatedProduct.minimumStock);
    
    products[productIndex] = updatedProduct;
    
    console.log(`✅ Produto atualizado: ${updatedProduct.name}`);
    
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deletando produto ID: ${id}`);
  
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    
    console.log(`✅ Produto deletado: ${deletedProduct.name}`);
    
    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
      data: { id: deletedProduct.id, name: deletedProduct.name }
    });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export function getProducts() {
  return products;
}

export function updateProductStock(productId, quantity) {
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex].stock -= quantity;
    products[productIndex].updatedAt = new Date().toISOString();
    products[productIndex].status = calculateStatus(
      products[productIndex].stock, 
      products[productIndex].minimumStock
    );
    console.log(`📦 Estoque atualizado: ${products[productIndex].name} - ${products[productIndex].stock} unidades`);
  }
}

export default router;