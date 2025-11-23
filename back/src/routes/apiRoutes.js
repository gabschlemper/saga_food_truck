const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("🚀 Rota raiz acessada!");
  res.json({
    message: "Saga Food Truck API está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

router.get("/test", (req, res) => {
  console.log("✅ Rota de teste acessada!");
  res.json({
    status: "success",
    message: "Backend está rodando perfeitamente!",
  });
});

module.exports = router;
