// server/routes/projectRoute.js
import express from "express";
import userAuth from "../middleware/auth.js"; // your existing JWT auth
import upload from "../middleware/upload.js"; // memory multer
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.use(userAuth);

// Create: supports either multipart (field: "thumbnail") or JSON body with imageDataURL
projectRouter.post("/", upload.single("thumbnail"), createProject);

// Read
projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProjectById);

// Update: can include new "thumbnail" file OR "imageDataURL"
projectRouter.put("/:id", upload.single("thumbnail"), updateProject);

// Delete
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
