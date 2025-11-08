import { Router } from "express";
import path from 'path';
import multer from 'multer';
import { getSong, streamSong, recordListen, uploadSong } from "../controllers/song.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// simple health check / list placeholder
router.get("/", (req, res) => {
    res.send("Song route is working");
});

// get song metadata
router.get('/:id', getSong);

// stream audio (supports Range requests)
router.get('/:id/stream', streamSong);

// record a listen (increments playCount). Accepts optional { userId }
router.post('/:id/listen', recordListen);

// upload audio file and create song metadata (protected)
router.post('/upload', authenticate, upload.single('file'), uploadSong);

export default router;
