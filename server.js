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
const login = require("./src/routers/LoginRoad");
const menu = require("./src/routers/MenuRoad");
const order = require("./src/routers/OrderRoad");
const stock = require("./src/routers/StockRoad");
const guest = require("./src/routers/UserRoad");

// Registro das rotas
app.use("/api/login", login);
app.use("/api/menu", menu);
app.use("/api/order", order);
app.use("/api/stock", stock);
app.use("/api/users", guest);

// Importar todos os models 
require("./src/models/User");
require("./src/models/Menu");
require("./src/models/Order");
require("./src/models/Stock");
require("./src/models/StockAlert");

(async () => {
  try {
    // Conecta ao banco
    await initDB();

    // 🔥 Cria ou atualiza tabelas automaticamente
    await sequelize.sync({ alter: true });
    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚚 Saga Food Truck Backend rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
})();