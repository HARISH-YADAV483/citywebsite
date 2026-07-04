import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'
import './PageTemplate.css'
import balaji from '../assets/balaji.jpeg'
import shanidev from '../assets/shanidev.webp'
import narnaul from '../assets/narnaul.png'
import madiBg from '../assets/madi.webp'
import FlowerRain from './FlowerRain'
import sitaram from '../assets/sitaram.webp'
import thakurji from '../assets/thakurji.webp'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'
const CATEGORY = 'temples'

/* ── Static hardcoded temple data ── */
const STATIC_TEMPLES = [
   {
    id: 'hanuman',
    title: ' Kadia Wala HanumanJi Mandir',
    image: balaji,
    desc: 'Located at the heart of the mohalla, this temple is famous for its vibrant Hanuman Jayanti celebrations. It serves not just as a place of worship, but as a community gathering spot during festivals.',
    location: 'https://www.google.com/maps/place/Kadia+Wala+Hanuman+Ji+Mandir/@28.0343129,76.111785,17z/data=!3m1!4b1!4m6!3m5!1s0x3912b5c71ed5bd57:0xe0d17e203b19c64!8m2!3d28.0343083!4d76.1166559!16s%2Fg%2F11ddykl1fv?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    id: 'shanidev',
    title: 'Shanidev Mandir',
    image: shanidev,
    desc: 'Shanidev Mandir, Maliti Tibba is a sacred temple dedicated to Lord Shani, located near Shobha Sagar Talab. It is a place of worship and devotion where devotees come to seek blessings and experience peace, especially on Saturdays.',
    location: 'https://www.google.com/maps/place/Shani+Dev+Mandir/@28.0368343,76.0365486,13z/data=!4m10!1m2!2m1!1sShanidev+Mandir+Narnaul!3m6!1s0x3912b5c169498f33:0x41603c0d3dcdf569!8m2!3d28.0368125!4d76.1127362!15sChdTaGFuaWRldiBNYW5kaXIgTmFybmF1bJIBDGhpbmR1X3RlbXBsZeABAA!16s%2Fg%2F11d_7yf1hc?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D'
  },
 
  {
    id: 'sitaram',
    title: 'Sitaram Maharaj',
    image: sitaram,
    desc: 'Sitaram Maharaj Mandir is a revered temple located near Shobha Sagar Talab. Dedicated to Sitaram Maharaj, it is a peaceful place of worship where devotees gather to offer prayers, seek blessings, and find spiritual comfort.',
    location: 'https://www.google.com/maps/place/Shobha+Sagar+Talab+And+Park/@28.0374961,76.1149871,15z/data=!4m15!1m8!3m7!1s0x3912b5c1509f01f7:0xf3d58b59e910f8cb!2sShobha+Sagar+Talab+And+Park!8m2!3d28.0375732!4d76.1140534!10e5!16s%2Fg%2F11g8vvc_8f!3m5!1s0x3912b5c1509f01f7:0xf3d58b59e910f8cb!8m2!3d28.0375732!4d76.1140534!16s%2Fg%2F11g8vvc_8f!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    id: 'thakurji',
    title: 'Thakur ji Mandir',
    image: thakurji,
    desc: 'Thakur Ji Mandir is a sacred temple dedicated to Lord Krishna. It is a peaceful place of worship where devotees gather to offer prayers, seek blessings, and celebrate religious festivals with devotion.',
    location: 'https://www.google.com/maps/place/Shobha+Sagar+Talab+And+Park/@28.0374961,76.1149871,15z/data=!4m15!1m8!3m7!1s0x3912b5c1509f01f7:0xf3d58b59e910f8cb!2sShobha+Sagar+Talab+And+Park!8m2!3d28.0375732!4d76.1140534!10e5!16s%2Fg%2F11g8vvc_8f!3m5!1s0x3912b5c1509f01f7:0xf3d58b59e910f8cb!8m2!3d28.0375732!4d76.1140534!16s%2Fg%2F11g8vvc_8f!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D'
  }
]

export default function TemplesPage() {
  const navigate = useNavigate()
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showContribute, setShowContribute] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const { t } = useTranslation()
  
  const { user, token } = useContext(AuthContext)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchContributions()
  }, [])

  useEffect(() => {
    document.body.style.overflow = (showContribute || lightbox !== null) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showContribute, lightbox])

  const fetchContributions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/contributions?category=${CATEGORY}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setContributions(Array.isArray(data) ? data : [])
    } catch {
      setContributions([])
    } finally {
      setLoading(false)
    }
  }

  const handleContributed = (newItem) => {
    setContributions(prev => [newItem, ...prev])
  }

  // Combine static and fetched items
  const allItems = [
    ...STATIC_TEMPLES.map(item => ({
      id: item.id,
      title: item.title,
      imageUrl: item.image,
      text: item.desc,
      location: item.location,
      isStatic: true
    })),
    ...contributions.map(item => ({
      id: item._id,
      title: item.title,
      imageUrl: item.imageUrl,
      text: item.text,
      location: item.location,
      createdAt: item.createdAt,
      isStatic: false
    }))
  ]

  return (
    <>
      <FlowerRain />
      <Navbar variant="story" />
      <div className="pt-page">
        {/* Back button */}
        <button className="pt-close" onClick={() => navigate('/story')} aria-label="Back" title="Back to Story">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Hero */}
        <div className="pt-hero" >
          <div className="pt-hero__bg">
            <img src={madiBg} alt="" className="pt-hero__img" />
            <div className="pt-hero__gradient" style={{ background: 'linear-gradient(to top, rgba(180,60,5,0.88) 0%, rgba(180,60,5,0.45) 45%, transparent 75%)' }} />
          </div>
          <div className="pt-hero__content">
            <span className="pt-hero__badge">{t('temples.badge')}</span>
            <h1 className="pt-hero__title">{t('temples.title1')}<br />{t('temples.title2')}</h1>
            <p className="pt-hero__subtitle">{t('temples.subtitle')}</p>
          </div>
        </div>

        {/* ── Unified List Section ── */}
        <section className="pt-list-section">
          <div className="pt-list-header">
            <div className="pt-list-header__left">
              <h2 className="pt-list-title">{t('temples.listTitle')}</h2>
              <p className="pt-list-subtitle">{t('temples.listSubtitle')}</p>
            </div>
            {user?.isResident ? (
              <button
                className="pt-contribute-btn"
                onClick={() => setShowContribute(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('temples.contributeBtn')}
              </button>
            ) : !user ? (
              <button
                className="pt-contribute-btn"
                onClick={() => navigate('/login')}
              >
                {t('common.loginToContribute')}
              </button>
            ) : null}
          </div>

          {loading && allItems.length === STATIC_TEMPLES.length ? (
            <div className="pt-list-grid">
              <div className="pt-list-skeleton">
                <div className="pt-list-skeleton__img" />
                <div className="pt-list-skeleton__body">
                  <div className="pt-list-skeleton__line title" />
                  <div className="pt-list-skeleton__line text1" />
                  <div className="pt-list-skeleton__line text2" />
                  <div className="pt-list-skeleton__line text3" />
                </div>
              </div>
            </div>
          ) : allItems.length === 0 ? (
            <div className="pt-list-empty">
              <span className="pt-list-empty__icon">🛕</span>
              <p>{t('temples.emptyText')}</p>
                {user?.isResident ? (
                  <button
                    className="pt-contribute-btn"
                    onClick={() => setShowContribute(true)}
                  >
                    {t('temples.addFirstBtn')}
                  </button>
                ) : !user ? (
                  <button
                    className="pt-contribute-btn"
                    onClick={() => navigate('/login')}
                  >
                    {t('common.loginToContribute')}
                  </button>
                ) : null}
            </div>
          ) : (
            <div className="pt-list-grid">
              {allItems.map((item, i) => (
                <div className="pt-list-item" key={item.id}>
                  <div className="pt-list-item__img-wrap" onClick={() => setLightbox(i)}>
                    <img src={item.imageUrl} alt={item.title} className="pt-list-item__img" loading="lazy" />
                    <div className="pt-list-item__img-overlay">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>
                  <div className="pt-list-item__body">
                    {item.isStatic && <span className="pt-list-item__badge">{t('temples.historicalBadge')}</span>}
                    {!item.isStatic && <span className="pt-list-item__badge" style={{background: 'rgba(210,90,60,0.1)', color: 'rgb(210,90,60)'}}>{t('temples.communityBadge')}</span>}
                    <h3 className="pt-list-item__title">{item.title}</h3>
                    {item.location && (
                      <a href={item.location} target="_blank" rel="noopener noreferrer" className="pt-list-item__location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {t('temples.viewLocation')}
                      </a>
                    )}
                    {item.text && <p className="pt-list-item__text">{item.text}</p>}
                    {!item.isStatic && item.createdAt && (
                      <span className="pt-list-item__meta">
                        {t('temples.contributedOn')} {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="pt-lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="pt-lightbox-box" onClick={e => e.stopPropagation()}>
            <button className="pt-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img src={allItems[lightbox]?.imageUrl} alt={allItems[lightbox]?.title} className="pt-lightbox-img" />
            <div className="pt-lightbox-footer">
              <h3>{allItems[lightbox]?.title}</h3>
              {allItems[lightbox]?.text && <p>{allItems[lightbox].text}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContribute && (
        <ContributeModal
          category={CATEGORY}
          onClose={() => setShowContribute(false)}
          onSuccess={handleContributed}
          token={token}
        />
      )}
    </>
  )
}

/* ── Reusable Contribute Modal ── */
function ContributeModal({ category, onClose, onSuccess, token }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [location, setLocation] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError(t('common.errTitle')); return }
    if (!imageFile)    { setError(t('common.errImg')); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('text', text.trim())
      fd.append('category', category)
      fd.append('image', imageFile)
      if (location) fd.append('location', location.trim())
      const res = await fetch(`${API}/api/contributions`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd 
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Upload failed')
      }
      const newItem = await res.json()
      setSuccess(true)
      onSuccess(newItem)
      setTimeout(() => { setSuccess(false); onClose() }, 2200)
    } catch (err) {
      setError(err.message || t('common.errUpload'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="pt-modal-overlay" onClick={onClose}>
      <div className="pt-modal" onClick={e => e.stopPropagation()}>
        <div className="pt-modal__header">
          <h2 className="pt-modal__title">{t('temples.modalTitle')}</h2>
          <button className="pt-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="pt-modal__body">
          {success ? (
            <div className="pt-success">
              <span className="pt-success__icon">🎉</span>
              <h3>{t('common.successMsg')}</h3>
              <p>{t('common.successSub')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label className="pt-upload-zone" htmlFor="temples-img-input">
                {preview ? (
                  <div className="pt-preview-wrap">
                    <img src={preview} alt="Preview" className="pt-preview-img" />
                  </div>
                ) : (
                  <div className="pt-upload-placeholder">
                    <span className="pt-upload-icon">🖼️</span>
                    <span className="pt-upload-hint">{t('common.clickChoose')}</span>
                    <span className="pt-upload-sub">{t('common.supportedFormats')}</span>
                  </div>
                )}
              </label>
              <input id="temples-img-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
              {preview && (
                <button type="button" className="pt-preview-remove" onClick={() => { setImageFile(null); setPreview(null) }}>{t('common.removeImg')}</button>
              )}

              <div className="pt-form-group">
                <label className="pt-form-label" htmlFor="temples-title-input">{t('common.photoTitleLabel')}</label>
                <input id="temples-title-input" className="pt-form-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('temples.photoTitlePlaceholder')} maxLength={120} required />
              </div>

              <div className="pt-form-group">
                <label className="pt-form-label" htmlFor="temples-text-input">{t('common.descLabel')}</label>
                <textarea id="temples-text-input" className="pt-form-textarea" value={text} onChange={e => setText(e.target.value)} placeholder={t('common.descPlaceholder')} rows={3} />
              </div>

              <div className="pt-form-group">
                <label className="pt-form-label" htmlFor="temples-location-input">{t('common.locLabel')}</label>
                <input id="temples-location-input" className="pt-form-input" type="url" value={location} onChange={e => setLocation(e.target.value)} placeholder={t('common.locPlaceholder')} />
              </div>

              {error && <p className="pt-form-error">{error}</p>}

              <button type="submit" className="pt-form-submit" disabled={uploading} id="temples-upload-submit">
                {uploading ? t('common.uploading') : t('common.uploadBtn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
