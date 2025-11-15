import { Router } from "express";
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { getSong, streamSong, recordListen, uploadSong, getSongsByAlbum } from "../controllers/song.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ 
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept audio files
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'));
        }
    }
});

// simple health check / list placeholder
router.get("/", (req, res) => {
    res.send("Song route is working");
});

// get songs by album ID
router.get('/album/:albumId', getSongsByAlbum);

// get song metadata
router.get('/:id', getSong);

// stream audio (supports Range requests)
router.get('/:id/stream', streamSong);

// record a listen (increments playCount). Accepts optional { userId }
router.post('/:id/listen', recordListen);

// upload audio file and create song metadata (temporarily without auth for testing)
router.post('/upload', upload.single('file'), uploadSong);

export default router;
