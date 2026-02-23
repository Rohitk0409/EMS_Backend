const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/create", protect, userController.createUser);
router.get("/all", protect, userController.getAllUsers);
router.put("/update/:id", protect, userController.updateUser);
router.delete("/delete/:id", protect, userController.deleteUser);

module.exports = router;
