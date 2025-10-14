const express = require("express");
const userController = require("../Controllers/UserController");
const authenticate = require("../Middleware/Authenticate");
const authorize = require("../Middleware/Authorize");

const router = express.Router();

// Todas as rotas de usuário são protegidas usando arrow functions
router.post("/", authenticate, authorize(0), (req, res) => userController.createUser(req, res));
router.get("/", authenticate, authorize(0), (req, res) => userController.getAllUsers(req, res));
router.get("/:id", authenticate, (req, res) => userController.getUserById(req, res));
router.put("/:id", authenticate, (req, res) => userController.updateUser(req, res));
router.delete("/:id", authenticate, authorize(0), (req, res) => userController.deleteUser(req, res));

module.exports = router;
