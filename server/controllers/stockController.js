// controllers/stockController.js
// controllers/stockController.js
import axios from "axios"; // <-- add this
import Stock from "../model/stockModel.js";
import User from "../model/userModel.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

// helper to generate unique slug
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

// Upload stock (admin and user use same endpoint)
export const uploadStock = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) return res.status(400).json({ message: "File is required" });

    // collect body fields
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
      return res
        .status(400)
        .json({ message: "title, type and category are required" });
    }

    // upload to cloudinary
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

    // remove local file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      /* ignore */
    }

    // tags processing
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
      thumbnailUrl: result.secure_url, // you can change to a different derived thumbnail if needed
      category,
      subcategory,
      tags: tagsArray,
      status: user.isAdmin && status ? status : "free",
      uploadedBy: user._id,
      uploaderName: user.isAdmin ? "SuvinEditography" : user.name,
      isAdminUploader: !!user.isAdmin,
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

    res.status(201).json({ message: "Stock uploaded", stock: newStock });
  } catch (err) {
    console.error("uploadStock error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// GET stocks: supports all / type / category filters
export const getStocks = async (req, res) => {
  try {
    const user = req.user;
    const { search, category, type, tags, my } = req.query;

    // 🔹 If 'my' is true → return only user's uploads
    if (my && user) {
      const stocks = await Stock.find({ uploadedBy: user._id }).sort({
        createdAt: -1,
      });
      return res.status(200).json({ stocks });
    }

    // 🔹 Build query
    const q = {};

    // Type filter (skip if "all")
    if (type && type !== "all") {
      q.type = type;
    }

    // Category filter (skip if "all")
    if (category && category !== "all") {
      q.category = category;
    }

    // Tags filter
    if (tags) {
      q.tags = { $in: tags.split(",").map((t) => t.trim().toLowerCase()) };
    }

    // Search filter
    if (search) {
      q.$text = { $search: search };
    }

    // 🔹 Access Control
    if (user && user.isAdmin) {
      // Admin sees all
      const stocks = await Stock.find(q).sort({ createdAt: -1 });
      return res.status(200).json({ stocks });
    } else {
      // Normal users/public see only free stocks OR their own
      q.$or = [{ status: "free" }];
      if (user) q.$or.push({ uploadedBy: user._id });

      const stocks = await Stock.find(q).sort({ createdAt: -1 });
      return res.status(200).json({ stocks });
    }
  } catch (err) {
    console.error("getStocks error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single stock by id or slug
export const getStockById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const stock = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
      ? await Stock.findById(idOrSlug)
      : await Stock.findOne({ slug: idOrSlug });

    if (!stock) return res.status(404).json({ message: "Stock not found" });

    // If stock is premium, only admin or uploader can fetch full details (optional)
    // For now we return data; UI should handle access control for downloads.

    res.status(200).json({ stock });
  } catch (err) {
    console.error("getStockById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update stock (title, description, category, tags, status) — only uploader or admin
export const updateStock = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { title, description, category, subcategory, tags, status } =
      req.body;

    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const isOwner = stock.uploadedBy.toString() === user._id.toString();
    if (!isOwner && !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (title && title !== stock.title) {
      stock.title = title.trim();
      stock.slug = await generateUniqueSlug(title);
    }
    if (description !== undefined) stock.description = description;
    if (category) stock.category = category;
    if (subcategory !== undefined) stock.subcategory = subcategory;
    if (tags !== undefined) {
      stock.tags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    // Only admin can change status
    if (status && user.isAdmin) stock.status = status;

    await stock.save();
    res.status(200).json({ message: "Stock updated", stock });
  } catch (err) {
    console.error("updateStock error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete stock — only uploader or admin
export const deleteStock = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const isOwner = stock.uploadedBy.toString() === user._id.toString();
    if (!isOwner && !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // delete from Cloudinary if we have public id
    if (stock.cloudPublicId) {
      try {
        // resource_type should be video for video/audio else image
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
    res.status(200).json({ message: "Stock deleted" });
  } catch (err) {
    console.error("deleteStock error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// increment download count (call when user downloads)
export const incrementDownload = async (req, res) => {
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
    console.error("incrementDownload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// controllers/stockController.js
 

 
// controllers/stockController.js
export const downloadStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    // Increment downloads
    stock.downloads = (stock.downloads || 0) + 1;
    await stock.save();

    // Fetch file from Cloudinary or direct URL
    const response = await axios.get(stock.url, { responseType: "stream" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${stock.originalFileName || stock.title || "download"}"`
    );
    res.setHeader("Content-Type", response.headers["content-type"]);

    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({
      message: "Download failed",
      error: error.message,
    });
  }
};


