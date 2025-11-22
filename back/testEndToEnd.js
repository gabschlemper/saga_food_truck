/**
 * Teste End-to-End - SAGA Food Truck
 * Testa toda a stack: PostgreSQL → Backend → Frontend simulation
 */

import { pool } from './config/database.js';

const API_BASE = 'http://localhost:3000';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  if (passed) {
    testsPassed++;
    log(`✅ ${testName}`, 'green');
    if (details) log(`   ${details}`, 'cyan');
  } else {
    testsFailed++;
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
  }
}

async function testDatabaseConnection() {
  log('\n📊 TESTE 1: Conexão PostgreSQL', 'blue');
  try {
    const result = await pool.query('SELECT version()');
    const version = result.rows[0].version;
    logTest('Conexão com PostgreSQL', true, version.substring(0, 50));
    return true;
  } catch (error) {
    logTest('Conexão com PostgreSQL', false, error.message);
    return false;
  }
}

async function testDatabaseSchema() {
  log('\n📋 TESTE 2: Schema do Banco', 'blue');
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const expectedTables = ['customers', 'employees', 'order_audit', 'order_items', 'orders', 'product_audit', 'products'];
    const foundTables = result.rows.map(r => r.table_name);
    
    const allFound = expectedTables.every(t => foundTables.includes(t));
    logTest('Tabelas esperadas criadas', allFound, `${foundTables.length} tabelas: ${foundTables.join(', ')}`);
    
    return allFound;
  } catch (error) {
    logTest('Tabelas esperadas criadas', false, error.message);
    return false;
  }
}

async function testBackendHealth() {
  log('\n🔌 TESTE 3: Backend Health Check', 'blue');
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    logTest('Backend respondendo', response.ok, `Status: ${response.status}, Port: ${data.port}`);
    return response.ok;
  } catch (error) {
    logTest('Backend respondendo', false, error.message);
    return false;
  }
}

async function testAuthLogin() {
  log('\n🔐 TESTE 4: Autenticação (Login)', 'blue');
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sagafoodtruck.com',
        password: '123456'
      })
    });
    
    const data = await response.json();
    const passed = response.ok && data.token && data.user;
    
    logTest('Login com credenciais válidas', passed, passed ? `Token: ${data.token.substring(0, 20)}...` : data.error);
    return { passed, token: data.token };
  } catch (error) {
    logTest('Login com credenciais válidas', false, error.message);
    return { passed: false };
  }
}

async function testProductsList() {
  log('\n📦 TESTE 5: Listagem de Produtos', 'blue');
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    const data = await response.json();
    
    const passed = response.ok && Array.isArray(data.data) && data.data.length > 0;
    logTest('GET /api/products', passed, `${data.count || 0} produtos retornados`);
    
    if (passed) {
      const product = data.data[0];
      const hasRequiredFields = product.id && product.name && typeof product.price === 'number';
      logTest('Campos numéricos convertidos', hasRequiredFields, `price tipo: ${typeof product.price}, stock tipo: ${typeof product.stock}`);
    }
    
    return { passed, products: data.data };
  } catch (error) {
    logTest('GET /api/products', false, error.message);
    return { passed: false };
  }
}

async function testProductCreate() {
  log('\n➕ TESTE 6: Criação de Produto', 'blue');
  try {
    const newProduct = {
      name: `Produto Teste E2E ${Date.now()}`,
      description: 'Criado durante teste end-to-end',
      price: 19.99,
      stock: 25,
      minimumStock: 5,
      category: 'Outros'
    };
    
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    
    const data = await response.json();
    const passed = response.status === 201 && data.success && data.data.id;
    
    logTest('POST /api/products', passed, passed ? `ID criado: ${data.data.id}` : data.message);
    
    return { passed, productId: data.data?.id };
  } catch (error) {
    logTest('POST /api/products', false, error.message);
    return { passed: false };
  }
}

async function testProductUpdate(productId) {
  log('\n✏️ TESTE 7: Atualização de Produto', 'blue');
  if (!productId) {
    logTest('PUT /api/products/:id', false, 'Nenhum produto para atualizar');
    return { passed: false };
  }
  
  try {
    const updates = {
      price: 24.99,
      stock: 30
    };
    
    const response = await fetch(`${API_BASE}/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    const passed = response.ok && data.data.price === 24.99;
    
    logTest('PUT /api/products/:id', passed, passed ? `Preço atualizado: R$ ${data.data.price}` : data.message);
    
    return { passed };
  } catch (error) {
    logTest('PUT /api/products/:id', false, error.message);
    return { passed: false };
  }
}

async function testOrdersList() {
  log('\n📋 TESTE 8: Listagem de Pedidos', 'blue');
  try {
    const response = await fetch(`${API_BASE}/api/orders`);
    const data = await response.json();
    
    const passed = response.ok && Array.isArray(data.data);
    logTest('GET /api/orders', passed, `${data.count || 0} pedidos retornados`);
    
    if (passed && data.data.length > 0) {
      const order = data.data[0];
      const hasItems = Array.isArray(order.items);
      logTest('Pedidos com itens agregados', hasItems, `Pedido #${order.id} tem ${order.items?.length || 0} itens`);
    }
    
    return { passed, orders: data.data };
  } catch (error) {
    logTest('GET /api/orders', false, error.message);
    return { passed: false };
  }
}

async function testOrderCreate(productId) {
  log('\n➕ TESTE 9: Criação de Pedido (Transação ACID)', 'blue');
  if (!productId) {
    logTest('POST /api/orders', false, 'Nenhum produto disponível para pedido');
    return { passed: false };
  }
  
  try {
    const newOrder = {
      customer: 'Cliente Teste E2E',
      items: [
        { productId: productId, name: 'Produto Teste', quantity: 2, price: 19.99 },
        { productId: 1, name: 'Item Existente', quantity: 1, price: 15.00 }
      ],
      paymentMethod: 'Pix',
      paymentStatus: 'Pago',
      notes: 'Pedido criado durante teste end-to-end'
    };
    
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    
    const data = await response.json();
    const passed = response.status === 201 && data.success && data.data.id;
    
    logTest('POST /api/orders (transação)', passed, passed ? `Pedido #${data.data.id} criado com ${data.data.items?.length} itens` : data.message);
    
    return { passed, orderId: data.data?.id };
  } catch (error) {
    logTest('POST /api/orders', false, error.message);
    return { passed: false };
  }
}

async function testOrderUpdate(orderId) {
  log('\n✏️ TESTE 10: Atualização de Pedido', 'blue');
  if (!orderId) {
    logTest('PUT /api/orders/:id', false, 'Nenhum pedido para atualizar');
    return { passed: false };
  }
  
  try {
    const updates = {
      status: 'Pronto',
      notes: 'Atualizado no teste E2E'
    };
    
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    const passed = response.ok && data.data.status === 'Pronto';
    
    logTest('PUT /api/orders/:id', passed, passed ? `Status: ${data.data.status}` : data.message);
    
    return { passed };
  } catch (error) {
    logTest('PUT /api/orders/:id', false, error.message);
    return { passed: false };
  }
}

async function testTriggers() {
  log('\n⚙️ TESTE 11: Triggers Automáticos', 'blue');
  try {
    // Testar trigger de status automático
    const lowStockProduct = {
      name: 'Produto Estoque Baixo',
      description: 'Teste de trigger',
      price: 10.00,
      stock: 2,
      minimumStock: 5,
      category: 'Outros'
    };
    
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lowStockProduct)
    });
    
    const data = await response.json();
    const statusCorrect = data.data.status === 'Estoque Baixo';
    
    logTest('Trigger calcula status automático', statusCorrect, `Status: ${data.data.status} (esperado: Estoque Baixo)`);
    
    return { passed: statusCorrect };
  } catch (error) {
    logTest('Trigger calcula status automático', false, error.message);
    return { passed: false };
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║   🧪 TESTES END-TO-END - SAGA FOOD TRUCK            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  
  const start = Date.now();
  
  // Testes de infraestrutura
  await testDatabaseConnection();
  await testDatabaseSchema();
  await testBackendHealth();
  
  // Testes de autenticação
  const { token } = await testAuthLogin();
  
  // Testes de produtos
  const { products } = await testProductsList();
  const { productId } = await testProductCreate();
  await testProductUpdate(productId);
  
  // Testes de pedidos
  await testOrdersList();
  const { orderId } = await testOrderCreate(productId);
  await testOrderUpdate(orderId);
  
  // Testes de automação
  await testTriggers();
  
  // Relatório final
  const duration = ((Date.now() - start) / 1000).toFixed(2);
  
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║                  📊 RESULTADO FINAL                   ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  log(`\n✅ Testes Passaram: ${testsPassed}`, 'green');
  log(`❌ Testes Falharam: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
  log(`⏱️  Tempo Total: ${duration}s`, 'cyan');
  log(`📈 Taxa de Sucesso: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%\n`, 'yellow');
  
  await pool.end();
  process.exit(testsFailed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  log(`\n💥 Erro fatal: ${error.message}`, 'red');
  process.exit(1);
});
