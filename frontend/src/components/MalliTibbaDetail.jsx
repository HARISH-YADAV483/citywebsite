import { useEffect } from 'react'
import narnaul from '../assets/narnaul.png'
import './MalliTibbaDetail.css'

const facts = [
  { icon: '🏙️', label: 'Location', value: 'Narnaul, Haryana' },
  { icon: '🌿', label: 'Character', value: 'Historic Mohalla' },
  { icon: '🎭', label: 'Culture', value: 'Rich Heritage' },
  { icon: '🕌', label: 'Era', value: 'Centuries Old' },
]

const highlights = [
  {
    title: 'Cultural Heart',
    desc: 'Malli Tibba stands as a cultural nucleus of Narnaul — where generations of stories, traditions, and community bonds have been woven together across centuries.',
  },
  {
    title: 'Peace & Serenity',
    desc: 'A haven of calm amidst the bustling city life, offering residents and visitors alike a sense of belonging and tranquility rarely found in modern neighbourhoods.',
  },
  {
    title: 'Living History',
    desc: 'Every lane, every structure whispers tales of the past. Walking through Malli Tibba is a journey through living history, architecture, and art.',
  },
]

function MalliTibbaDetail({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="detail-overlay" id="detail-page">
      {/* Close Button */}
      <button className="detail-close" onClick={onClose} id="detail-close-btn" aria-label="Close detail page">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-hero__bg">
          <img src={narnaul} alt="Narnaul Map" className="detail-hero__map" />
          <div className="detail-hero__gradient" />
        </div>
        <div className="detail-hero__content">
          <span className="detail-hero__badge">📍 Narnaul, Haryana</span>
          <h1 className="detail-hero__title">Mohalla<br />Malli Tibba</h1>
          <p className="detail-hero__subtitle">A Place for Peace &amp; Entertainment</p>
        </div>
      </div>

      {/* Facts Strip */}
      <div className="detail-facts">
        {facts.map((f, i) => (
          <div className="detail-facts__item" key={i} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
            <span className="detail-facts__icon">{f.icon}</span>
            <span className="detail-facts__label">{f.label}</span>
            <span className="detail-facts__value">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="detail-body">
        <div className="detail-intro">
          <h2 className="detail-intro__heading">Discover the Soul of Narnaul</h2>
          <p className="detail-intro__text">
            Nestled within the historic city of Narnaul in Haryana, Mohalla Malli Tibba is more
            than just a neighbourhood — it is a living, breathing mosaic of culture, heritage, and
            community spirit. With its ancient lanes, vibrant local life, and deep-rooted traditions,
            Malli Tibba captures the essence of authentic Haryanvi culture in its most genuine form.
          </p>
        </div>

        {/* Highlights */}
        <div className="detail-highlights">
          {highlights.map((h, i) => (
            <div className="detail-highlight-card" key={i} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
              <div className="detail-highlight-card__num">0{i + 1}</div>
              <h3 className="detail-highlight-card__title">{h.title}</h3>
              <p className="detail-highlight-card__desc">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="detail-map-section">
          <div className="detail-map-section__text">
            <h2>Find Us on the Map</h2>
            <p>
              Located in the heart of Narnaul, Malli Tibba is easily accessible from all parts of
              the city. Its central position makes it a perfect starting point for exploring
              everything Narnaul has to offer.
            </p>
            <button className="detail-map-section__btn" id="get-directions-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Get Directions
            </button>
          </div>
          <div className="detail-map-section__map">
            <img src={narnaul} alt="Narnaul District Map" />
            <div className="detail-map-section__pin">
              <div className="detail-pin-dot" />
              <span>Malli Tibba</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="detail-footer">
        <p>© 2025 Mohalla Malli Tibba · Narnaul, Haryana</p>
        <button className="detail-footer__back" onClick={onClose} id="back-to-home-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default MalliTibbaDetail
