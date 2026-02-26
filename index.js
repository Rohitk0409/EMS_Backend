const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// ------------------------------
// TRUST PROXY (Important for cookies on Render/Railway)
// ------------------------------
app.set("trust proxy", 1);

// ------------------------------
// CORS CONFIGURATION (Production Ready)
// ------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL, // recommended
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ------------------------------
// MIDDLEWARES
// ------------------------------
app.use(express.json());
app.use(cookieParser());

// ------------------------------
// ROUTES
// ------------------------------
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const logRoutes = require("./routes/logs.route");

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running 🚀",
  });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/log", logRoutes);

// ------------------------------
// GLOBAL ERROR HANDLER
// ------------------------------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ------------------------------
// DATABASE + SERVER START
// ------------------------------
const PORT = process.env.PORT || 1000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
