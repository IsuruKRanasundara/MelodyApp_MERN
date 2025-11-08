import { Music, Heart, Users, Zap, Globe, Award, Target, Sparkles, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MusicAboutPage({ isDarkMode }: { isDarkMode: boolean }) {
    const navigate = useNavigate();
  const values = [
    {
      icon: Heart,
      title: 'Passion for Music',
      description: 'We believe music is the universal language that connects souls across the world.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a vibrant community where artists and fans come together to celebrate music.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Pushing boundaries with cutting-edge technology to deliver the best listening experience.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Making music accessible to everyone, everywhere, breaking down geographical barriers.'
    }
  ];

  const stats = [
    { number: '50M+', label: 'Songs', delay: '0s' },
    { number: '10M+', label: 'Users', delay: '0.2s' },
    { number: '500K+', label: 'Artists', delay: '0.4s' },
    { number: '195', label: 'Countries', delay: '0.6s' }
  ];

  const team = [
    { role: 'Music Curation', icon: Music, count: '50+' },
    { role: 'Engineering', icon: Zap, count: '100+' },
    { role: 'Design', icon: Sparkles, count: '30+' },
    { role: 'Support', icon: Headphones, count: '80+' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-500`}>
      {/* Theme Toggle */}
      

      {/* Hero Section */}
      <div className="relative px-6 pt-20 pb-16 overflow-hidden">
        {/* Floating Music Icons */}
        <div className="absolute left-1/4 top-1/4 animate-bounce opacity-30" style={{ animationDelay: '0s', animationDuration: '4s' }}>
          <div className={`w-20 h-20 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-full flex items-center justify-center`}>
            <Music className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
        </div>
        <div className="absolute right-1/4 top-1/3 animate-bounce opacity-30" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <div className={`w-16 h-16 ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-full flex items-center justify-center`}>
            <Headphones className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-8 space-x-4">
            <div className="animate-pulse">
              <div className={`w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl`}>
                <Music className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className={`text-6xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-500`}>
            About <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Us</span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-500 max-w-3xl mx-auto leading-relaxed`}>
            We're on a mission to revolutionize how the world experiences music. Every beat, every melody, every moment matters.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 cursor-pointer`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${stat.delay} both`
                }}
              >
                <div className={`text-5xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-3`}>
                  {stat.number}
                </div>
                <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-3xl p-12 transition-all duration-500`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-16 h-16 bg-green-500 rounded-full flex items-center justify-center`}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Story
              </h2>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-6`}>
              Founded in 2020, we started with a simple vision: to create a music platform that puts artists and listeners first. What began as a small team of music enthusiasts has grown into a global community of millions who share our passion for discovering and celebrating music in all its forms.
            </p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Today, we're proud to be home to over 50 million songs, supporting artists from every corner of the globe, and delivering seamless listening experiences to music lovers worldwide. But we're just getting started.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Our <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Values</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer group`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                  }}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                      <Icon className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {value.title}
                      </h3>
                      <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Our <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Team</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, index) => {
              const Icon = member.icon;
              return (
                <div
                  key={index}
                  className={`${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'} rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 cursor-pointer group`}
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.15}s both`
                  }}
                >
                  <div className={`w-20 h-20 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.role}
                  </h3>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {member.count}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                    Professionals
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <div className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' : 'bg-gradient-to-br from-green-50 to-green-100'} rounded-3xl p-12 text-center transition-all duration-500`}>
            <div className="flex items-center justify-center mb-6">
              <div className="animate-pulse">
                <Award className={`w-20 h-20 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
              </div>
            </div>
            <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Award-Winning Platform
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto mb-8 leading-relaxed`}>
              Recognized globally for innovation in music streaming, exceptional user experience, and commitment to supporting independent artists.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Best Music App 2024', 'Innovation Award', 'User Choice Award'].map((award, index) => (
                <div
                  key={index}
                  className={`px-6 py-3 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'} rounded-full ${isDarkMode ? 'text-green-400' : 'text-green-600'} font-semibold transition-all duration-300 hover:scale-105`}
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.2 + 0.5}s both`
                  }}
                >
                  {award}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Join Our <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Journey</span>
          </h2>
          <p className={`text-xl mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Be part of the music revolution. Start discovering, creating, and sharing the soundtrack of your life.
                  </p>
                 
                  <button
                      onClick={()=>navigate('/home')}
                      className="group relative px-12 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
            <span className="flex items-center justify-center space-x-3">
              <Music className="w-6 h-6" />
              <span>Get Started Today</span>
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </button>
                  
          
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