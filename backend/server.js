require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const songsRoutes = require('./routes/songs');
const playlistsRoutes = require('./routes/playlists');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure uploads dir exists and serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// passport (conditionally initialize Google strategy to avoid startup crash when env is missing)
const hasGoogleCreds = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
if (hasGoogleCreds) {
  try {
    require('./config/passport')(passport);
    app.use(passport.initialize());
  } catch (e) {
    console.error('Failed to configure Google OAuth strategy:', e.message);
  }
} else {
  console.warn('Google OAuth not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env');
}

// routes
app.use('/auth', authRoutes);
app.use('/songs', songsRoutes);
app.use('/playlists', playlistsRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoUri = process.env.MONGO_URI;
  try {
    await mongoose.connect(mongoUri, { autoIndex: true });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();

module.exports = app;
