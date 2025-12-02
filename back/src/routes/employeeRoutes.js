import express from "express";
import EmployeeController from "../controllers/employeeController.js";
import auth from "../middlewares/authMiddleware.js";
import role from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/login", EmployeeController.loginController);
router.get("/", auth, role("admin"), EmployeeController.list);
router.get(
  "/:id",
  auth,
  role("admin", "atendente"),
  EmployeeController.getById
);
router.post("/", auth, role("admin"), EmployeeController.create);
router.put("/:id", auth, role("admin", "atendente"), EmployeeController.update);
router.delete("/:id", auth, role("admin"), EmployeeController.remove);

export default router;
