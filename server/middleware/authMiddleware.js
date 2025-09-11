// Simple JWT auth middleware example. Adapt to your auth implementation if different.
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/userModel.js";
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });

    req.user = user;
    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ success: false, message: "Not authorized" });
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ success: false, message: "Admin privileges required" });
  next();
};
