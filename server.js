require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, initDB } = require("./database");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas raiz e teste
app.get("/", (req, res) => {
  console.log("🚀 Rota raiz acessada!");
  res.json({
    message: "Saga Food Truck API está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", (req, res) => {
  console.log("✅ Rota de teste acessada!");
  res.json({
    status: "success",
    message: "Backend está rodando perfeitamente!",
  });
});

// Rotas da API
const login = require("./src/Routers/LoginRoad");
const menu = require("./src/Routers/MenuRoad");
const order = require("./src/Routers/OrderRoad");
const stock = require("./src/Routers/StockRoad");
const guest = require("./src/Routers/UserRoad");

// Registro das rotas
app.use("/api/login", login);
app.use("/api/menu", menu);
app.use("/api/order", order);
app.use("/api/stock", stock);
app.use("/api/users", guest);

// Importar todos os models 
require("./src/Models/User");
require("./src/Models/Menu");
require("./src/Models/Order");
require("./src/Models/Stock");
require("./src/Models/StockAlert");

(async () => {
  try {
    // Conecta ao banco
    await initDB();

    // 🔥 Cria ou atualiza tabelas automaticamente
    await sequelize.sync({ alter: true });
    console.log("✅ Tabelas sincronizadas com sucesso!");

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚚 Saga Food Truck Backend rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
})();