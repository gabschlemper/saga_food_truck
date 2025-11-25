import pg from 'pg';
const { Pool } = pg;

// Configuração do pool de conexões PostgreSQL
export const pool = new Pool({
  user: process.env.DB_USER || 'usuario',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'usuario123',
  port: process.env.DB_PORT || 5432,
  max: 20, // Número máximo de clientes no pool
  idleTimeoutMillis: 30000, // Tempo de timeout para clientes ociosos
  connectionTimeoutMillis: 2000, // Tempo de timeout para conexão
});

// Event listeners para monitoramento
pool.on('connect', () => {
  console.log('🔌 Nova conexão estabelecida com o PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões:', err);
});

// Função para testar a conexão
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now, version() as version');
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    console.log('📅 Horário do servidor:', result.rows[0].now);
    console.log('🐘 Versão:', result.rows[0].version.split(',')[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
    return false;
  }
}

// Função helper para executar queries com tratamento de erro
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executada:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Erro na query:', { text, error: error.message });
    throw error;
  }
}

export default pool;
