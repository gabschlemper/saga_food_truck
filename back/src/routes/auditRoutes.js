const express = require("express");

const AuditController = require("../controllers/auditController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

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

module.exports = router;
