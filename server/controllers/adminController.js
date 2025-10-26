// controllers/adminController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    if (email !== adminEmail)
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin email" });

    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin password" });

    const token = jwt.sign(
      { email: adminEmail, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: { email: adminEmail },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout route (stateless JWT)
export const adminLogout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
