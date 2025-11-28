import express from "express";
import OrderController from "../controllers/orderController.js";
import auth from "../middlewares/authMiddleware.js";
import role from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", auth, role("admin", "atendente"), OrderController.list);
router.get("/:id", auth, role("admin", "atendente"), OrderController.getById);
router.post("/", auth, role("admin", "atendente"), OrderController.create);
router.put("/:id", auth, role("admin", "atendente"), OrderController.update);
router.delete("/:id", auth, role("admin", "atendente"), OrderController.remove);

export default router;
