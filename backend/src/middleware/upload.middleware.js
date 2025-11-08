import multer from "multer";
import path from "path";

// ✅ Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/media"); // folder where files stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

// ✅ Allowed file types
const allowedTypes = [
  "audio/mpeg",     // .mp3
  "audio/wav",      // .wav
  "audio/mp4",      // .m4a
  "audio/x-m4a",
  "image/jpeg",
  "image/png"
];

function fileFilter(req, file, cb) {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only audio/image files are allowed."), false);
  }
}

// ✅ Upload Middleware
export const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter
});
