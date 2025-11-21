import { Music, Search, Play, Pause, SkipForward, Volume2, Heart, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [searchUrl, setSearchUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventListenersRef = useRef<{ audio: HTMLAudioElement; handlers: { event: string; handler: (e?: Event) => void }[] } | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
      // Clean up event listeners
      if (eventListenersRef.current) {
        eventListenersRef.current.handlers.forEach(({ event, handler }) => {
          eventListenersRef.current!.audio.removeEventListener(event, handler);
        });
        eventListenersRef.current = null;
      }
    };
  }, []);

  // Check if input is a URL
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Check if input is a Spotify URL
  const isSpotifyUrl = (str: string) => {
    return str.includes('spotify.com') || str.startsWith('spotify:');
  };

  // Search for Spotify tracks (supports both URL and text search)
  const searchSpotify = async () => {
    if (!searchUrl.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const searchQuery = searchUrl.trim();
      
      // If it's a Spotify URL, use the resolve endpoint
      if (isUrl(searchQuery) && isSpotifyUrl(searchQuery)) {
        const response = await axios.post('http://localhost:5000/api/spotify/resolve', {
          url: searchQuery
        });
        const data: SpotifyResponse = response.data;
        setTracks(data.songs || []);
      } else {
        // Otherwise, use text search (artist name, song name, etc.)
        const response = await axios.get('http://localhost:5000/api/spotify/songs', {
          params: { q: searchQuery }
        });
        const data: SpotifyResponse = response.data;
        setTracks(data.songs || []);
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch from Spotify';
      if (axios.isAxiosError(err)) {
        // Extract error message from API response
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Play a track
  const playTrack = async (track: SpotifyTrack) => {
    // Check if preview URL exists and is valid
    if (!track.preview_url || track.preview_url.trim() === '' || track.preview_url === 'null') {
      setError('No preview available for this track. Not all tracks have preview audio.');
      return;
    }

    console.log('Attempting to play track:', track.title);
    console.log('Preview URL:', track.preview_url);

    // Stop current track if playing and clean up old listeners
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
    }
    
    // Clean up previous event listeners
    if (eventListenersRef.current) {
      eventListenersRef.current.handlers.forEach(({ event, handler }) => {
        eventListenersRef.current!.audio.removeEventListener(event, handler);
      });
      eventListenersRef.current = null;
    }

    try {
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set audio properties for better compatibility
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      // Set up event listeners BEFORE setting src
      const handleTimeUpdate = () => {
        if (audio && !isNaN(audio.currentTime)) {
          setCurrentTrack(prev => prev ? {...prev, currentTime: audio.currentTime} : null);
        }
      };

      const handleEnded = () => {
        console.log('Audio playback ended');
        setCurrentTrack(prev => prev ? {...prev, isPlaying: false} : null);
      };

      const handleError = (e?: Event) => {
        console.error('Audio playback error:', e);
        console.error('Audio error details:', {
          error: audio.error,
          code: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src
        });
        
        let errorMsg = 'Failed to play audio preview. ';
        if (audio.error) {
          switch (audio.error.code) {
            case 1: // MEDIA_ERR_ABORTED
              errorMsg += 'Playback was aborted.';
              break;
            case 2: // MEDIA_ERR_NETWORK
              errorMsg += 'Network error occurred.';
              break;
            case 3: // MEDIA_ERR_DECODE
              errorMsg += 'Audio could not be decoded.';
              break;
            case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
              errorMsg += 'Audio format not supported or preview not available.';
              break;
            default:
              errorMsg += 'Unknown error occurred.';
          }
        } else {
          errorMsg += 'The track may not be available in your region or the preview URL is invalid.';
        }
        
        setError(errorMsg);
        setCurrentTrack(prev => prev ? {...prev, isPlaying: false} : null);
      };

      const handleLoadedMetadata = () => {
        console.log('Audio metadata loaded, duration:', audio.duration);
        setCurrentTrack(prev => prev ? {
          ...prev,
          duration: audio.duration || 30,
          isPlaying: true
        } : null);
      };

      const handleCanPlay = () => {
        console.log('Audio can start playing');
      };

      const handleLoadStart = () => {
        console.log('Audio loading started');
      };

      // Store handlers for cleanup
      const handlers = [
        { event: 'timeupdate', handler: handleTimeUpdate },
        { event: 'ended', handler: handleEnded },
        { event: 'error', handler: handleError },
        { event: 'loadedmetadata', handler: handleLoadedMetadata },
        { event: 'canplay', handler: handleCanPlay },
        { event: 'loadstart', handler: handleLoadStart }
      ];

      handlers.forEach(({ event, handler }) => {
        audio.addEventListener(event, handler);
      });

      // Store reference for cleanup
      eventListenersRef.current = { audio, handlers };

      // Set initial track state
      setCurrentTrack({
        track,
        isPlaying: false,
        currentTime: 0,
        duration: 30 // Default, will be updated by loadedmetadata
      });

      // Set src and attempt to play
      audio.src = track.preview_url;
      
      // Try to play - this might fail due to browser autoplay policies
      try {
        await audio.play();
        console.log('Audio playback started successfully');
        setCurrentTrack(prev => prev ? {...prev, isPlaying: true} : null);
      } catch (playError: unknown) {
        console.error('Play error:', playError);
        const error = playError as { name?: string; message?: string };
        // If autoplay is blocked, user needs to interact first
        if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
          setError('Please click the play button again. Some browsers require user interaction to play audio.');
          // Don't set currentTrack to null - keep it so user can retry
        } else {
          throw playError; // Re-throw to be caught by outer catch
        }
      }
    } catch (playError: unknown) {
      console.error('Error setting up audio:', playError);
      const error = playError as { message?: string };
      setError(`Failed to play audio: ${error.message || 'Unknown error'}. Please try another track.`);
      setCurrentTrack(null);
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (currentTrack.isPlaying) {
        audioRef.current.pause();
        setCurrentTrack(prev => prev ? {...prev, isPlaying: false} : null);
      } else {
        await audioRef.current.play();
        setCurrentTrack(prev => prev ? {...prev, isPlaying: true} : null);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      setError('Failed to play audio. Please try again.');
    }
  };

  // Stop current track
  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
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
              placeholder="Search by artist name, song name, or paste Spotify URL..."
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

          {/* Search Examples */}
          <div className="max-w-2xl mt-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Try searching for: <span className="font-semibold">"Ed Sheeran"</span>, <span className="font-semibold">"Shape of You"</span>, or paste a Spotify URL
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Search: Ed Sheeran', query: 'Ed Sheeran' },
                { label: 'Search: Shape of You', query: 'Shape of You' },
                { label: 'URL: Track', url: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSearchUrl(item.query || item.url || '')}
                  className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-zinc-700 text-green-400 hover:bg-zinc-600' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors`}
                >
                  {item.label}
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
          ) : tracks.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-lg">No tracks found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => navigate('/player', { 
                    state: { 
                      track, 
                      allTracks: tracks,
                      currentIndex: index
                    } 
                  })}
                  className={`group ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-white hover:bg-gray-50'} 
                    rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(track);
                        }}
                        disabled={!track.preview_url || track.preview_url === 'null' || track.preview_url.trim() === ''}
                        className="w-16 h-16 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300"
                        title={!track.preview_url || track.preview_url === 'null' ? 'No preview available' : 'Play preview'}
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                    {(!track.preview_url || track.preview_url === 'null' || track.preview_url.trim() === '') && (
                      <div className="absolute top-2 right-2 bg-gray-500/80 text-white text-xs px-2 py-1 rounded">
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
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'}`}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <a
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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