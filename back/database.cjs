const { Sequelize } = require("sequelize");
require("dotenv").config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT = 5432,
  DB_DIALECT,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: DB_DIALECT,
  logging: false, // troca para console.log se quiser ver queries
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  define: { freezeTableName: true },
});

// conecta ao banco
async function initDB() {
  try {
    // Conecta ao banco 'postgres' para gerenciar criação do DB
    const tempSequelize = new Sequelize(DB_DIALECT, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      dialect: DB_DIALECT,
      logging: false,
    });

    await tempSequelize.authenticate();

    // Verifica se o banco principal existe
    const [results] = await tempSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );

    if (!results.length) {
      await tempSequelize.query(`CREATE DATABASE "${DB_NAME}"`);
    }

    await tempSequelize.close();

  //Conecta ao banco principal
    await sequelize.authenticate();
    console.log(`🎲 Conectado ao banco "${DB_NAME}"!`);
  } catch (error) {
    console.error("❌ Falha ao inicializar o banco:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, initDB };
