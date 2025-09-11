// import jwt from "jsonwebtoken";
// import userModel from "../model/userModel.js";

// const userAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: No token" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await userModel.findById(decoded.id).select("-password");
//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: User not found" });
//     }

//     // Attach all required details for stocks + keep old fields
//     req.user = {
//       id: user._id,
//       email: user.email,
//       name: user.name,
//       isAdmin: user.isAdmin || false, // assuming you’ll add `isAdmin` field in user schema
//     };

//     next();
//   } catch (error) {
//     console.error("Auth error:", error);
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// };

// export default userAuth;
// middleware/userAuth.js
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized: User not found" });

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
    };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default userAuth;
