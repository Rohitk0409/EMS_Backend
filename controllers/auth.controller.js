const User = require("../schema/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateCompanyId = require("../helpers/generateCompanyId");

// 🔐 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      companyId: user.companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    },
  );
};

// 🔹 ADMIN REGISTER
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UNIQUE companyId
    let companyId;
    let isUnique = false;

    while (!isUnique) {
      companyId = generateCompanyId(name);
      const existingCompany = await User.findOne({ companyId });
      if (!existingCompany) isUnique = true;
    }

    const admin = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "admin",
      companyId,
    });

    const token = generateToken(admin);

    // ✅ Set Cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "Admin registered successfully",
      companyId: admin.companyId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 ADMIN LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // ✅ Set Cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin login successful",
      companyId: user.companyId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};
