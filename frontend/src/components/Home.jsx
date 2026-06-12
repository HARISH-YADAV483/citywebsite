import { useState, useEffect, useRef } from 'react'
import narnaul from '../assets/narnaul.png'
import mallitibba from '../assets/mallitibba.png'
import video from '../assets/video.mp4'
import MalliTibbaDetail from './MalliTibbaDetail'
import './Home.css'

function Home() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [loaderHovered, setLoaderHovered] = useState(false)
  
  // Scroll animation removed as requested

  return (
    <>
      {/* ── Hero Section ─────────────────────────── */}
      <div className="home" id="home">
        <div className="hero-section">
          <video src={video} autoPlay loop muted playsInline className="hero-video" />
          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="hero-eyebrow">📍 Narnaul, Haryana</span>
            <h1 className="hero-title">
              Mohalla<br />
              <span className="hero-title--accent">Malli Tibba</span>
            </h1>
            <p className="hero-subtitle">A Place for Peace &amp; Entertainment</p>

            <div className="hero-actions">
              <button
                className="hero-btn hero-btn--primary"
                id="explore-btn"
                onClick={() => setDetailOpen(true)}
              >
                Explore Malli Tibba
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button className="hero-btn hero-btn--secondary" id="scroll-down-btn"
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
                Scroll Down
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hero-scroll-indicator">
            <div className="hero-scroll-line" />
          </div>
        </div>

        {/* ── Map + Card Section ───────────────────── */}
        <section className="explore-section" id="explore">
          
          {/* Info Card Panel (Now on Left) */}
          <div className="info-panel" id="about">
            <div className="info-panel__deco" />

            <div className="info-panel__content">
              <span className="info-panel__tag">Heritage Mohalla</span>
              <h2 className="info-panel__title">Mohalla Malli Tibba</h2>
              <svg className="info-panel__squiggly" width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '24px' }}>
                <path d="M2 10C10.5 2 17.5 18 26 10C34.5 2 41.5 18 50 10C58.5 2 65.5 18 74 10C82.5 2 89.5 18 98 10C106.5 2 113.5 18 118 10" stroke="rgb(154, 204, 192)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="info-panel__text">
                Nestled in the heart of historic Narnaul, Mohalla Malli Tibba is a vibrant
                community that echoes with centuries of culture, warmth, and tradition. It is a
                place where every stone tells a story and every lane opens into a world of
                timeless heritage.
              </p>

              <div className="info-panel__stats">
                <div className="info-stat">
                  <span className="info-stat__num">100+</span>
                  <span className="info-stat__label">Years of History</span>
                </div>
                <div className="info-stat">
                  <span className="info-stat__num">∞</span>
                  <span className="info-stat__label">Stories to Tell</span>
                </div>
                <div className="info-stat">
                  <span className="info-stat__num">1</span>
                  <span className="info-stat__label">Unique Mohalla</span>
                </div>
              </div>

              <button
                className="info-panel__cta"
                id="info-panel-cta-btn"
                onClick={() => setDetailOpen(true)}
              >
                Discover the Full Story
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Decorative SVG blob */}
            <svg className="info-panel__blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="rgba(154, 204, 192, 0.4)" d="M42.7,-62.4C55.9,-54.3,67.6,-41.8,72.7,-27.4C77.8,-13,76.3,3.3,71,18.3C65.7,33.4,56.6,47.2,43.6,56.1C30.6,65,15.3,69,-1.4,71C-18.1,73,-36.2,73.1,-50.7,65.3C-65.2,57.5,-76.1,41.8,-80.6,24.8C-85.1,7.8,-83.1,-10.5,-75.4,-25.9C-67.7,-41.3,-54.2,-53.8,-39.8,-61.5C-25.4,-69.2,-12.7,-72.1,1.1,-73.6C14.9,-75.1,29.6,-70.5,42.7,-62.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Map Panel (Now on Right) */}
          <div className="map-panel">

            {/* ── HUD NARNAUL label — outside map, futuristic targeting style */}
            <div className="hud-label" id="narnaul-label">
              {/* Corner brackets */}
              <div className="hud-label__bracket hud-label__bracket--tl" />
              <div className="hud-label__bracket hud-label__bracket--tr" />
              <div className="hud-label__bracket hud-label__bracket--bl" />
              <div className="hud-label__bracket hud-label__bracket--br" />

              {/* Scan line */}
              <div className="hud-label__scan" />

              {/* Inner content */}
              <div className="hud-label__inner">
                <div className="hud-label__tag">GEO // 28.0442°N</div>
                <div className="hud-label__city">NARNAUL</div>
                <div className="hud-label__sub">
                  <span className="hud-label__dot" />
                  HARYANA · INDIA
                </div>
                <div className="hud-label__coords">76.1081°E · ALT 267m</div>
              </div>

              {/* Connector line to map */}
              <div className="hud-label__connector">
                <div className="hud-label__connector-line" />
                <div className="hud-label__connector-node" />
              </div>
            </div>

            <div className="map-panel__inner">
              <img src={narnaul} alt="Narnaul District Map" className="map-img" />

              {/* Clickable Loader / Pin */}
              <button
                className={`map-pin ${loaderHovered ? 'map-pin--hovered' : ''}`}
                id="map-pin-btn"
                onClick={() => setDetailOpen(true)}
                onMouseEnter={() => setLoaderHovered(true)}
                onMouseLeave={() => setLoaderHovered(false)}
                aria-label="Open Malli Tibba details"
              >
                <div className="map-pin__loader" />
                <div className="map-pin__ripple" />
                <div className="map-pin__ripple map-pin__ripple--2" />
                {/* Malli Tibba label attached to pin */}
                <div className="map-pin__label">
                  <div className="map-pin__label-line" />
                  <span className="map-pin__label-text">Mohalla Malli Tibba</span>
                </div>
              </button>
            </div>

            <div className="map-panel__label">
              <span>📍</span>
              <span>Click the pin to explore</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Detail Page ──────────────────────────── */}
      {detailOpen && (
        <MalliTibbaDetail onClose={() => setDetailOpen(false)} />
      )}
    </>
  )
}

export default Home
