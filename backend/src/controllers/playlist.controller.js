import Playlist from '../models/playlist.model.js';

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { title, songs = [] } = req.body;
    if (!title) return res.status(400).json({ message: 'Missing title' });
    const playlist = new Playlist({ title, user: userId, songs });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const playlists = await Playlist.find({ user: userId }).populate('songs');
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPlaylist = async (req, res) => {
  try {
    const pl = await Playlist.findById(req.params.id).populate('songs');
    if (!pl) return res.status(404).json({ message: 'Playlist not found' });
    res.json(pl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
