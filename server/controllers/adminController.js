import jwt from "jsonwebtoken";

// Hardcoded admin credentials (plain text)
const ADMINS = [
  { email: "admin@suvineditography.com", password: "Admin@123" },
  { email: "suvinadmin@gmail.com", password: "Admin@123" },
];

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const admin = ADMINS.find((a) => a.email === email);

    if (!admin || admin.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: { email: admin.email, isAdmin: true },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin logout
export const adminLogout = async (req, res) => {
  try {
    // JWT is stateless; frontend will remove token
    res.json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
