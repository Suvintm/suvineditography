// routes/adminStockRoute.js
import express from "express";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";
import {
  uploadStockAdmin,
  getStocksAdmin,
  getStockByIdAdmin,
  updateStockAdmin,
  deleteStockAdmin,
  incrementDownloadAdmin,
} from "../controllers/adminStockController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage

// Protect all admin stock routes
router.use(adminAuth);

// Get all stocks (Admin only)
router.get("/", getStocksAdmin);

// Upload stock (Admin only)
router.post("/upload", upload.single("file"), uploadStockAdmin);

// Get single stock by ID or slug
router.get("/view/:idOrSlug", getStockByIdAdmin);

// Update stock metadata
router.put("/:id", updateStockAdmin);

// Delete stock
router.delete("/:id", deleteStockAdmin);

// Increment download count
router.post("/:id/download", incrementDownloadAdmin);

export default router;
