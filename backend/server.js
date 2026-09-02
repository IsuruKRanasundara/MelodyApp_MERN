// server.js

import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './src/routes/auth.routes.js';
import songsRoutes from './src/routes/song.route.js';
import playlistsRoutes from './src/routes/playlist.route.js';

const app = express();

/*
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * API Routes
 */
app.use('/auth', authRoutes);
app.use('/songs', songsRoutes);
app.use('/playlists', playlistsRoutes);

/*
 * Server configuration
 *
 * Development:
 *   Always runs on port 5000.
 *
 * Production:
 *   PORT must be provided through the production environment.
 */
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.PORT) {
  console.error('PORT environment variable is required in production');
  process.exit(1);
}

const PORT = isProduction ? Number(process.env.PORT) : 5000;

/*
 * Start the application only after MongoDB connects successfully.
 */
async function start() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is required');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(
        `Server listening on port ${PORT} in ${
          isProduction ? 'production' : 'development'
        } mode`,
      );
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();

export default app;
