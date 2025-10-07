import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT 1');
    console.log('DB OK');
  } catch (err) {
    console.error('Erro ao conectar com o banco:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
