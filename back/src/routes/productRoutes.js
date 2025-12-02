import express from "express";
import ProductController from "../controllers/productController.js";
import auth from "../middlewares/authMiddleware.js";
import role from "../middlewares/roleMiddleware.js";

const router = express.Router();

// router.get(
// "/stock/low",
// auth,
// role("admin", "atendente"),
// ProductController.lowStock
// );
router.get("/", auth, role("admin", "atendente"), ProductController.list);
router.get("/:id", auth, role("admin", "atendente"), ProductController.getById);
router.post("/", auth, role("admin", "atendente"), ProductController.create);
router.put("/:id", auth, role("admin", "atendente"), ProductController.update);
router.delete(
  "/:id",
  auth,
  role("admin", "atendente"),
  ProductController.remove
);

export default router;
