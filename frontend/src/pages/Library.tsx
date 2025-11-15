import { Music, Plus, X, Play, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlbumForm from '../components/AlbumForm';
import AlbumDetail from '../components/AlbumDetail';
import axios from 'axios';
// import{Headphones, Radio, TrendingUp, Heart, Clock, Sparkles, Mic2, Disc3, ListMusic, Globe, Star, Playlist} from 'lucide-react';
type Album = {
  _id: string;
  title: string;
  artist: string;
  image: string;
  genre: string;
  releaseDate: string;
  songs?: string[];
};

export default function MusicLibraryTab({ isDarkMode }: { isDarkMode: boolean }) {
  const [openAlbumDrawer, setOpenAlbumDrawer] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Fetch albums from backend
  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        setAlbums(response.data);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const handleAlbumCreated = () => {
    setOpenAlbumDrawer(false);
    // Refetch albums after creation
    const refetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        setAlbums(response.data);
      } catch (error) {
        console.error('Failed to refetch albums:', error);
      }
    };
    refetchAlbums();
  };

  // Handle album card click
  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
  };

  // Handle back from album detail
  const handleBackToLibrary = () => {
    setSelectedAlbum(null);
  };

  // If an album is selected, show the detail view
  if (selectedAlbum) {
    return (
      <AlbumDetail
        album={selectedAlbum}
        onBack={handleBackToLibrary}
        isDarkMode={isDarkMode}
      />
    );
  }

  

  

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

          <button onClick={() => setOpenAlbumDrawer(true)} className="group relative px-12 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
          <span className="flex items-center justify-center space-x-3">
            <Plus className="w-6 h-6" />
            <span>Create New Album</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Albums
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded-2xl h-80 animate-pulse`}>
                  <div className={`w-full h-48 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded-t-2xl`}></div>
                  <div className="p-4 space-y-2">
                    <div className={`h-4 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                    <div className={`h-3 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                  </div>
                </div>
              ))
            ) : albums.length > 0 ? (
              // Album cards
              albums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => handleAlbumClick(album)}
                  className={`group ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-white hover:bg-gray-50'} 
                    rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                >
                  {/* Album Cover */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={album.image}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300.png?text=Album';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-4">
                    <h3 className={`font-bold text-lg mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {album.title}
                    </h3>
                    <p className={`text-sm mb-2 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {album.artist}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        {album.genre}
                      </span>
                      <div className={`flex items-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(album.releaseDate).getFullYear()}</span>
                      </div>
                    </div>

                    {/* Song count if available */}
                    {album.songs && album.songs.length > 0 && (
                      <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {album.songs.length} song{album.songs.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className={`w-24 h-24 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
                  <Music className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No Albums Found
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
                  Create your first album to get started
                </p>
                <button 
                  onClick={() => setOpenAlbumDrawer(true)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
                >
                  Create Album
                </button>
              </div>
            )}
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

      {/* Drawer */}
      {openAlbumDrawer && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenAlbumDrawer(false)} />
          {/* Panel */}
          <div className={`absolute right-0 top-0 h-full w-full max-w-lg ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} shadow-2xl transform transition-transform duration-300 translate-x-0`}
               role="dialog" aria-modal="true">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Album</h2>
              <button onClick={() => setOpenAlbumDrawer(false)} className="p-2 rounded hover:bg-zinc-800/50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[calc(100%-56px)] overflow-y-auto">
              <AlbumForm isDarkMode={isDarkMode} onCreated={handleAlbumCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}