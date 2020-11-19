const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

// POST: Signup user / Create user
router.post("/signup", UserController.createUser);

// POST: Login user
router.post("/login", UserController.loginUser);

// INTERNAL UES ROUTES
// GET: Get all users
router.get("", UserController.getUsers);

// DELETE: Delete all users
router.delete("", UserController.deleteUsers);

module.exports = router;
