import Album from '../models/album.model.js';

export const listAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const createAlbum = async (req, res) => {
  try {
    const newAlbum = new Album(req.body);
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};