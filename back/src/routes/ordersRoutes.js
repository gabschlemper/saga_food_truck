const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, OrderController.getAll);
router.get("/:id", auth, OrderController.getById);
router.post("/", auth, OrderController.create);
router.put("/:id", auth, role("admin"), OrderController.update);
router.delete("/:id", auth, role("admin"), OrderController.delete);

module.exports = router;
