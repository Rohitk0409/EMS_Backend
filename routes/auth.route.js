const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", authController.registerAdmin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/me", protect, authController.getAuthUser);

module.exports = router;
