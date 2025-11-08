import path from 'path';
import fs from 'fs';
import Song from '../models/song.model.js';
import User from '../models/user.model.js';
import { promisify } from 'util';

// Return song metadata
export const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Stream audio file supporting Range requests
export const streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song || !song.audioFile) return res.status(404).json({ message: 'Song or audio file not found' });

    // uploads directory is expected at project root backend/uploads
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, song.audioFile);

    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Audio file not found on disk' });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg'
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Record a listen (increment playCount and optionally save to user's history)
export const recordListen = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};

    const song = await Song.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true });
    if (!song) return res.status(404).json({ message: 'Song not found' });

    if (userId) {
      // push to user listening history (keep recent history manageable elsewhere)
      await User.findByIdAndUpdate(userId, { $push: { listeningHistory: { song: id } } });
    }

    res.json({ message: 'Recorded listen', playCount: song.playCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create song metadata after file upload
export const uploadSong = async (req, res) => {
  try {
    // multer will attach file to req.file
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Missing file' });

    const { title, artist, image, albumId, releaseDate, genre } = req.body;
    if (!title || !artist || !image || !albumId || !releaseDate || !genre) {
      return res.status(400).json({ message: 'Missing metadata fields' });
    }

    const song = new Song({
      title,
      artist,
      image,
      albumId,
      releaseDate: new Date(releaseDate),
      genre,
      audioFile: file.filename
    });

    await song.save();
    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
