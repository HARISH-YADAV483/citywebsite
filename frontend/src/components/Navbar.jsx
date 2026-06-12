import { useState, useEffect } from 'react'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__brand">
        <span className="navbar__logo-dot"></span>
        <span className="navbar__title">Malli Tibba</span>
      </div>

      <button
        className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        id="hamburger-btn"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
        <li><a href="#explore" onClick={() => setMenuOpen(false)}>Explore</a></li>
        <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
        <li>
          <a href="#visit" className="navbar__cta" onClick={() => setMenuOpen(false)}>
            Plan a Visit
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
