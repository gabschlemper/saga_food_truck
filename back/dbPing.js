import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

export default async function testConnection() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5434,
  });

  try {
    await pool.query("SELECT 1");
    console.log("📂 Conectado ao banco de dados");
  } catch (err) {
    console.error("🧨Erro ao conectar com o banco:", err);
  } finally {
    await pool.end();
  }
}
