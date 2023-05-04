const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

// routes for managing users

router.post("/register", userController.signup);

router.post("/login", userController.login);

router.get("/user/:userId", userController.getUser);

router.get("/usertest", userController.getUser2);

router.get("/users", userController.getUsers);

router.put("/user/:userId", userController.updateUser);

router.delete("/user/:userId", userController.deleteUser);

module.exports = router;
