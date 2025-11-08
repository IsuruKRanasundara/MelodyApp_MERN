import { Search, Music, Headphones, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MusicHomePage({ isDarkMode }: { isDarkMode: boolean }) {
const navigate = useNavigate();
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-500 flex items-center justify-center px-6`}>
      {/* Theme Toggle */}
      

      {/* Main Content */}
      <div className="max-w-4xl w-full text-center">
        {/* Animated Music Icons */}
        <div className="relative h-64 mb-12">
          {/* Center Large Icon */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className={`w-32 h-32 ${isDarkMode ? 'bg-green-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-2xl`}>
              <Music className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute left-1/4 top-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
            <div className={`w-16 h-16 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-full flex items-center justify-center`}>
              <Headphones className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className="absolute right-1/4 top-1/3 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
            <div className={`w-16 h-16 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-full flex items-center justify-center`}>
              <Radio className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className="absolute left-1/3 bottom-1/4 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
            <svg className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>

          <div className="absolute right-1/3 bottom-1/3 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>
            <svg className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h1 className={`text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-500`}>
          Your Music,
          <br />
          <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Your Vibe</span>
        </h1>

        <p className={`text-xl mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-500 max-w-2xl mx-auto`}>
          Discover millions of songs, create playlists, and enjoy unlimited music streaming
        </p>

        <p className={`text-lg mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-500`}>
          Start your musical journey today
        </p>

        {/* CTA Button */}
        <button onClick={() => navigate('/browse')} className="group relative px-12 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
          <span className="flex items-center justify-center space-x-3">
            <Search className="w-6 h-6" />
            <span>Start Exploring Music</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-6 transition-all duration-500`}>
            <div className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>
              50M+
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Songs Available
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-6 transition-all duration-500`}>
            <div className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>
              10M+
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active Users
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-6 transition-all duration-500`}>
            <div className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>
              1000+
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Curated Playlists
            </div>
          </div>
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
    </div>
  );
}