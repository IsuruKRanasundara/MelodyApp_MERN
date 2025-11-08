import { useState } from 'react';
import { Music, Mail, Lock, Eye, EyeOff, User, Headphones, Radio, Disc3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

export default function MusicSignInPage({ isDarkMode }: { isDarkMode: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validation for sign up
        if (!username || !email || !password || !confirmPassword) {
          setError('All fields are required');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (!agreeToTerms) {
          setError('You must agree to the terms and conditions');
          return;
        }

        await register(username, email, password);
        navigate('/home');
      } else {
        // Validation for sign in
        if (!email || !password) {
          setError('Email and password are required');
          return;
        }

        await login(email, password);
        navigate('/home');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-500 flex`}>
      {/* Theme Toggle */}
      

      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Music className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isSignUp ? 'Start your musical journey today' : 'Sign in to continue your musical journey'}
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div className="relative" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Full Name"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-white placeholder-gray-500 border-zinc-700' : 'bg-green-50 text-gray-900 placeholder-gray-500 border-green-200'} border-2 focus:outline-none focus:border-green-500 transition-all duration-300`}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-4 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-white placeholder-gray-500 border-zinc-700' : 'bg-green-50 text-gray-900 placeholder-gray-500 border-green-200'} border-2 focus:outline-none focus:border-green-500 transition-all duration-300`}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-4 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-white placeholder-gray-500 border-zinc-700' : 'bg-green-50 text-gray-900 placeholder-gray-500 border-green-200'} border-2 focus:outline-none focus:border-green-500 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </button>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div className="relative" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-white placeholder-gray-500 border-zinc-700' : 'bg-green-50 text-gray-900 placeholder-gray-500 border-green-200'} border-2 focus:outline-none focus:border-green-500 transition-all duration-300`}
                />
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-gray-400 text-green-500 focus:ring-green-500 focus:ring-2"
                  />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className={`text-sm font-medium ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors duration-300`}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Terms & Conditions (Sign Up Only) */}
            {isSignUp && (
              <div className="flex items-start" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms((e.target as HTMLInputElement).checked)}
                  className="w-4 h-4 rounded border-2 border-gray-400 text-green-500 focus:ring-green-500 focus:ring-2 mt-1"
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  I agree to the{' '}
                  <button className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}>
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}>
                    Privacy Policy
                  </button>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl group relative overflow-hidden`}
            >
              <span className="relative z-10">
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className={`flex-1 h-px ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
            <span className={`px-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>OR</span>
            <div className={`flex-1 h-px ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className={`w-full py-3 rounded-xl ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-50'} border-2 ${isDarkMode ? 'border-zinc-700' : 'border-gray-300'} transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Continue with Google</span>
            </button>

            <button className={`w-full py-3 rounded-xl ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-50'} border-2 ${isDarkMode ? 'border-zinc-700' : 'border-gray-300'} transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3`}>
              <svg className="w-5 h-5" fill={isDarkMode ? '#fff' : '#000'} viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Continue with Facebook</span>
            </button>
          </div>

          {/* Toggle Sign In/Sign Up */}
          <div className="text-center mt-8">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className={`font-semibold ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors duration-300`}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Section */}
      <div className={`hidden lg:flex lg:w-1/2 ${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' : 'bg-gradient-to-br from-green-400 to-green-600'} items-center justify-center relative overflow-hidden`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>
            <div className={`w-32 h-32 ${isDarkMode ? 'bg-green-500' : 'bg-white'} rounded-full flex items-center justify-center`}>
              <Music className={`w-16 h-16 ${isDarkMode ? 'text-white' : 'text-green-600'}`} strokeWidth={2} />
            </div>
          </div>

          <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}>
            <div className={`w-24 h-24 ${isDarkMode ? 'bg-green-500' : 'bg-white'} rounded-full flex items-center justify-center`}>
              <Headphones className={`w-12 h-12 ${isDarkMode ? 'text-white' : 'text-green-600'}`} strokeWidth={2} />
            </div>
          </div>

          <div className="absolute bottom-1/3 left-1/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>
            <div className={`w-28 h-28 ${isDarkMode ? 'bg-green-500' : 'bg-white'} rounded-full flex items-center justify-center`}>
              <Radio className={`w-14 h-14 ${isDarkMode ? 'text-white' : 'text-green-600'}`} strokeWidth={2} />
            </div>
          </div>

          <div className="absolute bottom-1/4 right-1/3 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}>
            <div className={`w-20 h-20 ${isDarkMode ? 'bg-green-500' : 'bg-white'} rounded-full flex items-center justify-center`}>
              <Disc3 className={`w-10 h-10 ${isDarkMode ? 'text-white' : 'text-green-600'}`} strokeWidth={2} />
            </div>
          </div>

          {/* Musical Notes */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className={`w-40 h-40 ${isDarkMode ? 'text-green-400' : 'text-white'} opacity-50 animate-spin`} style={{ animationDuration: '20s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-12">
          <div className="mb-8">
            <div className={`w-32 h-32 ${isDarkMode ? 'bg-green-500' : 'bg-white'} rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse`}>
              <Music className={`w-16 h-16 ${isDarkMode ? 'text-white' : 'text-green-600'}`} strokeWidth={2.5} />
            </div>
          </div>

          <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-white'}`}>
            Your Music,
            <br />
            Your World
          </h2>

          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-green-50'} max-w-md mx-auto leading-relaxed`}>
            Stream over 50 million songs, create unlimited playlists, and discover new artists every day.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className={`${isDarkMode ? 'bg-zinc-700/50' : 'bg-white/20'} rounded-xl p-4 backdrop-blur-sm`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-white'} mb-1`}>
                50M+
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-green-50'}`}>
                Songs
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-zinc-700/50' : 'bg-white/20'} rounded-xl p-4 backdrop-blur-sm`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-white'} mb-1`}>
                10M+
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-green-50'}`}>
                Users
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-zinc-700/50' : 'bg-white/20'} rounded-xl p-4 backdrop-blur-sm`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-white'} mb-1`}>
                1000+
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-green-50'}`}>
                Playlists
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 opacity-30">
          <svg viewBox="0 0 1440 320" className={`${isDarkMode ? 'text-green-500' : 'text-white'}`}>
            <path fill="currentColor" fillOpacity="0.5" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,165.3C960,160,1056,128,1152,122.7C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </path>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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