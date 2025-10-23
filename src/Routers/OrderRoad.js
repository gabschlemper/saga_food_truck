const express = require("express");
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ⚠️ Coloque rotas específicas primeiro
router.get("/status/:status", (req, res) => orderController.getOrdersByPaymentStatus(req, res));

// Rotas públicas
router.get("/", (req, res) => orderController.getAllOrders(req, res));
router.get("/:id", (req, res) => orderController.getOrderById(req, res));

// Rotas protegidas
router.post("/", authenticate, authorize(1, 2), (req, res) => orderController.createOrder(req, res));
router.put("/:id", authenticate, authorize(1, 2), (req, res) => orderController.updateOrder(req, res));
router.delete("/:id", authenticate, authorize(1), (req, res) => orderController.deleteOrder(req, res));
router.patch("/:id/paid", authenticate, authorize(1, 2), (req, res) => orderController.markAsPaid(req, res));
router.patch("/:id/pending", authenticate, authorize(1, 2), (req, res) => orderController.markAsPending(req, res));

module.exports = router;
