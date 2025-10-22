const express = require("express");
const ReportController = require("../Controllers/reportController");
const authenticate = require("../Middleware/Authenticate");
const authorize = require("../Middleware/Authorize");

const reportController = new ReportController();
const router = express.Router();

// Relatórios protegidos apenas para admin ou gerente
router.get("/", authenticate, authorize(0, 1), reportController.getAllReports.bind(reportController));
router.get("/:id", authenticate, authorize(0, 1), reportController.getReportById.bind(reportController));

module.exports = router;
