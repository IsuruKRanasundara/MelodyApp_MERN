import { Music, Headphones, Radio, TrendingUp, Heart, Clock, Sparkles, Mic2, Disc3, ListMusic, Globe, Star } from 'lucide-react';

export default function MusicBrowseTab({ isDarkMode }: { isDarkMode: boolean }) {
  

  const categories = [
    { icon: TrendingUp, title: 'Trending Now', color: 'green', count: '100+ tracks' },
    { icon: Heart, title: 'Your Favorites', color: 'green', count: '50+ songs' },
    { icon: Clock, title: 'Recently Played', color: 'green', count: '30+ tracks' },
    { icon: Sparkles, title: 'New Releases', color: 'green', count: '200+ songs' },
    { icon: Mic2, title: 'Top Artists', color: 'green', count: '500+ artists' },
    { icon: Disc3, title: 'Albums', color: 'green', count: '1000+ albums' },
    { icon: ListMusic, title: 'Playlists', color: 'green', count: '5000+ lists' },
    { icon: Radio, title: 'Radio Stations', color: 'green', count: '50+ stations' },
    { icon: Globe, title: 'World Music', color: 'green', count: '10K+ songs' },
    { icon: Star, title: 'Top Charts', color: 'green', count: 'Weekly updated' },
    { icon: Headphones, title: 'Podcasts', color: 'green', count: '1000+ shows' },
    { icon: Music, title: 'Genres', color: 'green', count: '50+ genres' },
  ];

  const genres = [
    'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 
    'R&B', 'Country', 'Latin', 'Metal', 'Indie', 'Blues'
  ];

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
              placeholder="Search for songs, artists, albums..."
              className={`w-full px-6 py-4 rounded-full ${isDarkMode ? 'bg-zinc-800 text-white placeholder-gray-500' : 'bg-green-50 text-gray-900 placeholder-gray-500'} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 pr-14`}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 p-3 rounded-full transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className={`group relative ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-6 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Icon with Animation */}
                  <div className={`w-16 h-16 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    <Icon className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
                  </div>

                  {/* Text Content */}
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                    {category.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.count}
                  </p>

                  {/* Animated Arrow */}
                  <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}>
                    <svg className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Genres Section */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Genres
          </h2>
          <div className="flex flex-wrap gap-4">
            {genres.map((genre, index) => (
              <button
                key={index}
                className={`px-8 py-4 rounded-full ${isDarkMode ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' : 'bg-green-50 text-gray-700 hover:bg-green-100'} transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium`}
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

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