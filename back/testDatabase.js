import { testConnection, pool, query } from './config/database.js';

async function runTests() {
  console.log('🧪 Iniciando testes de conexão com PostgreSQL...\n');

  // Teste 1: Conexão básica
  console.log('1️⃣ Testando conexão básica...');
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n❌ Falha na conexão. Verifique se o Docker está rodando:');
    console.log('   docker-compose up -d');
    process.exit(1);
  }

  // Teste 2: Listar tabelas
  console.log('\n2️⃣ Listando tabelas criadas...');
  try {
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas encontradas:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
  } catch (error) {
    console.error('❌ Erro ao listar tabelas:', error.message);
  }

  // Teste 3: Contar produtos
  console.log('\n3️⃣ Verificando produtos cadastrados...');
  try {
    const productsResult = await query('SELECT COUNT(*) as total FROM products');
    console.log(`✅ Total de produtos: ${productsResult.rows[0].total}`);
    
    const productsData = await query('SELECT id, name, stock, status FROM products LIMIT 5');
    console.log('\n📦 Primeiros produtos:');
    productsData.rows.forEach(p => {
      console.log(`   ${p.id}. ${p.name} - Estoque: ${p.stock} - Status: ${p.status}`);
    });
  } catch (error) {
    console.error('❌ Erro ao verificar produtos:', error.message);
  }

  // Teste 4: Contar pedidos
  console.log('\n4️⃣ Verificando pedidos cadastrados...');
  try {
    const ordersResult = await query('SELECT COUNT(*) as total FROM orders');
    console.log(`✅ Total de pedidos: ${ordersResult.rows[0].total}`);
  } catch (error) {
    console.error('❌ Erro ao verificar pedidos:', error.message);
  }

  // Teste 5: Verificar funcionários
  console.log('\n5️⃣ Verificando funcionários cadastrados...');
  try {
    const employeesResult = await query('SELECT id, name, email, role FROM employees');
    console.log(`✅ Total de funcionários: ${employeesResult.rows.length}`);
    employeesResult.rows.forEach(e => {
      console.log(`   - ${e.name} (${e.email}) - ${e.role}`);
    });
  } catch (error) {
    console.error('❌ Erro ao verificar funcionários:', error.message);
  }

  console.log('\n✅ Testes concluídos!\n');
  
  await pool.end();
  process.exit(0);
}

runTests();
