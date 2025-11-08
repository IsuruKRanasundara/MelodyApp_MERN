import Song from '../models/song.model.js';

// return top songs by playCount
export const topSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const songs = await Song.find().sort({ playCount: -1 }).limit(limit);
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const totalPlays = async (req, res) => {
  try {
    const result = await Song.aggregate([{ $group: { _id: null, total: { $sum: '$playCount' } } }]);
    res.json({ totalPlays: result[0] ? result[0].total : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
