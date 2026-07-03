import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import MaliTibbaDetail from './components/MaliTibbaDetail'
import FullBlog from './components/FullBlog'
import Gallery from './components/Gallery'
import TemplesPage from './components/TemplesPage'
import CulturePage from './components/CulturePage'
import HistoryPage from './components/HistoryPage'
import LanguagePopup from './components/LanguagePopup'
import AuthPage from './components/AuthPage'
import './App.css'

function App() {
  return (
    <>
      <LanguagePopup />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/story" element={<MaliTibbaDetail />} />
        <Route path="/temples" element={<TemplesPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/blog/:id" element={<FullBlog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Routes>
    </>
  )
}

export default App
