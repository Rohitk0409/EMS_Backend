const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: String,
      required: true,
      index: true,
    },

    feedback: {
      type: String,
      required: [true, "Feedback is required"],
      trim: true,
    },

    // What type of thing this feedback is about
    relatedTo: {
      type: String,
      required: [true, "relatedTo is required"],
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
