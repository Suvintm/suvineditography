// routes/stockRoute.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/stockmulter.js";
import {
  uploadStock,
  getStocks,
  getStockById,
  updateStock,
  deleteStock,
  incrementDownload,
} from "../controllers/stockController.js";

const router = express.Router();

// Get stocks (admin all or filtered; regular users get free)
router.get("/", authMiddleware, getStocks);

// Get single stock by id or slug (public or auth — require auth if you want)
router.get("/view/:idOrSlug", getStockById);

// Upload (both admin and user) - form field should be "file"
router.post("/upload", authMiddleware, upload.single("file"), uploadStock);

// Get my stocks (explicit)
router.get("/my", authMiddleware, async (req, res) => {
  // convenience route (calls getStocks with my flag)
  req.query.my = "1";
  return getStocks(req, res);
});

// Update metadata
router.put("/:id", authMiddleware, updateStock);

// Delete
router.delete("/:id", authMiddleware, deleteStock);

// Increment download
router.post("/:id/download", incrementDownload);

export default router;
