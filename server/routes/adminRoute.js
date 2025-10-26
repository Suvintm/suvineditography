import express from "express";
import { adminLogin, adminLogout } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminAuth, adminLogout);

export default router;
