import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  projectName: { type: String, required: true },
  canvasState: { type: Object, required: true }, // Fabric JSON
  canvasWidth: { type: Number, default: 600 }, // canvas width
  canvasHeight: { type: Number, default: 600 }, // canvas height
  imageURL: { type: String }, // Cloudinary URL (thumbnail/export)
  imagePublicId: { type: String }, // Cloudinary public_id for cleanup
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const projectModel =
  mongoose.models.project || mongoose.model("project", projectSchema);

export default projectModel;
