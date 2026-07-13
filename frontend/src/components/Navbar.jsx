import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import './Navbar.css'

function Navbar({ variant }) {
  const isStory = variant === 'story'
  const isSolid = variant === 'solid'
  const [scrolled, setScrolled] = useState(isSolid)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language || 'en')

  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isSolid) {
        setScrolled(true)
        return
      }
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
  }, [isStory, isSolid])

  // Listen to language changes
  useEffect(() => {
    setLang(i18n.language)
  }, [i18n.language])

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isStory ? 'navbar--story' : ''}`}>
      <div className="navbar__brand">
        <span className="navbar__logo-dot" />
        {isStory
          ? <Link to="/" className="navbar__title" style={{ textDecoration: 'none' }}>{t('nav.maliTibba')}</Link>
          : <span className="navbar__title">{t('nav.maliTibba')}</span>
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
            <li><Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link></li>
            <li><Link to="/#explore" onClick={() => setMenuOpen(false)}>{t('nav.explore')}</Link></li>
            <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>{t('nav.gallery')}</Link></li>
          </>
        ) : (
          /* Home page: anchor links for same-page sections */
          <>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>{t('nav.home')}</a></li>
            <li><a href="#explore" onClick={() => setMenuOpen(false)}>{t('nav.explore')}</a></li>
            <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>{t('nav.gallery')}</Link></li>
          </>
        )}
        <li className="navbar__lang-item">
          <button className="navbar__lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
            <span className="divider">/</span>
            <span className={lang === 'hi' ? 'active' : ''}>HI</span>
          </button>
        </li>
        {user ? (
          <li>
            <button className="navbar__cta" onClick={handleLogout}>{t('nav.logout')}</button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="navbar__cta" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
