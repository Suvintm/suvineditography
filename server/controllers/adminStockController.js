// controllers/adminStockController.js
import Stock from "../model/stockModel.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Helper to generate unique slug
const generateUniqueSlug = async (title) => {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let idx = 0;
  while (await Stock.findOne({ slug })) {
    idx += 1;
    slug = `${base}-${idx}`;
  }
  return slug;
};

// Upload stock (Admin only)
export const uploadStockAdmin = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const {
      title,
      description = "",
      type,
      category,
      subcategory = "",
      tags = "",
      status = "free",
    } = req.body;

    if (!title || !type || !category) {
      return res
        .status(400)
        .json({ message: "Title, type, and category are required" });
    }

    // Upload to Cloudinary
    const resourceType = ["video", "audio", "music"].includes(type)
      ? "video"
      : "image";
    const filePath = req.file.path;

    const uploadOptions = {
      resource_type: resourceType,
      folder: `suvineditography/${type}`,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Remove local file
    fs.unlinkSync(filePath);

    // Process tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const slug = await generateUniqueSlug(title);

    const newStock = new Stock({
      title: title.trim(),
      description,
      type,
      url: result.secure_url,
      thumbnailUrl: result.secure_url,
      category,
      subcategory,
      tags: tagsArray,
      status,
      uploadedBy: null, // Admin doesn't have a User ID
      uploaderName: "suvineditography",
      isAdminUploader: true,
      width: result.width,
      height: result.height,
      duration: result.duration,
      cloudPublicId: result.public_id,
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSizeMB: (req.file.size / (1024 * 1024)).toFixed(2),
      slug,
    });

    await newStock.save();

    res
      .status(201)
      .json({ message: "Stock uploaded successfully", stock: newStock });
  } catch (err) {
    console.error("uploadStockAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all stocks (Admin)
export const getStocksAdmin = async (req, res) => {
  try {
    const { search, category, type, tags } = req.query;
    const query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (tags)
      query.tags = { $in: tags.split(",").map((t) => t.trim().toLowerCase()) };
    if (search) query.$text = { $search: search };

    const stocks = await Stock.find(query).sort({ createdAt: -1 });
    res.status(200).json({ stocks });
  } catch (err) {
    console.error("getStocksAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single stock by ID or slug
export const getStockByIdAdmin = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const stock = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
      ? await Stock.findById(idOrSlug)
      : await Stock.findOne({ slug: idOrSlug });

    if (!stock) return res.status(404).json({ message: "Stock not found" });

    res.status(200).json({ stock });
  } catch (err) {
    console.error("getStockByIdAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update stock (Admin can edit any)
export const updateStockAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, subcategory, tags, status } =
      req.body;

    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    if (title && title !== stock.title) {
      stock.title = title.trim();
      stock.slug = await generateUniqueSlug(title);
    }
    if (description !== undefined) stock.description = description;
    if (category) stock.category = category;
    if (subcategory !== undefined) stock.subcategory = subcategory;
    if (tags !== undefined)
      stock.tags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    if (status) stock.status = status;

    await stock.save();
    res.status(200).json({ message: "Stock updated successfully", stock });
  } catch (err) {
    console.error("updateStockAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete stock (Admin only)
export const deleteStockAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    // Delete from Cloudinary
    if (stock.cloudPublicId) {
      try {
        const resourceType = ["video", "audio", "music"].includes(stock.type)
          ? "video"
          : "image";
        await cloudinary.uploader.destroy(stock.cloudPublicId, {
          resource_type: resourceType,
        });
      } catch (e) {
        console.warn("Cloudinary delete warning:", e.message);
      }
    }

    await Stock.findByIdAndDelete(id);
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error("deleteStockAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Increment download count
export const incrementDownloadAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    stock.downloads = (stock.downloads || 0) + 1;
    await stock.save();

    res
      .status(200)
      .json({ message: "Download recorded", downloads: stock.downloads });
  } catch (err) {
    console.error("incrementDownloadAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
