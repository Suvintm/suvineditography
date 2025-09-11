import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadStock,
  getMyStocks,
  getStocks,
  getStockById,
  updateStock,
  deleteStock,
  changeStatus,
  getStocksByUser,
} from "../controllers/stockController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// multer setup - store temp files in /tmp/uploads
const uploadDir = path.join(process.cwd(), "tmp", "uploads");
import fs from "fs";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 150 }, // 150MB limit (adjust if needed)
});

router.post("/upload", protect, upload.single("file"), uploadStock);
router.get("/mine", protect, getMyStocks);
router.get("/", getStocks);
router.get("/user/:userId", getStocksByUser);
router.get("/:id", getStockById);
router.put("/:id", protect, upload.single("file"), updateStock);
router.delete("/:id", protect, deleteStock);
router.patch("/:id/status", protect, adminOnly, changeStatus);

export default router;
