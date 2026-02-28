import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../helpers/sendEmail.js";
import User from "../schema/user.schema.js";

/*
  ===============================
        FORGOT PASSWORD
  ===============================
*/
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // For security: don't reveal if user exists or not
    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    // Generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving to DB (secure way)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      You requested a password reset.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 10 minutes.
    `;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
  ===============================
        RESET PASSWORD
  ===============================
*/
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash incoming token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
