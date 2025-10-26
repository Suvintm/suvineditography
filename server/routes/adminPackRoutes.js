import express from "express";
import {
  createPack,
  getAllPacks,
  updatePack,
  deletePack,
} from "../controllers/adminPackController.js";

const router = express.Router();

// ADMIN ROUTES (You can later add auth middleware for admin check)
router.post("/create", createPack);
router.get("/", getAllPacks);
router.put("/:id", updatePack);
router.delete("/:id", deletePack);

export default router;
