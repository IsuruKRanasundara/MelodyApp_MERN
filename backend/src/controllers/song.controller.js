import path from 'path';
import fs from 'fs';
import Song from '../models/song.model.js';
import User from '../models/user.model.js';
import { promisify } from 'util';
import cloudinary, { generateAudioPlaybackUrl, getFrontendAudioUrl } from '../config/cloudinary.config.js';
import axios from 'axios';
import { log } from 'console';

// Return song metadata
export const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    
    const songObj = song.toObject();
    
    // Add frontend-optimized URLs and debug info
    if (songObj.audioUrl) {
      try {
        songObj.frontendAudioUrl = getFrontendAudioUrl(songObj.audioUrl);
        songObj.streamUrl = `http://localhost:5000/api/songs/${songObj._id}/stream`;
      } catch (error) {
        console.error('Error generating frontend URL:', error);
        songObj.frontendAudioUrl = songObj.audioUrl; // fallback to original
        songObj.streamUrl = `http://localhost:5000/api/songs/${songObj._id}/stream`;
      }
    }
    
    const debugInfo = {
      hasAudioUrl: !!songObj.audioUrl,
      hasAudioFile: !!songObj.audioFile,
      audioUrl: songObj.audioUrl,
      audioFile: songObj.audioFile,
      frontendAudioUrl: songObj.frontendAudioUrl,
      streamUrl: songObj.streamUrl
    };
    console.log('Song debug info:', debugInfo);
    
    res.json({ ...songObj, debugInfo });
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
    
    // Add frontend-optimized URLs
    const songsWithUrls = songs.map(song => {
      const songObj = song.toObject();
      console.log('Processing song:', songObj.title);
      console.log('Song data - audioUrl:', songObj.audioUrl, 'audioFile:', songObj.audioFile);
      
      // Always include audioUrl if it exists (Cloudinary URL)
      if (songObj.audioUrl) {
        try {
          // Try to generate optimized URL, but fallback to original if needed
          const optimizedUrl = getFrontendAudioUrl(songObj.audioUrl);
          // Set frontendAudioUrl - use the Cloudinary URL (either optimized or original)
          songObj.frontendAudioUrl = optimizedUrl || songObj.audioUrl;
          // Keep original audioUrl in response for fallback
          // songObj.audioUrl is already set from database
          songObj.streamUrl = `http://localhost:5000/api/songs/${songObj._id}/stream`;
          console.log('Generated URLs for', songObj.title, ':', {
            original: songObj.audioUrl,
            frontend: songObj.frontendAudioUrl,
            stream: songObj.streamUrl,
            hasCloudinary: !!songObj.audioUrl
          });
        } catch (error) {
          console.error('Error generating URLs for song', songObj.title, ':', error);
          // Always fallback to original URL - browsers can usually play it directly
          songObj.frontendAudioUrl = songObj.audioUrl;
          songObj.streamUrl = `http://localhost:5000/api/songs/${songObj._id}/stream`;
        }
      } else if (songObj.audioFile) {
        // Only set streamUrl for local files (no Cloudinary URL)
        songObj.streamUrl = `http://localhost:5000/api/songs/${songObj._id}/stream`;
        console.log('Local file for', songObj.title, '- streamUrl:', songObj.streamUrl);
      }
      
      // Ensure audioUrl is explicitly included in response (even if null/undefined)
      // This helps frontend distinguish between Cloudinary URLs and local files
      const responseObj = {
        ...songObj,
        audioUrl: songObj.audioUrl || null, // Explicitly include, even if null
        frontendAudioUrl: songObj.frontendAudioUrl || null,
        audioFile: songObj.audioFile || null,
        streamUrl: songObj.streamUrl || null
      };
      
      // Ensure audioUrl is explicitly included in response
      console.log('Final song object for', responseObj.title, ':', {
        _id: responseObj._id,
        title: responseObj.title,
        audioUrl: responseObj.audioUrl,
        frontendAudioUrl: responseObj.frontendAudioUrl,
        audioFile: responseObj.audioFile,
        streamUrl: responseObj.streamUrl,
        hasCloudinary: !!responseObj.audioUrl,
        hasLocalFile: !!responseObj.audioFile
      });
      
      return responseObj;
    });
    
    res.json(songsWithUrls);
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

    console.log('Streaming song:', song.title, 'audioUrl:', song.audioUrl, 'audioFile:', song.audioFile);

    // Set CORS headers for audio streaming
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

    // If song has Cloudinary URL, return it with proper headers
    // Note: For Cloudinary URLs, frontend should use them directly, not through this endpoint
    // This endpoint should primarily be used for local file streaming
    if (song.audioUrl) {
      console.log('Song has Cloudinary URL, but stream endpoint should only handle local files');
      console.log('Cloudinary URL:', song.audioUrl);
      // Return error suggesting to use the URL directly
      return res.status(400).json({ 
        message: 'This song uses Cloudinary. Please use the audioUrl or frontendAudioUrl directly.',
        audioUrl: song.audioUrl 
      });
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
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Length'
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
// Workflow:
// 1. Upload file via multer (saves to local storage temporarily)
// 2. Upload to Cloudinary CDN and get CDN URL
// 3. Store the CDN URL with song data in MongoDB
export const uploadSong = async (req, res) => {
  try {
    console.log('Upload song request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    // Step 1: Check if file was uploaded via multer
    const file = req.file;
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Missing file' });
    }

    // Validate required metadata fields
    const { title, artist, image, albumId, releaseDate, genre } = req.body;
    if (!title || !artist || !image || !albumId || !releaseDate || !genre) {
      console.log('Missing metadata fields');
      
      try { fs.existsSync(file.path) && fs.unlinkSync(file.path); } catch (_) {}
      return res.status(400).json({ message: 'Missing metadata fields' });
    }

    
    let audioUrl = null;
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    console.log('Has Cloudinary config:', hasCloudinary);
    
    if (hasCloudinary) {
      
      if (!cloudinary || !cloudinary.uploader) {
        console.error('Cloudinary is not properly initialized');
        try { 
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (_) {}
        return res.status(500).json({ 
          message: 'Cloudinary is not properly configured. Please check your imports and configuration.' 
        });
      }

      try {
     
        if (!fs.existsSync(file.path)) {
          throw new Error('Uploaded file not found on disk');
        }

        console.log('Uploading to Cloudinary CDN...');
        console.log('File path:', file.path);
        console.log('File size:', file.size);
        console.log('File mimetype:', file.mimetype);
        console.log('Cloudinary uploader available:', !!cloudinary.uploader);
        console.log('Cloudinary config:', {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
          api_key:process.env.CLOUDINARY_API_KEY  ? 'Set' : 'Missing',
          api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
        });
        
        
        console.log('Starting Cloudinary upload...');
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          resource_type: "video", 
          format: "mp3",
          audio_bitrate: "96k",
          secure: true,
          folder: "MelodyApp",
        });
        
        console.log('Cloudinary upload completed, processing response...');
        
   
        if (!uploadRes) {
          throw new Error('Cloudinary upload returned no response');
        }

        
        audioUrl = uploadRes.secure_url || uploadRes.url;
        
        if (!audioUrl) {
          throw new Error('Cloudinary upload succeeded but no URL was returned in response');
        }
        
        console.log('Cloudinary CDN upload successful');
        console.log('CDN URL:', audioUrl);
        console.log('Cloudinary response:', {
          public_id: uploadRes.public_id,
          format: uploadRes.format,
          resource_type: uploadRes.resource_type,
          duration: uploadRes.duration,
          bytes: uploadRes.bytes,
          width: uploadRes.width,
          height: uploadRes.height,
          secure_url: uploadRes.secure_url,
          url: uploadRes.url
        });
        
        try { 
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log('Local file cleaned up after Cloudinary upload');
          }
        } catch (cleanupError) {
          console.warn('Failed to cleanup local file:', cleanupError);
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary CDN upload failed:', cloudinaryError);
        
        try {
          const errorDetails = {
            message: cloudinaryError?.message,
            http_code: cloudinaryError?.http_code,
            name: cloudinaryError?.name,
            code: cloudinaryError?.code,
            errno: cloudinaryError?.errno,
            syscall: cloudinaryError?.syscall,
            path: cloudinaryError?.path,
            status: cloudinaryError?.status,
            statusText: cloudinaryError?.statusText
          };
          console.error('Error details:', errorDetails);
          
          try {
            console.error('Error string:', String(cloudinaryError));
          } catch (_) {}
        } catch (logError) {
          console.error('Error logging failed:', logError);
        }
        
        let errorMessage = 'Unknown Cloudinary error';
        if (cloudinaryError?.message) {
          errorMessage = cloudinaryError.message;
        } else if (typeof cloudinaryError === 'string') {
          errorMessage = cloudinaryError;
        } else if (cloudinaryError?.http_code) {
          errorMessage = `Cloudinary API error: HTTP ${cloudinaryError.http_code}`;
        }
        
        try { 
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (_) {}
        return res.status(500).json({ 
          message: 'Failed to upload file to CDN', 
          error: errorMessage,
          details: cloudinaryError?.http_code ? `HTTP ${cloudinaryError.http_code}` : undefined,
          type: cloudinaryError?.name || typeof cloudinaryError
        });
      }
    } else {
      console.log('Cloudinary not configured, using local file storage');
    }

    console.log('Preparing song data for MongoDB...');
    console.log('Release date input:', releaseDate);
    
    let parsedReleaseDate;
    try {
      parsedReleaseDate = new Date(releaseDate);
      if (isNaN(parsedReleaseDate.getTime())) {
        throw new Error(`Invalid date format: ${releaseDate}`);
      }
      console.log('Parsed release date:', parsedReleaseDate);
    } catch (dateError) {
      console.error('Date parsing error:', dateError);
      try { 
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (_) {}
      return res.status(400).json({ 
        message: 'Invalid release date format', 
        error: dateError.message 
      });
    }
    
    const songData = {
      title,
      artist,
      image,
      albumId,
      releaseDate: parsedReleaseDate,
      genre,
      audioUrl: audioUrl || undefined,
      audioFile: audioUrl ? undefined : file.filename
    };

    console.log('Creating song with data:', JSON.stringify(songData, null, 2));
    
    try {
      const song = new Song(songData);
      console.log('Song model created, saving to MongoDB...');
      await song.save();
      console.log('Song saved successfully in MongoDB:', song._id);
      res.status(201).json(song);
    } catch (mongoError) {
      console.error('MongoDB save error:', mongoError);
      console.error('MongoDB error details:', {
        message: mongoError?.message,
        name: mongoError?.name,
        code: mongoError?.code,
        codeName: mongoError?.codeName,
        errors: mongoError?.errors
      });
      
      // Cleanup local file if MongoDB save fails
      try { 
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (_) {}
      
      return res.status(500).json({ 
        message: 'Failed to save song to database', 
        error: mongoError?.message || 'Unknown MongoDB error',
        details: mongoError?.code ? `Error code: ${mongoError.code}` : undefined
      });
    }
  } catch (err) {
    console.error('Upload error:', err);
    
    // Safely log error details
    try {
      const errorDetails = {
        message: err?.message,
        name: err?.name,
        code: err?.code,
        errno: err?.errno,
        syscall: err?.syscall,
        path: err?.path,
        status: err?.status,
        statusText: err?.statusText,
        type: typeof err
      };
      console.error('Error details:', errorDetails);
      
      // Try to get string representation
      try {
        console.error('Error string:', String(err));
      } catch (_) {}
    } catch (logError) {
      console.error('Error logging failed:', logError);
    }
    
    // Get error message
    let errorMessage = 'Unknown server error';
    if (err?.message) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err?.name) {
      errorMessage = `${err.name}: ${err.message || 'Unknown error'}`;
    }
    
    // Cleanup local file if something went wrong
    if (req.file && req.file.path) {
      try { 
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: errorMessage,
      type: err?.name || typeof err,
      details: err?.code ? `Error code: ${err.code}` : undefined
    });
  }
};
