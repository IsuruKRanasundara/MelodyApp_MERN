// server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const songsRoutes = require('./routes/songs');
const playlistsRoutes = require('./routes/playlists');

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

module.exports = app;