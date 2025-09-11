import path from "path";
import fs from "fs";
import Stock from "../model/stockModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudService.js";

/**
 * Helper: allowed MIME checks by provided type
 */
const isMimeAllowedForType = (mimetype, type) => {
  if (!mimetype) return false;
  if (type === "image" || type === "png" || type === "icon")
    return mimetype.startsWith("image/");
  if (type === "video") return mimetype.startsWith("video/");
  if (type === "audio") return mimetype.startsWith("audio/");
  return true;
};

/**
 * POST /api/stocks/upload
 * multipart/form-data
 * fields: title, description, type, category, subcategory, tags (comma separated or multiple), status (admins only)
 * file: file
 */
export const uploadStock = async (req, res) => {
  try {
    const file = req.file;
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const {
      title,
      description = "",
      type,
      category,
      subcategory = "",
      tags = "",
      status,
    } = req.body;
    if (!title || !type || !category) {
      // remove temp file
      fs.unlink(file.path, () => {});
      return res
        .status(400)
        .json({
          success: false,
          message: "title, type and category are required",
        });
    }

    if (!isMimeAllowedForType(file.mimetype, type)) {
      fs.unlink(file.path, () => {});
      return res
        .status(400)
        .json({ success: false, message: `Invalid file type for ${type}` });
    }

    // upload to cloudinary
    const cloud = await uploadToCloudinary(
      file.path,
      "suvineditography/stocks"
    );
    const tagArray = Array.isArray(tags)
      ? tags
      : tags
      ? String(tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // set uploader info
    const uploaderRole = req.user && req.user.isAdmin ? "admin" : "user";
    const uploaderName =
      uploaderRole === "admin"
        ? "suvineditography"
        : req.user?.name || "unknown";
    const finalStatus = uploaderRole === "admin" && status ? status : "free";

    const newStock = new Stock({
      title,
      description,
      type,
      mimeType: file.mimetype,
      url: cloud.url,
      thumbnailUrl: cloud.url, // for images use same. For advanced flow, create derived thumbnail.
      category,
      subcategory,
      tags: tagArray,
      status: finalStatus,
      uploadedBy: req.user._id,
      uploaderName,
      uploaderRole,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      width: cloud.width,
      height: cloud.height,
      duration: cloud.duration,
      cloudPublicId: cloud.public_id,
      originalFileName: file.originalname,
      mimeSize: file.size,
    });

    await newStock.save();
    res.status(201).json({ success: true, stock: newStock });
  } catch (err) {
    console.error("uploadStock error:", err);
    res
      .status(500)
      .json({ success: false, message: "Upload failed", error: err.message });
  }
};

/**
 * GET /api/stocks/mine
 * returns stocks uploaded by the current user
 * Admins: return all stocks (or you can restrict with query param)
 */
export const getMyStocks = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Auth required" });
    let stocks;
    if (req.user.isAdmin) {
      stocks = await Stock.find().sort({ createdAt: -1 });
    } else {
      stocks = await Stock.find({ uploadedBy: req.user._id }).sort({
        createdAt: -1,
      });
    }
    res.json({ success: true, count: stocks.length, stocks });
  } catch (err) {
    console.error("getMyStocks error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch", error: err.message });
  }
};

/**
 * GET /api/stocks
 * public query endpoint
 * query params: q, type, category, subcategory, status, uploader, page, limit, sort
 */
export const getStocks = async (req, res) => {
  try {
    const {
      q,
      type,
      category,
      subcategory,
      status,
      uploader, // uploader name (string) or uploaderRole
      page = 1,
      limit = 24,
      sort = "-createdAt",
    } = req.query;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (status) filter.status = status;
    if (uploader) filter.uploaderName = uploader; // or uploaderRole: 'admin' etc.

    const p = parseInt(page, 10);
    const l = Math.min(parseInt(limit, 10) || 24, 200);
    const skip = (p - 1) * l;

    const total = await Stock.countDocuments(filter);
    const stocks = await Stock.find(filter).sort(sort).skip(skip).limit(l);
    res.json({ success: true, total, page: p, limit: l, stocks });
  } catch (err) {
    console.error("getStocks error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch stocks",
        error: err.message,
      });
  }
};

/**
 * GET /api/stocks/:id
 */
export const getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock)
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    res.json({ success: true, stock });
  } catch (err) {
    console.error("getStockById error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch", error: err.message });
  }
};

/**
 * PUT /api/stocks/:id
 * Auth: owner or admin
 * Accepts multipart/form-data if replacing file (file present)
 * Fields: title, description, category, subcategory, tags, status (admins only)
 */
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock)
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });

    // permission check
    if (!req.user)
      return res.status(401).json({ success: false, message: "Auth required" });
    const isOwner = stock.uploadedBy.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin)
      return res.status(403).json({ success: false, message: "Not allowed" });

    const {
      title,
      description,
      category,
      subcategory,
      tags = "",
      status,
    } = req.body;

    if (title) stock.title = title;
    if (description !== undefined) stock.description = description;
    if (category) stock.category = category;
    if (subcategory !== undefined) stock.subcategory = subcategory;
    if (tags)
      stock.tags = Array.isArray(tags)
        ? tags
        : String(tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    if (req.user.isAdmin && status) stock.status = status;

    // handle file replacement if provided
    const file = req.file;
    if (file) {
      // validate mimetype again
      if (!isMimeAllowedForType(file.mimetype, stock.type)) {
        fs.unlink(file.path, () => {});
        return res
          .status(400)
          .json({ success: false, message: "Invalid replacement file type" });
      }
      // upload new file
      const cloud = await uploadToCloudinary(
        file.path,
        "suvineditography/stocks"
      );
      // delete previous from cloud
      if (stock.cloudPublicId) {
        try {
          await deleteFromCloudinary(stock.cloudPublicId);
        } catch (e) {
          console.warn("Failed to delete old cloud asset:", e.message);
        }
      }
      stock.url = cloud.url;
      stock.thumbnailUrl = cloud.url;
      stock.cloudPublicId = cloud.public_id;
      stock.width = cloud.width;
      stock.height = cloud.height;
      stock.duration = cloud.duration;
      stock.originalFileName = file.originalname;
      stock.mimeSize = file.size;
    }

    stock.updatedAt = new Date();
    await stock.save();
    res.json({ success: true, stock });
  } catch (err) {
    console.error("updateStock error:", err);
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

/**
 * DELETE /api/stocks/:id
 * Auth: owner or admin
 */
// Delete stock
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }

    // Only owner or admin can delete
    if (!req.user.isAdmin && stock.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Map stock.type → Cloudinary resource_type
    let resourceType = "image"; // default
    if (stock.type === "video") resourceType = "video";
    else if (stock.type === "music") resourceType = "raw"; // mp3, wav, etc
    else if (stock.type === "background" || stock.type === "font" || stock.type === "icon" || stock.type === "png") {
      resourceType = "raw"; // treat non-media as raw
    }

    // Delete from Cloudinary
    if (stock.public_id) {
      await cloudinary.uploader.destroy(stock.public_id, {
        resource_type: resourceType,
      });
    }

    // Delete from DB
    await Stock.findByIdAndDelete(stock._id);

    res.json({ success: true, message: "Stock deleted" });
  } catch (err) {
    console.error("deleteStock error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * PATCH /api/stocks/:id/status
 * Admin only endpoint to change free/premium
 * Body: status
 */
export const changeStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Admin required" });
    const { id } = req.params;
    const { status } = req.body;
    if (!["free", "premium"].includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });

    const stock = await Stock.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!stock)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, stock });
  } catch (err) {
    console.error("changeStatus error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Status change failed",
        error: err.message,
      });
  }
};

/**
 * GET /api/stocks/user/:userId
 * get assets by a specific uploader (public)
 */
export const getStocksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const stocks = await Stock.find({ uploadedBy: userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: stocks.length, stocks });
  } catch (err) {
    console.error("getStocksByUser error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch", error: err.message });
  }
};
