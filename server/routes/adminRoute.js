import express from "express";
import { adminLogin, adminLogout } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Admin logout (optional, just returns message)
router.post("/logout", adminAuth, adminLogout);

export default router;
