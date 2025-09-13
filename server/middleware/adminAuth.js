// middleware/adminAuth.js
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin)
      return res.status(403).json({ message: "Access denied: Not an admin" });

    // attach admin info to request
    req.admin = { email: decoded.email, isAdmin: true };
    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default adminAuth;
