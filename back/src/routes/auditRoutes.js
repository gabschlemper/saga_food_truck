import express from "express";
import AuditController from "../controllers/auditController.js";
import auth from "../middlewares/authMiddleware.js";
import role from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/orders/:orderId",
  auth,
  role("admin"),
  AuditController.getOrderAudit
);
router.get(
  "/products/:productId",
  auth,
  role("admin"),
  AuditController.getProductAudit
);

export default router;
