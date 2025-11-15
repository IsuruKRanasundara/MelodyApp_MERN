import { useState } from 'react';
import { Music, Disc, User, Tag, Plus, X, Check, Calendar, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
export default function CreateAlbumForm({ isDarkMode, onCreated }: { isDarkMode: boolean; onCreated?: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    image: '',
    releaseDate: '' // yyyy-mm-dd
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // (Optional) preload albums removed; not required for create form.
  const genres = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical',
    'Electronic', 'Country', 'Blues', 'Reggae', 'Metal', 'Folk'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!formData.title.trim() || !formData.artist.trim() || !formData.genre.trim()) {
      setError('Please fill in Title, Artist, and Genre.');
      return;
    }

    const payload = {
      title: formData.title,
      artist: formData.artist,
      genre: formData.genre,
      image: formData.image || 'https://via.placeholder.com/300x300.png?text=Album',
      releaseDate: formData.releaseDate || new Date().toISOString().slice(0,10)
    };

    try {
      const response = await axios.post('http://localhost:5000/api/albums', payload);
      if (response.status === 201) {
        setSubmitted(true);
        if (onCreated) onCreated();
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ title: '', artist: '', genre: '', image: '', releaseDate: '' });
        }, 1500);
      }
    } catch (err: unknown) {
      const msg = (err instanceof Error ? err.message : 'Failed to create album');
      setError(msg);
      console.error('Failed to create album:', err);
    }
  };
  const handleReset = () => {
    setFormData({ title: '', artist: '', genre: '', image: '', releaseDate: '' });
    setSubmitted(false);
    setError(null);
  };

    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'} transition-colors duration-500 flex items-center justify-center p-6`}>
        {/* Theme Toggle */}
      

        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Disc className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <h1 className={`text-5xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create <span className="text-green-500">Album</span>
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill in the details to create your new album
            </p>
          </div>

          {/* Form */}
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl transition-all duration-500`}>
            {submitted ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  </div>
                </div>
                <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Album Created Successfully!
                </h2>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  Your album "{formData.title}" by {formData.artist} has been created.
                </p>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Create Another Album
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">{error}</div>
                )}
                {/* Album Title */}
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Music className="w-5 h-5 text-green-500" />
                    <span>Album Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter album title"
                    className={`w-full px-6 py-4 rounded-2xl ${isDarkMode
                        ? 'bg-zinc-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500'
                      } outline-none transition-all duration-300 text-lg`}
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <User className="w-5 h-5 text-green-500" />
                    <span>Artist Name</span>
                  </label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                    className={`w-full px-6 py-4 rounded-2xl ${isDarkMode
                        ? 'bg-zinc-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500'
                      } outline-none transition-all duration-300 text-lg`}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ImageIcon className="w-5 h-5 text-green-500" />
                    <span>Cover Image URL</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className={`w-full px-6 py-4 rounded-2xl ${isDarkMode
                        ? 'bg-zinc-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500'
                      } outline-none transition-all duration-300 text-lg`}
                  />
                </div>

                {/* Release Date */}
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>Release Date</span>
                  </label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 rounded-2xl ${isDarkMode
                        ? 'bg-zinc-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500'
                      } outline-none transition-all duration-300 text-lg`}
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Tag className="w-5 h-5 text-green-500" />
                    <span>Genre</span>
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 rounded-2xl ${isDarkMode
                        ? 'bg-zinc-700 text-white focus:ring-2 focus:ring-green-500'
                        : 'bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500'
                      } outline-none transition-all duration-300 text-lg cursor-pointer`}
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 group relative px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Create Album</span>
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                
                  <button
                    onClick={handleReset}
                    className={`px-8 py-4 ${isDarkMode
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      } rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Card */}
          {formData.title || formData.artist || formData.genre ? (
            <div className={`mt-6 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'} rounded-3xl p-6 shadow-xl transition-all duration-500`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Preview
              </h3>
              <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'} rounded-xl flex items-center justify-center overflow-hidden`}>
                  {formData.image ? (
                    <img src={formData.image} alt="cover" className="w-full h-full object-cover" />
                  ) : (
                    <Disc className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {formData.title || 'Album Title'}
                  </h4>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formData.artist || 'Artist Name'}
                  </p>
                  {formData.releaseDate && (
                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-1`}>
                      Released: {formData.releaseDate}
                    </p>
                  )}
                  {formData.genre && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      {formData.genre}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
