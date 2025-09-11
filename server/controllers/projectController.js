import projectModel from "../model/projectModel.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// helpers
const uploadBufferToCloudinary = (buffer, folder = "suvin-studio/projects") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", quality: "auto", fetch_format: "auto" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const uploadDataUrlToCloudinary = async (
  dataURL,
  folder = "suvin-studio/projects"
) => {
  const res = await cloudinary.uploader.upload(dataURL, {
    folder,
    resource_type: "image",
    quality: "auto",
    fetch_format: "auto",
  });
  return res;
};

const destroyIfExists = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {}
};

// Create project
export const createProject = async (req, res) => {
  try {
    const { projectName, canvasWidth = 600, canvasHeight = 600 } = req.body;
    if (!projectName)
      return res
        .status(400)
        .json({ success: false, message: "projectName is required" });

    const defaultCanvasState = { objects: [], background: "#ffffff" };
    const defaultThumbnailURL =
      "https://res.cloudinary.com/dpmral3ya/image/upload/v1755353763/suvin-studio/projects/hj2kbep2ykwndxlkvnnl.png";
    const defaultThumbnailPublicId =
      "suvin-studio/projects/hj2kbep2ykwndxlkvnnl";

    const project = await projectModel.create({
      userId: req.user.id,
      projectName,
      canvasState: defaultCanvasState,
      canvasWidth,
      canvasHeight,
      imageURL: defaultThumbnailURL,
      imagePublicId: defaultThumbnailPublicId,
    });

    return res.json({ success: true, project });
  } catch (err) {
    console.error("createProject:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create project" });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await projectModel
      .find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    return res.json({ success: true, projects });
  } catch (err) {
    console.error("getProjects:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch projects" });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });

    const project = await projectModel.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Not found" });

    if (!project.userId.equals(req.user.id))
      return res.status(403).json({ success: false, message: "Forbidden" });

    return res.json({ success: true, project });
  } catch (err) {
    console.error("getProjectById:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch project" });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });

    const {
      projectName,
      canvasState,
      canvasWidth,
      canvasHeight,
      imageDataURL,
    } = req.body;
    const project = await projectModel.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Not found" });

    if (!project.userId.equals(req.user.id))
      return res.status(403).json({ success: false, message: "Forbidden" });

    if (projectName) project.projectName = projectName;
    if (canvasState)
      project.canvasState =
        typeof canvasState === "string" ? JSON.parse(canvasState) : canvasState;
    if (canvasWidth) project.canvasWidth = canvasWidth;
    if (canvasHeight) project.canvasHeight = canvasHeight;

    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      await destroyIfExists(project.imagePublicId);
      project.imageURL = uploaded.secure_url;
      project.imagePublicId = uploaded.public_id;
    } else if (imageDataURL) {
      const uploaded = await uploadDataUrlToCloudinary(imageDataURL);
      await destroyIfExists(project.imagePublicId);
      project.imageURL = uploaded.secure_url;
      project.imagePublicId = uploaded.public_id;
    }

    project.updatedAt = Date.now();
    await project.save();
    return res.json({ success: true, project });
  } catch (err) {
    console.error("updateProject:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update project" });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });

    const project = await projectModel.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Not found" });

    if (!project.userId.equals(req.user.id))
      return res.status(403).json({ success: false, message: "Forbidden" });

    await destroyIfExists(project.imagePublicId);
    await project.deleteOne();

    return res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    console.error("deleteProject:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete project" });
  }
};
