const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// CORS middleware (before routes)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://ems-backend-ujk8.onrender.com", // production frontend
    ],
    credentials: true,
  }),
);

app.use(express.json()); // ✅ THIS IS REQUIRED
app.use(cookieParser());

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);

const port = process.env.PORT || 1000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err.message);
  });
