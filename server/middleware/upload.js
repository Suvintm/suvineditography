// server/middleware/upload.js
import multer from "multer";

// keep files in memory, we stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
