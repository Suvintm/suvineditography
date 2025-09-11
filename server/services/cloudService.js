// wrapper around cloudinary upload/delete
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = async (
  filePath,
  folder = "suvineditography/stocks"
) => {
  try {
    const options = {
      folder,
      use_filename: true,
      unique_filename: true,
      resource_type: "auto",
    };
    const result = await cloudinary.uploader.upload(filePath, options);
    // remove local file
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete temp file:", filePath, err);
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      duration: result.duration || null,
    };
  } catch (err) {
    // try to remove local file on error as well
    fs.unlink(filePath, () => {});
    throw err;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });
    return res;
  } catch (err) {
    throw err;
  }
};
