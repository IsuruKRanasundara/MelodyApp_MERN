import React, { useState, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Shuffle, Heart, MoreHorizontal, Clock, Disc } from 'lucide-react';

// Sample music library
const musicLibrary = [
  { id: 1, title: 'Summer Vibes', artist: 'DJ Sunshine', duration: '3:45', genre: 'Electronic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Midnight Dreams', artist: 'Luna Park', duration: '4:12', genre: 'Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'City Lights', artist: 'Urban Soul', duration: '3:28', genre: 'Jazz', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: 'Ocean Waves', artist: 'Nature Sounds', duration: '5:00', genre: 'Relaxation', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 5, title: 'Rock Anthem', artist: 'The Legends', duration: '4:30', genre: 'Rock', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 6, title: 'Acoustic Journey', artist: 'Solo Artist', duration: '3:55', genre: 'Folk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
];

export default function MusicPlayerPage({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [selectedTrack, setSelectedTrack] = useState<typeof musicLibrary[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [likedTracks, setLikedTracks] = useState<number[]>([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTrackSelect = (track: typeof musicLibrary[0]) => {
    setSelectedTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Automatically play when track is selected
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
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

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleNext = () => {
    if (!selectedTrack) return;
    const currentIndex = musicLibrary.findIndex(t => t.id === selectedTrack.id);
    const nextIndex = (currentIndex + 1) % musicLibrary.length;
    handleTrackSelect(musicLibrary[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedTrack) return;
    const currentIndex = musicLibrary.findIndex(t => t.id === selectedTrack.id);
    const prevIndex = currentIndex === 0 ? musicLibrary.length - 1 : currentIndex - 1;
    handleTrackSelect(musicLibrary[prevIndex]);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-500`}>
      {/* Floating Music Icons Background */}
      <div className="absolute left-1/4 top-1/4 animate-bounce opacity-10" style={{ animationDelay: '0s', animationDuration: '4s' }}>
        <div className={`w-32 h-32 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-full flex items-center justify-center`}>
          <Music className={`w-16 h-16 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
        </div>
      </div>
      <div className="absolute right-1/4 top-1/3 animate-bounce opacity-10" style={{ animationDelay: '2s', animationDuration: '5s' }}>
        <div className={`w-24 h-24 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-full flex items-center justify-center`}>
          <Disc className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
        </div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Music className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Music <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Library</span>
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select a track to start listening
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Music Library - Left Side */}
            <div className="lg:col-span-2">
              <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-3xl p-6 shadow-2xl`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <Disc className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  Available Tracks
                </h2>
                <div className="space-y-3">
                  {musicLibrary.map((track, index) => (
                    <div
                      key={track.id}
                      onClick={() => handleTrackSelect(track)}
                      className={`${
                        selectedTrack?.id === track.id 
                          ? (isDarkMode ? 'bg-zinc-700 border-green-500' : 'bg-white border-green-600') 
                          : (isDarkMode ? 'bg-zinc-900/50 hover:bg-zinc-700' : 'bg-white hover:bg-green-100')
                      } border-2 ${selectedTrack?.id === track.id ? '' : 'border-transparent'} rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] group`}
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-100'} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          {selectedTrack?.id === track.id && isPlaying ? (
                            <Pause className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                          ) : (
                            <Play className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {track.title}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {track.artist}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} hidden sm:block`}>
                            {track.genre}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {track.duration}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(track.id);
                            }}
                            className="transition-transform hover:scale-110"
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                likedTracks.includes(track.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                              }`} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Player - Right Side */}
            <div className="lg:col-span-1">
              <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-3xl p-6 shadow-2xl sticky top-6`}>
                {!selectedTrack ? (
                  <div className="text-center py-12">
                    <div className={`w-24 h-24 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <Music className={`w-12 h-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Select a track to play
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Album Art */}
                    <div className="relative">
                      <div className={`w-full aspect-square ${isDarkMode ? 'bg-gradient-to-br from-zinc-700 to-zinc-900' : 'bg-gradient-to-br from-green-100 to-green-200'} rounded-2xl flex items-center justify-center overflow-hidden shadow-xl`}>
                        <div className={`${isPlaying ? 'animate-spin' : ''} transition-all duration-1000`} style={{ animationDuration: '8s' }}>
                          <Disc className={`w-24 h-24 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      {/* Floating Like Button */}
                      <button
                        onClick={() => toggleLike(selectedTrack.id)}
                        className={`absolute top-4 right-4 w-12 h-12 ${isDarkMode ? 'bg-zinc-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg`}
                      >
                        <Heart className={`w-6 h-6 ${likedTracks.includes(selectedTrack.id) ? 'fill-red-500 text-red-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`} />
                      </button>
                    </div>

                    {/* Track Info */}
                    <div className="text-center">
                      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTrack.title}
                      </h2>
                      <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedTrack.artist}
                      </p>
                      <span className={`inline-block mt-2 px-3 py-1 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {selectedTrack.genre}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="relative h-2 bg-zinc-700/30 rounded-full overflow-hidden">
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
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isShuffle ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                      >
                        <Shuffle className="w-5 h-5" />
                      </button>
                      
                      <button 
                        onClick={handlePrevious}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <SkipBack className="w-6 h-6" />
                      </button>

                      <button
                        onClick={togglePlayPause}
                        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                      >
                        {isPlaying ? (
                          <Pause className="w-7 h-7 text-white" fill="white" />
                        ) : (
                          <Play className="w-7 h-7 text-white ml-1" fill="white" />
                        )}
                      </button>

                      <button 
                        onClick={handleNext}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <SkipForward className="w-6 h-6" />
                      </button>

                      <button
                        onClick={() => setIsRepeat(!isRepeat)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isRepeat ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                      >
                        <Repeat className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-3">
                      <button onClick={toggleMute} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1 relative h-2 bg-zinc-700/30 rounded-full overflow-hidden">
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
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} w-10 text-right`}>
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (isRepeat) {
            audioRef.current?.play();
          } else {
            handleNext();
          }
        }}
      />

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

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}