import path from 'path';
import fs from 'fs';
import Song from '../models/song.model.js';
import User from '../models/user.model.js';
import { promisify } from 'util';
import cloudinary from '../config/cloudinary.config.js';

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

// Get songs by album ID
export const getSongsByAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const songs = await Song.find({ albumId });
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Stream audio file supporting Range requests
export const streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // If song has Cloudinary URL, redirect client to stream from Cloudinary
    if (song.audioUrl) {
      return res.redirect(302, song.audioUrl);
    }

    if (!song.audioFile) return res.status(404).json({ message: 'Audio file not found' });

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
    console.log('Upload song request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    // multer will attach file to req.file
    const file = req.file;
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Missing file' });
    }

    const { title, artist, image, albumId, releaseDate, genre } = req.body;
    if (!title || !artist || !image || !albumId || !releaseDate || !genre) {
      console.log('Missing metadata fields');
      return res.status(400).json({ message: 'Missing metadata fields' });
    }

    let audioUrl;
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    console.log('Has Cloudinary config:', hasCloudinary);
    
    if (hasCloudinary) {
      try {
        console.log('Uploading to Cloudinary...');
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          resource_type: 'auto',
          folder: 'melodyapp/audio'
        });
        audioUrl = uploadRes.secure_url;
        console.log('Cloudinary upload successful:', audioUrl);
      } catch (e) {
        console.error('Cloudinary upload failed:', e);
      } finally {
        // cleanup local file if it exists
        try { fs.existsSync(file.path) && fs.unlinkSync(file.path); } catch (_) {}
      }
    } else {
      console.log('Using local file storage');
    }

    const songData = {
      title,
      artist,
      image,
      albumId,
      releaseDate: new Date(releaseDate),
      genre,
      audioFile: audioUrl ? undefined : file.filename,
      audioUrl: audioUrl || undefined
    };

    console.log('Creating song with data:', songData);
    const song = new Song(songData);

    await song.save();
    console.log('Song saved successfully:', song);
    res.status(201).json(song);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
