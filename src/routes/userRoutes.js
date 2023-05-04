const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// routes for managing users

router.post("/register", userController.signup);
