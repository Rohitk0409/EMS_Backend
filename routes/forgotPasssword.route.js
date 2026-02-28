const express = require("express");
const { default: sendEmail } = require("../helpers/sendEmail");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/forgotPassword.controller");
const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
