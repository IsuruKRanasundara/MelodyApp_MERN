// Simple seed script to populate the database with sample users, albums, songs, and a playlist.
// Run with: npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Album from '../models/album.model.js';
import Song from '../models/song.model.js';
import Playlist from '../models/playlist.model.js';

async function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/melodyapp';
  await mongoose.connect(uri, { dbName: undefined });
  console.log('Connected to MongoDB');
}

async function clear() {
  await Promise.all([
    User.deleteMany({}),
    Album.deleteMany({}),
    Song.deleteMany({}),
    Playlist.deleteMany({})
  ]);
  console.log('Cleared existing collections');
}

async function seed() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await User.insertMany([
    { username: 'alice', email: 'alice@example.com', password: passwordHash },
    { username: 'bob', email: 'bob@example.com', password: passwordHash }
  ]);
  console.log(`Inserted users: ${users.map(u => u.username).join(', ')}`);

  const albums = await Album.insertMany([
    {
      title: 'Neon Dreams',
      artist: 'Atlas Echo',
      image: 'https://via.placeholder.com/300x300.png?text=Neon+Dreams',
      releaseDate: new Date('2023-08-15'),
      genre: 'Electronic'
    },
    {
      title: 'Midnight Stories',
      artist: 'Luna Wave',
      image: 'https://via.placeholder.com/300x300.png?text=Midnight+Stories',
      releaseDate: new Date('2024-02-10'),
      genre: 'Pop'
    }
  ]);
  console.log(`Inserted albums: ${albums.map(a => a.title).join(', ')}`);

  const songs = await Song.insertMany([
    {
      title: 'City Lights',
      artist: 'Atlas Echo',
      image: 'https://via.placeholder.com/300x300.png?text=City+Lights',
      albumId: albums[0]._id,
      releaseDate: new Date('2023-08-15'),
      genre: 'Electronic',
      playCount: 42,
      audioUrl: 'https://example.com/audio/city-lights.mp3'
    },
    {
      title: 'Dream Sequence',
      artist: 'Atlas Echo',
      image: 'https://via.placeholder.com/300x300.png?text=Dream+Sequence',
      albumId: albums[0]._id,
      releaseDate: new Date('2023-08-15'),
      genre: 'Electronic',
      playCount: 17,
      audioUrl: 'https://example.com/audio/dream-sequence.mp3'
    },
    {
      title: 'Afterglow',
      artist: 'Luna Wave',
      image: 'https://via.placeholder.com/300x300.png?text=Afterglow',
      albumId: albums[1]._id,
      releaseDate: new Date('2024-02-10'),
      genre: 'Pop',
      playCount: 5,
      audioUrl: 'https://example.com/audio/afterglow.mp3'
    }
  ]);
  console.log(`Inserted songs: ${songs.map(s => s.title).join(', ')}`);

  // update album song refs
  for (const album of albums) {
    const albumSongs = songs.filter(s => s.albumId.toString() === album._id.toString());
    album.songs = albumSongs.map(s => s._id);
    await album.save();
  }
  console.log('Linked songs to albums');

  const playlist = await Playlist.create({
    title: 'Starter Mix',
    user: users[0]._id,
    songs: songs.map(s => s._id)
  });
  console.log(`Created playlist: ${playlist.title}`);

  // Add listening history sample
  await User.findByIdAndUpdate(users[0]._id, {
    $push: {
      listeningHistory: songs.slice(0,2).map(s => ({ song: s._id }))
    }
  });
  console.log('Added listening history');

  return { users, albums, songs, playlist };
}

async function main() {
  try {
    await connect();
    await clear();
    const data = await seed();
    console.log('\nSeed complete. Sample IDs:');
    console.log({
      user: data.users[0]._id.toString(),
      album: data.albums[0]._id.toString(),
      song: data.songs[0]._id.toString(),
      playlist: data.playlist._id.toString()
    });
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
