const express = require("express");
const router = express.Router();

const CustomerController = require("../controllers/customerController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, CustomerController.getAll);
router.get("/:id", auth, CustomerController.getById);
router.post("/", auth, role("admin"), CustomerController.create);
router.put("/:id", auth, role("admin"), CustomerController.update);
router.delete("/:id", auth, role("admin"), CustomerController.delete);

module.exports = router;
