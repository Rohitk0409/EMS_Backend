import Log from "../schema/logs.schema.js";

/**
 * CREATE LOG (Internal Utility)
 * This should NOT be exposed directly as a public route.
 * Use inside other controllers like user.controller.js
 */
export const createLog = async ({ companyId, userId, action, message }) => {
  try {
    await Log.create({
      companyId,
      userId,
      action,
      message,
    });
  } catch (error) {
    console.error("Log creation failed:", error.message);
  }
};

/**
 * GET COMPANY LOGS (For Dashboard Activity)
 * Returns latest logs for logged-in tenant only
 */
export const getCompanyLogs = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const logs = await Log.find({ companyId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(logs);
  } catch (error) {
    console.error("Fetch logs error:", error.message);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

/**
 * DELETE ALL LOGS
 */
export const deleteCompanyLogs = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    await Log.deleteMany({ companyId });

    res.status(200).json({ message: "Logs cleared successfully" });
  } catch (error) {
    console.error("Delete logs error:", error.message);
    res.status(500).json({ message: "Failed to delete logs" });
  }
};
