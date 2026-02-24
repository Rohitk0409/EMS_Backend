const User = require("../schema/user.schema");
const bcrypt = require("bcryptjs");
const { createLog } = require("./logs.controller");

// 🔹 CREATE USER (Employee)
exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;

    // 🔥 Always use companyId from token
    const companyId = req.user.companyId;

    // Check if user already exists in SAME company
    const existingUser = await User.findOne({
      email,
      companyId,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists in this company",
      });
    }

    // Default password for employee
    const defaultPassword = await bcrypt.hash("123456", 10);

    const user = await User.create({
      name,
      email,
      mobile,
      role: role || "employee",
      password: defaultPassword,
      companyId,
    });

    // logs stored
    await createLog({
      userId: req?.user?.id,
      companyId: req.user.companyId,
      action: "CREATE",
      message: `New employee ${user.name} added`,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 GET ALL USERS (Same Company Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
      role: { $ne: "admin" }, // exclude admin
    }).select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        companyId: req.user.companyId, // 🔥 protect cross-company access
      },
      req.body,
      { new: true, runValidators: true },
    ).select("-password");

    // logs stored
    await createLog({
      userId: req?.user?.id,
      companyId: req.user.companyId,
      action: "UPDATE",
      message: ` employee ${user.name} Updated`,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found in this company",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({
      _id: id,
      companyId: req.user.companyId, // 🔥 prevent cross-company delete
    });

    // logs stored
    await createLog({
      userId: req?.user?.id,
      companyId: req.user.companyId,
      action: "UPDATE",
      message: ` employee ${user.name} Deleted`,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found in this company",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found in this company",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
