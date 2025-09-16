import express from "express";
import {
  registerUser,
  loginUser,
  userCredit,
  forgotPassword,
  resetPassword,
} from "../controllers/userControllers.js";
import userAuth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credit", userAuth, userCredit);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
