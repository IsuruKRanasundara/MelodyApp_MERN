import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
// Configure Cloudinary (loads credentials from env)
import './config/cloudinary.config.js';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statsRoutes from './routes/stats.routes.js';
import playlistRoutes from './routes/playlist.route.js';
import spotifyRoutes from './routes/spotify.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();

let databaseConnection;

const ensureDatabaseConnection = () => {
  databaseConnection ??= connectDB();
  return databaseConnection;
};

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (_req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (_error) {
    res.status(500).json({ message: 'Unable to connect to the database' });
  }
});

// serve uploaded files
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/spotify', spotifyRoutes);
app.get('/', (_req, res) => {
  res.send('MelodyApp Backend is running.');
});

if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 5000;

  ensureDatabaseConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(() => {
      process.exitCode = 1;
    });
}

export default app;
