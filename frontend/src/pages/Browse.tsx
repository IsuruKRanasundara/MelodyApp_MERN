import { Music, Search, Play, Pause, SkipForward, Volume2, Heart, ExternalLink } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';

interface SpotifyTrack {
  id: string;
  title: string;
  artists: { id: string; name: string }[];
  album: { id: string; name: string; image: string } | null;
  duration_ms: number;
  preview_url: string;
  spotifyUrl: string;
}

interface SpotifyResponse {
  type: string;
  songs: SpotifyTrack[];
  album?: { id: string; name: string; image: string };
  playlist?: { id: string; name: string; image: string };
}

interface CurrentTrack {
  track: SpotifyTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export default function MusicBrowseTab({ isDarkMode }: { isDarkMode: boolean }) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [searchUrl, setSearchUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Search for Spotify tracks
  const searchSpotify = async () => {
    if (!searchUrl.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/spotify/resolve', {
        url: searchUrl.trim()
      });
      const data: SpotifyResponse = response.data;
      setTracks(data.songs || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch from Spotify';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Play a track
  const playTrack = (track: SpotifyTrack) => {
    if (!track.preview_url) {
      setError('No preview available for this track');
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.preview_url);
    audioRef.current = audio;

    setCurrentTrack({
      track,
      isPlaying: true,
      currentTime: 0,
      duration: 30 // Spotify previews are 30s
    });

    audio.play();

    audio.addEventListener('timeupdate', () => {
      setCurrentTrack(prev => prev ? {...prev, currentTime: audio.currentTime} : null);
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

  // Stop current track
  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTrack(null);
  };

  // Format duration
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-500`}>
      {/* Theme Toggle */}
      

      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="animate-pulse">
              <div className={`w-16 h-16 ${isDarkMode ? 'bg-green-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-lg`}>
                <Music className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-500`}>
                Browse <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Music</span>
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Explore millions of songs across all genres
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Enter Spotify URL (track, album, or playlist)..."
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSpotify()}
              className={`w-full px-6 py-4 rounded-full ${isDarkMode ? 'bg-zinc-800 text-white placeholder-gray-500' : 'bg-green-50 text-gray-900 placeholder-gray-500'} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 pr-14`}
            />
            <button 
              onClick={searchSpotify}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 disabled:opacity-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Example URLs */}
          <div className="max-w-2xl mt-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Example URLs:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
                'https://open.spotify.com/album/382ObEPsp2rxGrnsizN5TX',
                'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
              ].map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSearchUrl(url)}
                  className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-zinc-700 text-green-400 hover:bg-zinc-600' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors`}
                >
                  {index === 0 ? 'Track' : index === 1 ? 'Album' : 'Playlist'}
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mt-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {tracks.length > 0 && (
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Tracks
            </h2>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded-2xl h-80 animate-pulse`}>
                  <div className={`w-full h-48 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded-t-2xl`}></div>
                  <div className="p-4 space-y-2">
                    <div className={`h-4 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                    <div className={`h-3 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`group ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-white hover:bg-gray-50'} 
                    rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  {/* Track Cover */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={track.album?.image || 'https://via.placeholder.com/300x300.png?text=Track'}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => playTrack(track)}
                        disabled={!track.preview_url}
                        className="w-16 h-16 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                    {!track.preview_url && (
                      <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="p-4">
                    <h3 className={`font-bold text-lg mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {track.title}
                    </h3>
                    <p className={`text-sm mb-2 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {track.artists.map(a => a.name).join(', ')}
                    </p>
                    {track.album && (
                      <p className={`text-xs mb-3 truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {track.album.name}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatTime(track.duration_ms / 1000)}
                      </span>
                      <div className="flex space-x-2">
                        <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'}`}>
                          <Heart className="w-4 h-4" />
                        </button>
                        <a
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Music Player */}
      {currentTrack && (
        <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'} border-t backdrop-blur-lg z-50`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Track Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={currentTrack.track.album?.image || 'https://via.placeholder.com/50x50.png?text=Track'}
                  alt={currentTrack.track.title}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h4 className={`font-semibold truncate max-w-64 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentTrack.track.title}
                  </h4>
                  <p className={`text-sm truncate max-w-64 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentTrack.track.artists.map(a => a.name).join(', ')}
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
                <button onClick={stopTrack} className={`p-2 rounded ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-3 min-w-0 flex-1 max-w-md mx-8">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatTime(currentTrack.currentTime)}
                </span>
                <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${(currentTrack.currentTime / currentTrack.duration) * 100}%` }}
                  />
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatTime(currentTrack.duration)}
                </span>
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Music Notes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/4 top-1/4 animate-bounce opacity-20" style={{ animationDelay: '0s', animationDuration: '4s' }}>
          <svg className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div className="absolute right-1/3 top-1/3 animate-bounce opacity-20" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <svg className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
      </div>

      {/* Animated Wave Background */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1440 320" className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
              M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,165.3C960,160,1056,128,1152,122.7C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
        </svg>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}