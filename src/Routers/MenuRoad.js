const express = require("express");
const menuController = require("../Controllers/MenuController");
const authenticate = require("../Middleware/Authenticate");
const authorize = require("../Middleware/Authorize");

const router = express.Router();

// Rotas públicas
router.get("/", (req, res) => menuController.listAll(req, res));
router.get("/:id", (req, res) => menuController.getById(req, res));

// Rotas protegidas (apenas admin e caixa)
router.post("/", authenticate, authorize(0, 1), (req, res) => menuController.create(req, res));
router.put("/:id", authenticate, authorize(0, 1), (req, res) => menuController.update(req, res));
router.delete("/:id", authenticate, authorize(0), (req, res) => menuController.toggleActive(req, res));

module.exports = router;

