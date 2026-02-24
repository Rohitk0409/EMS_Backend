import mongoose from "mongoose";

const { Schema } = mongoose;

const logSchema = new Schema(
  {
    // Which company (multi-tenant isolation)
    companyId: {
      type: String,
      required: true,
      index: true, // Important for fast tenant queries
      trim: true,
    },

    // Who performed the action
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of activity
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "STATUS_CHANGE"],
      required: true,
    },

    // Human readable log message
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Compound index for fast queries
logSchema.index({ companyId: 1, createdAt: -1 });

const Log = mongoose.model("Log", logSchema);

export default Log;
