import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  console.log('📦 Listando todos os produtos...');
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        description,
        price,
        stock,
        "minimumStock",
        status,
        category,
        active,
        "createdAt",
        "updatedAt"
      FROM products
      WHERE active = TRUE
      ORDER BY name ASC
    `);
    
    // Convert numeric fields from strings to numbers
    const products = result.rows.map(product => ({
      ...product,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      minimumStock: parseInt(product.minimumStock)
    }));
    
    res.json({
      success: true,
      data: products,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📦 Buscando produto ID: ${id}`);
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        description,
        price,
        stock,
        "minimumStock",
        status,
        category,
        active,
        "createdAt",
        "updatedAt"
      FROM products
      WHERE id = $1 AND active = TRUE
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    const product = result.rows[0];
    
    res.json({
      success: true,
      data: {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        minimumStock: parseInt(product.minimumStock)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto',
      error: error.message
    });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  console.log('➕ Criando novo produto...');
  
  try {
    const { name, description, price, stock, minimumStock, category } = req.body;
    
    // Validações
    if (!name || !price || stock === undefined || minimumStock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: name, price, stock, minimumStock'
      });
    }
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Preço deve ser maior que 0'
      });
    }
    
    if (stock < 0 || minimumStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoques não podem ser negativos'
      });
    }

    const validCategories = ['Lanches', 'Acompanhamentos', 'Bebidas', 'Outros'];
    const categoryValue = category || 'Outros';
    
    if (!validCategories.includes(categoryValue)) {
      return res.status(400).json({
        success: false,
        message: 'Categoria inválida. Use: Lanches, Acompanhamentos, Bebidas ou Outros'
      });
    }
    
    const result = await pool.query(`
      INSERT INTO products (name, description, price, stock, "minimumStock", category, active)
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING 
        id,
        name,
        description,
        price,
        stock,
        "minimumStock",
        status,
        category,
        active,
        "createdAt",
        "updatedAt"
    `, [
      name.trim(),
      description?.trim() || '',
      parseFloat(price),
      parseInt(stock),
      parseInt(minimumStock),
      categoryValue
    ]);
    
    const newProduct = result.rows[0];
    console.log(`✅ Produto criado: ${newProduct.name} (ID: ${newProduct.id})`);
    
    res.status(201).json({
      success: true,
      data: {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        minimumStock: parseInt(newProduct.minimumStock)
      },
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`✏️ Atualizando produto ID: ${id}`);
  
  try {
    const { name, description, price, stock, minimumStock, category } = req.body;
    
    // Verificar se produto existe
    const checkResult = await pool.query('SELECT id FROM products WHERE id = $1 AND active = TRUE', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    // Validações
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

    if (category !== undefined) {
      const validCategories = ['Lanches', 'Acompanhamentos', 'Bebidas', 'Outros'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Categoria inválida'
        });
      }
    }
    
    // Construir query dinâmica
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name.trim());
      paramCount++;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description.trim());
      paramCount++;
    }
    
    if (price !== undefined) {
      updates.push(`price = $${paramCount}`);
      values.push(parseFloat(price));
      paramCount++;
    }
    
    if (stock !== undefined) {
      updates.push(`stock = $${paramCount}`);
      values.push(parseInt(stock));
      paramCount++;
    }
    
    if (minimumStock !== undefined) {
      updates.push(`"minimumStock" = $${paramCount}`);
      values.push(parseInt(minimumStock));
      paramCount++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }
    
    values.push(id);
    
    const result = await pool.query(`
      UPDATE products 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount} AND active = TRUE
      RETURNING 
        id,
        name,
        description,
        price,
        stock,
        "minimumStock",
        status,
        category,
        active,
        "createdAt",
        "updatedAt"
    `, values);
    
    const updatedProduct = result.rows[0];
    console.log(`✅ Produto atualizado: ${updatedProduct.name}`);
    
    res.json({
      success: true,
      data: {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock),
        minimumStock: parseInt(updatedProduct.minimumStock)
      },
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product (soft delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deletando produto ID: ${id}`);
  
  try {
    // Verificar se produto existe
    const checkResult = await pool.query(
      'SELECT id, name FROM products WHERE id = $1 AND active = TRUE',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    const productName = checkResult.rows[0].name;
    
    // Soft delete - apenas marca como inativo
    await pool.query(
      'UPDATE products SET active = FALSE WHERE id = $1',
      [id]
    );
    
    console.log(`✅ Produto deletado: ${productName}`);
    
    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
      data: { id: parseInt(id), name: productName }
    });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    
    // Verifica se é erro de constraint (produto está em pedidos)
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar produto que está em pedidos existentes'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto',
      error: error.message
    });
  }
});

export default router;