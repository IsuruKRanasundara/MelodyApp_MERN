import React, { useState, useRef} from 'react';
import { Music, Upload, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Shuffle, Heart, MoreHorizontal } from 'lucide-react';

export default function MusicPlayerPage({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [audioFile, setAudioFile] = useState<{name: string, url: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioFile({ name: file.name.replace(/\.[^/.]+$/, ''), url });
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Automatically play when file is selected
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error playing audio:', err);
        });
      }
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

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

const uploadAudio = async (file:any) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await fetch("http://localhost:5000/api/upload-audio", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  console.log("Uploaded file info:", data);

  return data.url; // ✅ Cloudinary audio URL
};

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
          <Music className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
        </div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-2xl mx-auto">
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
              Music <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Player</span>
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload and play your favorite tracks
            </p>
          </div>

          {/* Main Player Card */}
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-3xl p-8 shadow-2xl transition-all duration-500`}>
            {!audioFile ? (
              /* Upload Section */
              <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  borderColor: isDarkMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(22, 163, 74, 0.3)'
                }}>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={`w-24 h-24 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Upload className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <p className={`text-2xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Upload Your Music
                  </p>
                  <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click to select audio file
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                    MP3, WAV, OGG, FLAC
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              /* Player Section */
              <div className="space-y-8">
                {/* Album Art / Visualizer */}
                <div className="relative">
                  <div className={`w-full aspect-square ${isDarkMode ? 'bg-gradient-to-br from-zinc-700 to-zinc-900' : 'bg-gradient-to-br from-green-100 to-green-200'} rounded-2xl flex items-center justify-center overflow-hidden shadow-xl`}>
                    <div className={`${isPlaying ? 'animate-pulse' : ''}`}>
                      <Music className={`w-32 h-32 ${isDarkMode ? 'text-green-400' : 'text-green-600'} transition-all duration-300`} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`w-12 h-12 ${isDarkMode ? 'bg-zinc-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg`}
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`} />
                    </button>
                    <button className={`w-12 h-12 ${isDarkMode ? 'bg-zinc-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg`}>
                      <MoreHorizontal className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>

                {/* Track Info */}
                <div className="text-center">
                  <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                    {audioFile.name}
                  </h2>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Unknown Artist
                  </p>
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
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isShuffle ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                  
                  <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    <SkipBack className="w-6 h-6" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" fill="white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    )}
                  </button>

                  <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    <SkipForward className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isRepeat ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4 px-4">
                  <button onClick={toggleMute} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
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
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} w-12 text-right`}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                {/* Change Track Button */}
                <label className="block">
                  <div className={`w-full py-3 ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-white hover:bg-green-100'} rounded-xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.02]`}>
                    <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Change Track
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
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
    </div>
  );
}