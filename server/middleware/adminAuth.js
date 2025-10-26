import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin)
      return res.status(403).json({ message: "Access denied: Not admin" });

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default adminAuth;
