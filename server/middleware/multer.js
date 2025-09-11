// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure temp folder exists
// const tempDir = path.join(process.cwd(), "temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// export default upload;
// middleware/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

const tmpDir = path.join(process.cwd(), "tmp_uploads");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, base + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // accept images & videos (jpg/png/jpeg/webp/gif/mp4/mov/webm)
  const allowed = /jpeg|jpg|png|webp|gif|mp4|mov|webm/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit (adjust as needed)
  },
});

export default upload;
