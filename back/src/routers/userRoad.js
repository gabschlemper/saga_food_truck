const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post("/",authenticate, authorize(1,2), (req, res) => userController.createUser(req, res)); 
router.get("/",authenticate, authorize(1), (req, res) => userController.getAllUsers(req, res));
router.get("/:id",authenticate, authorize(1, 2), (req, res) =>  userController.getUserById(req, res));
router.put("/:id", authenticate, authorize(1), (req, res) => userController.updateUser(req, res));
router.delete("/:id", authenticate, authorize(1), (req, res) =>userController.deleteUser(req, res));

module.exports = router;
