import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config(); // aqui você chama o método, não importa como pacote

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5434, // <-- usa 5434 se não definido
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: { freezeTableName: true },
  }
);

export async function initDB() {
  await sequelize.authenticate();
  console.log("✅ Conectado ao banco com sucesso!");
  await sequelize.sync({ alter: true });
  console.log("✅ Sincronização das tabelas concluída!");
}

export default sequelize; // <-- exporta como default
