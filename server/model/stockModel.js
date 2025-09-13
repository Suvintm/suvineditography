// models/stockModel.js
import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    // type: video, image, audio, music, png, icon
    type: {
      type: String,
      enum: ["image", "video", "audio", "music", "png", "icon"],
      required: true,
    },

    mimeType: { type: String },
    url: { type: String, required: true }, // cloudinary secure url
    thumbnailUrl: { type: String, default: "" },

    // category — you can expand these to match Unsplash/Pixabay categories
    category: {
      type: String,
      enum: [
        "Nature",
        "People",
        "Animals",
        "Business",
        "Technology",
        "Art",
        "Sports",
        "Food",
        "Travel",
        "Abstract",
        "Architecture",
        "Fashion",
        "Lifestyle",
        "Music",
      ],
      required: true,
    },

    subcategory: { type: String, default: "" },

    // tags as array of lowercase strings
    tags: [{ type: String }],

    // free or premium — only admin can set
    status: { type: String, enum: ["free", "premium"], default: "free" },

    // uploader details
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    uploaderName: { type: String, required: true },
    isAdminUploader: { type: Boolean, required: true },

    // analytics
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },

    // file metadata
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    fileSizeMB: { type: Number },
    cloudPublicId: { type: String },
    originalFileName: { type: String },

    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

// text index for search
stockSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
  subcategory: "text",
});

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);
export default Stock;
