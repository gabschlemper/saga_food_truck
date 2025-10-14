const express = require("express");
const loginController = require("../Controllers/LoginController");

const router = express.Router();

// POST /api/login
router.post("/", (req, res) => loginController.login(req, res));

module.exports = router;
