import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["image", "video", "audio", "icon", "png"],
      required: true,
    },
    mimeType: { type: String },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String, default: "" },
    tags: [{ type: String }],
    status: { type: String, enum: ["free", "premium"], default: "free" },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    uploaderName: { type: String, required: true }, // snapshot of name to avoid extra joins
    uploaderRole: { type: String, enum: ["admin", "user"], default: "user" },
    uploadedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number }, // for videos/audio
    cloudPublicId: { type: String },
    originalFileName: { type: String },
    mimeSize: { type: Number },
  },
  { timestamps: true }
);

// Text index for searching
stockSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
  subcategory: "text",
});

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);
export default Stock;
