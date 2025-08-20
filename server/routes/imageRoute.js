import express from "express";
import { removeBgImage } from "../controllers/ImageController.js";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/auth.js";

const imageRouter = express.Router();

imageRouter.post("/remove-bg", upload.single("image"), userAuth, removeBgImage);

export default imageRouter;
