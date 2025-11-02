const express = require("express");
const ReportController = require("../Controllers/reportController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const reportController = new ReportController();
const router = express.Router();

// Relatórios protegidos apenas para admin ou gerente
router.get("/", authenticate, authorize(1), reportController.getAllReports.bind(reportController));
router.get("/:id", authenticate, authorize(1), reportController.getReportById.bind(reportController));

module.exports = router;
