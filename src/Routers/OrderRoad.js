const express = require("express");
const orderController = require("../Controllers/OrderController");
const authenticate = require("../Middleware/Authenticate");
const authorize = require("../Middleware/Authorize");

const router = express.Router();

// Rotas públicas usando arrow functions
router.get("/", (req, res) => orderController.getAllOrders(req, res));
router.get("/:id", (req, res) => orderController.getOrderById(req, res));

// Rotas protegidas usando arrow functions
router.post("/", authenticate, authorize(0,1), (req, res) => orderController.createOrder(req, res));
router.put("/:id", authenticate, authorize(0,1), (req, res) => orderController.updateOrder(req, res));
router.delete("/:id", authenticate, authorize(0), (req, res) => orderController.deleteOrder(req, res));
router.patch("/:id/paid", authenticate, authorize(0,1), (req, res) => orderController.markAsPaid(req, res));
router.patch("/:id/pending", authenticate, authorize(0,1), (req, res) => orderController.markAsPending(req, res));

// Filtro por status
router.get("/status/:status", (req, res) => orderController.getOrdersByPaymentStatus(req, res));

module.exports = router;
