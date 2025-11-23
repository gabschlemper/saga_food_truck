const express = require("express");
const router = express.Router();

const EmployeeController = require("../controllers/employeeController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, role("admin"), EmployeeController.getAll);
router.get("/:id", auth, role("admin"), EmployeeController.getById);
router.post("/", auth, role("admin"), EmployeeController.create);
router.put("/:id", auth, role("admin"), EmployeeController.update);
router.delete("/:id", auth, role("admin"), EmployeeController.delete);

module.exports = router;
