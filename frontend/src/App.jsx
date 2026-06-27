import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import MalliTibbaDetail from './components/MalliTibbaDetail'
import FullBlog from './components/FullBlog'
import './App.css'

function App() {
  return (
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
      <Route path="/story" element={<MalliTibbaDetail />} />
      <Route path="/blog/:id" element={<FullBlog />} />
    </Routes>
  )
}

export default App
