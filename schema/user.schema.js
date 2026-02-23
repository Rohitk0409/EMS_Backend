const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // 🔥 hide password by default
    },

    mobile: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      required: true,
    },

    companyId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//
// 🔥 Compound Unique Index
// Email must be unique PER company
//
userSchema.index({ email: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
