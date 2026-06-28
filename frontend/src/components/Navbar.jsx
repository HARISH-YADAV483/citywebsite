import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar({ variant }) {
  const isStory = variant === 'story'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const handleScroll = () => {
      if (isStory) {
        // Switch from transparent to solid once scrolled past the hero (70vh - navbar height)
        const heroHeight = window.innerHeight * 0.7 - 76
        setScrolled(window.scrollY >= heroHeight)
      } else {
        setScrolled(window.scrollY >= window.innerHeight - 76)
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isStory])

  // Check initial language from cookie if available
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/)
    if (match && match[1]) {
      setLang(match[1])
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en'
    setLang(newLang)
    
    // Find the Google Translate combo box and trigger change
    const combo = document.querySelector('.goog-te-combo')
    if (combo) {
      combo.value = newLang
      combo.dispatchEvent(new Event('change'))
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isStory ? 'navbar--story' : ''}`}>
      <div className="navbar__brand">
        <span className="navbar__logo-dot" />
        {isStory
          ? <Link to="/" className="navbar__title" style={{ textDecoration: 'none' }}>Mali Tibba</Link>
          : <span className="navbar__title">Mali Tibba</span>
        }
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
        {isStory ? (
          /* Story page: links navigate back to home sections */
          <>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/#explore" onClick={() => setMenuOpen(false)}>Explore</Link></li>
            <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link></li>
          </>
        ) : (
          /* Home page: anchor links for same-page sections */
          <>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#explore" onClick={() => setMenuOpen(false)}>Explore</a></li>
            <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link></li>
          </>
        )}
        <li className="navbar__lang-item">
          <button className="navbar__lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
            <span className="divider">/</span>
            <span className={lang === 'hi' ? 'active' : ''}>HI</span>
          </button>
        </li>
        {!isStory && (
          <li>
            <a href="#visit" className="navbar__cta" onClick={() => setMenuOpen(false)}>
              Plan a Visit
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
