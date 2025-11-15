
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MusicHomePage from './pages/Home'
import MusicAboutPage from './pages/About'
import './App.css'
import MusicNavBar from './components/Header'
import MusicBrowseTab from './pages/Browse'
import MusicSignInPage from './pages/SignIn'
import ProtectedRoute from './components/ProtectedRoutes'
import { AuthProvider } from './context/AuthContext'
import MusicLibraryTab from './pages/Library'

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const toggleTheme = () => setIsDarkMode((v) => !v)

    return (
        <AuthProvider>
            <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                <BrowserRouter>
                    <MusicNavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                    <main>
                        <Routes>
                            <Route path="/" element={<ProtectedRoute><MusicHomePage isDarkMode={isDarkMode} /></ProtectedRoute>} />
                            <Route path="/home" element={<ProtectedRoute><MusicHomePage isDarkMode={isDarkMode} /></ProtectedRoute>} />
                            <Route path="/about" element={<ProtectedRoute><MusicAboutPage isDarkMode={isDarkMode} /></ProtectedRoute>} />
                            <Route path="/browse" element={<ProtectedRoute><MusicBrowseTab isDarkMode={isDarkMode} /></ProtectedRoute>} />
                            <Route path="/signin" element={<MusicSignInPage isDarkMode={isDarkMode} />} />
                            <Route path="/library" element={<MusicLibraryTab isDarkMode={isDarkMode} />} />
                        </Routes>
                    </main>
                </BrowserRouter>
            </div>
        </AuthProvider>
    )
}

export default App