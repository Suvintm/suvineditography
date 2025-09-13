// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "Unauthorized: user not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

export default authMiddleware;
