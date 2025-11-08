import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statsRoutes from './routes/stats.routes.js';
import playlistRoutes from './routes/playlist.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// start server after DB connection
const start = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

start();