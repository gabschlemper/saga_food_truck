const { Sequelize } = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
const DB_DIALECT = process.env.DB_DIALECT;

// Instância principal do Sequelize (banco específico)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false, // colocar console.log para debug
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  define: { freezeTableName: true },
});

/**
 * Inicializa o banco:
 * - Cria o banco se não existir
 * - Conecta ao banco específico
 */
async function initDB() {
  try {
    // Conecta ao banco padrão 'postgres' para criar o DB se necessário
    const tempSequelize = new Sequelize("postgres", DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: DB_DIALECT,
      logging: false,
    });

    await tempSequelize.close();

    // Conecta ao banco específico
    await sequelize.authenticate();
    console.log("🔄 Conexão com o banco estabelecida com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao conectar ou criar o banco:", error.message);
    process.exit(1);
  }
}

/**
 * Sincroniza todos os models previamente importados
 */
async function syncModels({ alter = true } = {}) {
  try {
    await sequelize.sync({ alter });
  } catch (error) {
    console.error("❌ Erro ao sincronizar tabelas:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, initDB, syncModels };
