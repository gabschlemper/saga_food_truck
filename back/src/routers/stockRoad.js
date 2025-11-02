const express = require("express");
const stockController = require("../controllers/stockController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Listar todos os itens do estoque
router.get("/", (req, res) => stockController.index(req, res));
router.get("/:id", (req, res) => stockController.index(req, res));
// Criar novo item no estoque
router.post("/", authenticate, authorize(1), (req, res) => stockController.create(req, res));
// Atualizar item do estoque
router.put("/:id", authenticate, authorize(1), (req, res) => stockController.update(req, res));
// Registrar saída do estoque
router.post("/:id/decrease", authenticate, authorize(1), (req, res) => stockController.decrease(req, res));
// Consultar alertas de reposição
// router.get("/alerts", authenticate, authorize(1), (req, res) => stockController.alerts(req, res));

module.exports = router;
