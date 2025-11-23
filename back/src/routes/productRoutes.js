const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, ProductController.getAll);
router.get("/:id", auth, ProductController.getById);
router.post("/", auth, role("admin"), ProductController.create);
router.put("/:id", auth, role("admin"), ProductController.update);
router.delete("/:id", auth, role("admin"), ProductController.delete);

router.get("/stock/low", auth, role("admin"), ProductController.lowStock);

module.exports = router;
