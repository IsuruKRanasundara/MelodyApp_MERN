import { ArrowLeft, Play, Pause, Clock, Calendar, Heart, Share, MoreHorizontal, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SongUploadForm from './SongUploadForm';

interface Song {
  _id: string;
  title: string;
  artist: string;
  image: string;
  albumId: string;
  audioUrl?: string;
  audioFile?: string;
  duration?: number;
  playCount?: number;
  releaseDate?: string;
}

interface Album {
  _id: string;
  title: string;
  artist: string;
  image: string;
  genre: string;
  releaseDate: string;
  songs?: string[];
}

interface CurrentTrack {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function AlbumDetail({ album, onBack, isDarkMode }: AlbumDetailProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch songs for this album
  useEffect(() => {
    const fetchAlbumSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/songs/album/${album._id}`);
        setSongs(response.data);
      } catch (error) {
        console.error('Failed to fetch album songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumSongs();
  }, [album._id]);

  // Play a song
  const playSong = (song: Song) => {
    console.log('Attempting to play song:', song);
    const audioUrl = song.audioUrl || (song.audioFile ? `http://localhost:5000/api/songs/${song._id}/stream` : null);
    
    console.log('Audio URL:', audioUrl);
    
    if (!audioUrl) {
      console.warn('No audio available for this song');
      alert('No audio file available for this song');
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    setCurrentTrack({
      song,
      isPlaying: true,
      currentTime: 0,
      duration: song.duration || 0
    });

    // Add error handling for audio loading
    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      console.error('Failed URL:', audioUrl);
      alert(`Failed to load audio: ${audioUrl}`);
      setCurrentTrack(prev => prev ? {...prev, isPlaying: false} : null);
    });

    audio.addEventListener('canplay', () => {
      console.log('Audio can start playing');
    });

    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
      alert(`Failed to play audio: ${err.message}`);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTrack(prev => prev ? {...prev, currentTime: audio.currentTime} : null);
    });

    audio.addEventListener('loadedmetadata', () => {
      setCurrentTrack(prev => prev ? {...prev, duration: audio.duration} : null);
    });

    audio.addEventListener('ended', () => {
      setCurrentTrack(prev => prev ? {...prev, isPlaying: false} : null);
    });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (currentTrack.isPlaying) {
      audioRef.current.pause();
      setCurrentTrack(prev => prev ? {...prev, isPlaying: false} : null);
    } else {
      audioRef.current.play();
      setCurrentTrack(prev => prev ? {...prev, isPlaying: true} : null);
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle song upload completion
  const handleSongAdded = () => {
    // Refetch songs after upload
    const fetchAlbumSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/songs/album/${album._id}`);
        setSongs(response.data);
      } catch (error) {
        console.error('Failed to fetch album songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumSongs();
    setShowUploadForm(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gradient-to-b from-zinc-800 to-zinc-900' : 'bg-gradient-to-b from-white to-gray-50'} px-6 pt-6 pb-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-full ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'} transition-colors shadow-lg`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Library</span>
          </button>

          {/* Album Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Album Cover */}
            <div className="relative group">
              <img
                src={album.image}
                alt={album.title}
                className="w-64 h-64 rounded-2xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300.png?text=Album';
                }}
              />
            </div>

            {/* Album Details */}
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Album
              </p>
              <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {album.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {album.artist}
                </span>
                <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(album.releaseDate).getFullYear()}
                </span>
                <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {songs.length} songs
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                  {album.genre}
                </span>
                <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(album.releaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {songs.length > 0 && (
                  <button
                    onClick={() => playSong(songs[0])}
                    className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                )}
                <button 
                  onClick={() => setShowUploadForm(true)}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center space-x-2 shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Song</span>
                </button>
                <button className={`p-3 rounded-full border ${isDarkMode ? 'border-zinc-600 hover:bg-zinc-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'} transition-colors`}>
                  <Heart className="w-5 h-5" />
                </button>
                <button className={`p-3 rounded-full border ${isDarkMode ? 'border-zinc-600 hover:bg-zinc-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'} transition-colors`}>
                  <Share className="w-5 h-5" />
                </button>
                <button className={`p-3 rounded-full border ${isDarkMode ? 'border-zinc-600 hover:bg-zinc-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'} transition-colors`}>
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
            {/* Table Header */}
            <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-zinc-700 bg-zinc-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                <div className={`col-span-1 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  #
                </div>
                <div className={`col-span-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Title
                </div>
                <div className={`col-span-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Artist
                </div>
                <div className={`col-span-1 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Plays
                </div>
                <div className={`col-span-1 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Clock className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </div>

            {/* Songs List */}
            {loading ? (
              <div className="px-6 py-8 text-center">
                <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Loading songs...
                </div>
              </div>
            ) : songs.length > 0 ? (
              <div>
                {songs.map((song, index) => (
                  <div
                    key={song._id}
                    className={`group px-6 py-3 hover:${isDarkMode ? 'bg-zinc-700/50' : 'bg-gray-50'} transition-colors duration-200 ${(song.audioUrl || song.audioFile) ? 'cursor-pointer' : 'cursor-default'} ${currentTrack?.song._id === song._id ? (isDarkMode ? 'bg-green-900/20' : 'bg-green-50') : ''}`}
                    onClick={() => {
                      if (song.audioUrl || song.audioFile) {
                        playSong(song);
                      } else {
                        alert('This song has no audio file available');
                      }
                    }}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Track Number / Play Button */}
                      <div className="col-span-1 text-center">
                        {currentTrack?.song._id === song._id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayPause();
                            }}
                            className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center"
                          >
                            {currentTrack.isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white ml-0.5" />
                            )}
                          </button>
                        ) : (
                          <div className="relative">
                            <span className={`group-hover:hidden text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {index + 1}
                            </span>
                            {(song.audioUrl || song.audioFile) ? (
                              <Play className={`w-4 h-4 hidden group-hover:block ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                            ) : (
                              <span className={`text-xs hidden group-hover:block ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                No Audio
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Song Info */}
                      <div className="col-span-6 flex items-center space-x-3">
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50.png?text=Song';
                          }}
                        />
                        <div>
                          <h4 className={`font-medium truncate ${currentTrack?.song._id === song._id ? 'text-green-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                            {song.title}
                          </h4>
                        </div>
                      </div>

                      {/* Artist */}
                      <div className={`col-span-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                        {song.artist}
                      </div>

                      {/* Play Count */}
                      <div className={`col-span-1 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {song.playCount || 0}
                      </div>

                      {/* Duration */}
                      <div className={`col-span-1 text-right text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {song.duration ? formatDuration(song.duration) : '--:--'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  No songs found
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  This album doesn't have any songs yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Music Player */}
      {currentTrack && (
        <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'} border-t backdrop-blur-lg z-50`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Track Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={currentTrack.song.image}
                  alt={currentTrack.song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className={`font-medium truncate max-w-64 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentTrack.song.title}
                  </h4>
                  <p className={`text-sm truncate max-w-64 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentTrack.song.artist}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center"
                >
                  {currentTrack.isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-3 min-w-0 flex-1 max-w-md mx-8">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDuration(currentTrack.currentTime)}
                </span>
                <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ 
                      width: currentTrack.duration > 0 
                        ? `${(currentTrack.currentTime / currentTrack.duration) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDuration(currentTrack.duration)}
                </span>
              </div>

              <div className="w-12"></div>
            </div>
          </div>
        </div>
      )}

      {/* Song Upload Form */}
      <SongUploadForm
        albumId={album._id}
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        onSongAdded={handleSongAdded}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}