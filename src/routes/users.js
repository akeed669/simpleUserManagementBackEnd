const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

// routes for user management

router.post("/register", userController.signup);

router.post("/login", userController.login);

router.get("/user/:userId", [auth], userController.getUser);

router.get("/users", [auth], [admin], userController.getUsers);

router.put("/user/:userId", [auth], userController.updateUser);

router.delete("/user/:userId", [auth, admin], userController.deleteUser);

module.exports = router;
