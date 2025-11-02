require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, initDB } = require("./database.cjs");

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
const login = require("./src/routers/loginRoad");
const menu = require("./src/routers/menuRoad");
const order = require("./src/routers/orderRoad");
const stock = require("./src/routers/stockRoad");
const users = require("./src/routers/userRoad");

// Registro das rotas
app.use("/api/login", login);
app.use("/api/menu", menu);
app.use("/api/order", order);
app.use("/api/stock", stock);
app.use("/api/users", users);

// Importar todos os models 
require("./src/models/user");
require("./src/models/menu");
require("./src/models/order");
require("./src/models/stock");
require("./src/models/stockAlert");

(async () => {
  try {
    // Conecta ao banco
    await initDB();
    //Cria ou atualiza tabelas automaticamente
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