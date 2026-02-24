const express = require("express");
const {
  getCompanyLogs,
  deleteCompanyLogs,
} = require("../controllers/logs.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", protect, getCompanyLogs);
router.delete("/", protect, deleteCompanyLogs);

module.exports = router;
