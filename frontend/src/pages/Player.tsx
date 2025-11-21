import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Shuffle, Heart, ArrowLeft, ExternalLink } from 'lucide-react';

interface SpotifyTrack {
  id: string;
  title: string;
  artists: { id: string; name: string }[];
  album: { id: string; name: string; image: string } | null;
  duration_ms: number;
  preview_url: string;
  spotifyUrl: string;
}

export default function PlayerPage({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const track = location.state?.track as SpotifyTrack | null;
  const allTracks = location.state?.allTracks as SpotifyTrack[] | null;
  const currentIndex = location.state?.currentIndex as number | undefined;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(track);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventListenersRef = useRef<{ audio: HTMLAudioElement; handlers: { event: string; handler: (e?: Event) => void }[] } | null>(null);

  // Initialize audio when track changes
  useEffect(() => {
    if (!currentTrack) {
      navigate('/browse');
      return;
    }

    // Check if preview URL exists
    if (!currentTrack.preview_url || currentTrack.preview_url.trim() === '' || currentTrack.preview_url === 'null') {
      return;
    }

    // Clean up previous audio
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
      
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = volume;

      const handleTimeUpdate = () => {
        if (audio && !isNaN(audio.currentTime)) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleEnded = () => {
        if (isRepeat) {
          audio.currentTime = 0;
          audio.play();
        } else if (allTracks && allTracks.length > 1) {
          handleNext();
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };

      const handleError = () => {
        console.error('Audio playback error');
        setIsPlaying(false);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || currentTrack.duration_ms / 1000);
      };

      const handlers = [
        { event: 'timeupdate', handler: handleTimeUpdate },
        { event: 'ended', handler: handleEnded },
        { event: 'error', handler: handleError },
        { event: 'loadedmetadata', handler: handleLoadedMetadata }
      ];

      handlers.forEach(({ event, handler }) => {
        audio.addEventListener(event, handler);
      });

      eventListenersRef.current = { audio, handlers };

      audio.src = currentTrack.preview_url;
      audio.load();

      // Auto-play when track is loaded
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Autoplay prevented:', err);
        setIsPlaying(false);
      });

    } catch (error) {
      console.error('Error setting up audio:', error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
      if (eventListenersRef.current) {
        eventListenersRef.current.handlers.forEach(({ event, handler }) => {
          eventListenersRef.current!.audio.removeEventListener(event, handler);
        });
        eventListenersRef.current = null;
      }
    };
  }, [currentTrack?.id]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setIsMuted(volume === 0);
    }
  }, [volume]);

  const togglePlayPause = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNext = () => {
    if (!allTracks || allTracks.length <= 1) return;
    
    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * allTracks.length);
    } else {
      const currentIdx = currentIndex !== undefined ? currentIndex : allTracks.findIndex(t => t.id === currentTrack?.id);
      nextIndex = (currentIdx + 1) % allTracks.length;
    }
    
    setCurrentTrack(allTracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!allTracks || allTracks.length <= 1) return;
    
    const currentIdx = currentIndex !== undefined ? currentIndex : allTracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIdx === 0 ? allTracks.length - 1 : currentIdx - 1;
    
    setCurrentTrack(allTracks[prevIndex]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return null;
  }

  const hasPreview = currentTrack.preview_url && currentTrack.preview_url.trim() !== '' && currentTrack.preview_url !== 'null';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-500`}>
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className={`p-3 rounded-full ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-green-50 hover:bg-green-100 text-gray-900'} transition-all duration-300 hover:scale-110 shadow-lg`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Album Art */}
          <div className="relative mb-8">
            <div className="w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={currentTrack.album?.image || 'https://via.placeholder.com/500x500.png?text=No+Image'}
                alt={currentTrack.title}
                className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`}
                style={{ animationDuration: '3s' }}
              />
            </div>
            
            {/* Like Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`absolute top-4 right-4 w-14 h-14 ${isDarkMode ? 'bg-zinc-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg`}
            >
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`} />
            </button>
          </div>

          {/* Track Info */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentTrack.title}
            </h1>
            <p className={`text-xl md:text-2xl mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentTrack.artists.map(a => a.name).join(', ')}
            </p>
            {currentTrack.album && (
              <p className={`text-base md:text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {currentTrack.album.name}
              </p>
            )}
          </div>

          {/* No Preview Warning */}
          {!hasPreview && (
            <div className={`max-w-md mx-auto mb-6 p-4 ${isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'} border rounded-lg text-center`}>
              <p className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                No preview available for this track. 
                <a 
                  href={currentTrack.spotifyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-1 hover:opacity-80"
                >
                  Listen on Spotify
                </a>
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {hasPreview && (
            <div className="max-w-2xl mx-auto mb-8 space-y-2">
              <div className={`relative h-2 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                <div 
                  className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={!hasPreview}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          {hasPreview && (
            <div className="flex items-center justify-center space-x-4 mb-8">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isShuffle ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                title="Shuffle"
              >
                <Shuffle className="w-6 h-6" />
              </button>
              
              <button 
                onClick={handlePrevious}
                disabled={!allTracks || allTracks.length <= 1}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Previous"
              >
                <SkipBack className="w-7 h-7" />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={!hasPreview}
                className="w-20 h-20 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" fill="white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                )}
              </button>

              <button 
                onClick={handleNext}
                disabled={!allTracks || allTracks.length <= 1}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Next"
              >
                <SkipForward className="w-7 h-7" />
              </button>

              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isRepeat ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                title="Repeat"
              >
                <Repeat className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Volume Control */}
          {hasPreview && (
            <div className="max-w-md mx-auto flex items-center space-x-4 mb-6">
              <button 
                onClick={toggleMute} 
                className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <div className={`flex-1 relative h-2 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                <div 
                  className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-100"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className={`text-sm w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}

          {/* Spotify Link */}
          <div className="text-center">
            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center space-x-2 px-6 py-3 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-green-50 hover:bg-green-100 text-gray-900'} rounded-full transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open in Spotify</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Music Notes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none opacity-10 z-0">
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

      {/* Hidden Audio Element */}
      {hasPreview && <audio ref={audioRef} />}
    </div>
  );
}

