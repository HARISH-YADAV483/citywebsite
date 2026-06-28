import { useState, useEffect } from 'react'
import './LanguagePopup.css'

function LanguagePopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if user has already selected a language
    const hasSelected = localStorage.getItem('languageSelected')
    if (!hasSelected) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowPopup(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const selectLanguage = (langCode) => {
    localStorage.setItem('languageSelected', 'true')
    setShowPopup(false)
    
    if (langCode === 'hi') {
      // Trigger Google Translate to Hindi
      const combo = document.querySelector('.goog-te-combo')
      if (combo) {
        combo.value = 'hi'
        combo.dispatchEvent(new Event('change'))
      }
    }
  }

  if (!showPopup) return null

  return (
    <div className="lang-popup-overlay">
      <div className="lang-popup">
        <h3 className="lang-popup__title">Choose Language</h3>
        <p className="lang-popup__subtitle">Select your preferred language for the best experience.</p>
        <div className="lang-popup__buttons">
          <button className="lang-popup__btn" onClick={() => selectLanguage('en')}>
            <span className="lang-popup__lang-name">English</span>
          </button>
          <button className="lang-popup__btn lang-popup__btn--hi" onClick={() => selectLanguage('hi')}>
            <span className="lang-popup__lang-name">हिंदी</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguagePopup
