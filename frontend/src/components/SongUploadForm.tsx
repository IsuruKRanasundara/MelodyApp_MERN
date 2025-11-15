import { Upload, X, Music, Loader, Check } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface SongUploadFormProps {
  albumId: string;
  isOpen: boolean;
  onClose: () => void;
  onSongAdded: () => void;
  isDarkMode: boolean;
}

interface SongFormData {
  title: string;
  artist: string;
  image: string;
  releaseDate: string;
  genre: string;
  audioFile: File | null;
}

export default function SongUploadForm({ albumId, isOpen, onClose, onSongAdded, isDarkMode }: SongUploadFormProps) {
  const [formData, setFormData] = useState<SongFormData>({
    title: '',
    artist: '',
    image: '',
    releaseDate: new Date().toISOString().split('T')[0],
    genre: '',
    audioFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/ogg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid audio file (MP3, WAV, FLAC, OGG)');
        return;
      }
      
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError('File size must be less than 50MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        audioFile: file
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      // Validate form
      if (!formData.title || !formData.artist || !formData.audioFile || !formData.genre) {
        throw new Error('Please fill in all required fields and select an audio file');
      }

      // Create FormData for multipart upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('artist', formData.artist);
      uploadData.append('image', formData.image || 'https://via.placeholder.com/300x300.png?text=Song');
      uploadData.append('albumId', albumId);
      uploadData.append('releaseDate', formData.releaseDate);
      uploadData.append('genre', formData.genre);
      uploadData.append('file', formData.audioFile);

      // Upload song to backend
      await axios.post('http://localhost:5000/api/songs/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add auth token if available
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSongAdded();
        onClose();
        // Reset form
        setFormData({
          title: '',
          artist: '',
          image: '',
          releaseDate: new Date().toISOString().split('T')[0],
          genre: '',
          audioFile: null
        });
      }, 1000);

    } catch (err: unknown) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload song';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 401) {
          errorMessage = 'Authentication required. Please sign in to upload songs.';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add New Song
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload a new song to this album
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'} transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audio File Upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Audio File *
              </label>
              <div className={`border-2 border-dashed ${formData.audioFile ? 'border-green-500 bg-green-50' : (isDarkMode ? 'border-zinc-600 bg-zinc-800' : 'border-gray-300 bg-gray-50')} rounded-lg p-6 text-center transition-colors`}>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="audio-upload"
                  className={`cursor-pointer ${uploading ? 'cursor-not-allowed' : ''}`}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${formData.audioFile ? 'text-green-500' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`} />
                  {formData.audioFile ? (
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formData.audioFile.name}
                      </p>
                      <p className="text-green-500 text-sm">
                        {(formData.audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Click to select audio file
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        MP3, WAV, FLAC, OGG up to 50MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Song Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Song Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter song title"
                className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                disabled={uploading}
                required
              />
            </div>

            {/* Artist */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Artist *
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                disabled={uploading}
                required
              />
            </div>

            {/* Genre */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Genre *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                disabled={uploading}
                required
              >
                <option value="">Select genre</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Electronic">Electronic</option>
                <option value="Classical">Classical</option>
                <option value="Jazz">Jazz</option>
                <option value="Country">Country</option>
                <option value="R&B">R&B</option>
                <option value="Indie">Indie</option>
                <option value="Alternative">Alternative</option>
                <option value="Folk">Folk</option>
                <option value="Blues">Blues</option>
                <option value="Reggae">Reggae</option>
                <option value="World">World</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Cover Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/song-cover.jpg (optional)"
                className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-zinc-800 border-zinc-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                disabled={uploading}
              />
            </div>

            {/* Release Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Release Date
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
                disabled={uploading}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-green-500 text-sm font-medium">Song uploaded successfully!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-lg border ${isDarkMode ? 'border-zinc-600 text-gray-300 hover:bg-zinc-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors font-medium`}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !formData.audioFile || !formData.title || !formData.artist || !formData.genre}
                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Song</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}