import { useState } from 'react'
import { Home, Music, Library, Search, User, Sun, Moon, Book, LogOut, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

type Props = {
  isDarkMode: boolean
  toggleTheme: () => void
}

export default function MusicNavbar({ isDarkMode, toggleTheme }: Props) {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'playlists', label: 'Playlists', icon: Music },
    { id: 'about', label: 'About', icon: Book },
  ]

  return (
    <header>
      {/* Navigation Bar */}
      <nav className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 ${isDarkMode ? 'bg-green-500' : 'bg-green-500'} rounded-lg flex items-center justify-center`}>
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                MusicApp
              </span>
            </div>

            {/* Navigation Items */}
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      navigate(`/${item.id}`)
                    }}
                    className={`relative px-4 py-2 flex items-center space-x-2 transition-colors duration-200 ${
                      isActive
                        ? isDarkMode
                          ? 'text-green-400'
                          : 'text-green-600'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>

                    {/* Active Underline */}
                    {isActive && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isDarkMode ? 'bg-green-400' : 'bg-green-600'
                      }`} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => toggleTheme()}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-zinc-700 text-green-400 hover:bg-zinc-600'
                  : 'bg-gray-100 text-green-600 hover:bg-gray-200'
              }`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile / Auth Buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'
                  }`}>
                    <User className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}>
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('signin');
                    navigate('/signin');
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}>
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
