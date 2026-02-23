const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    permissions: [
      {
        type: String,
      },
    ],

    companyId: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Unique role per company
roleSchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("Role", roleSchema);
