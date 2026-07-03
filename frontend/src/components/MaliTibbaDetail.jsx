import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import narnaul from '../assets/narnaul.png'
import './MaliTibbaDetail.css'
import Navbar from './Navbar'
import balaji from '../assets/balaji.jpeg'
import imageWebp from '../assets/image.webp'
import lalpahadi from '../assets/lalpahadi.png'
import './Home.css'
import Footer from './Footer'
import shanidev from '../assets/shanidev.webp'

const facts = [
  { icon: '🪔', label: 'Festivals', value: 'Rich Culture' },
  { icon: '🌿', label: 'Character', value: 'History and Heritage' },
  { icon: '🎭', label: 'People', value: 'Blog and posts' },
  { icon: '📍', label: 'Map', value: 'Find Us' },
]

const highlights = [
  {
    title: 'Cultural Heart',
    desc: 'Mali Tibba stands as a cultural nucleus of Narnaul — where generations of stories, traditions, and community bonds have been woven together across centuries.',
  },
  {
    title: 'Peace & Serenity',
    desc: 'A haven of calm amidst the bustling city life, offering residents and visitors alike a sense of belonging and tranquility rarely found in modern neighbourhoods.',
  },
  {
    title: 'Living History',
    desc: 'Every lane, every structure whispers tales of the past. Walking through Mali Tibba is a journey through living history, architecture, and art.',
  },
]

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'

function MaliTibbaDetail() {
  const navigate = useNavigate()

  // Blog state
  const [topBlogs, setTopBlogs] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [showAllBlogs, setShowAllBlogs] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [blogsLoading, setBlogsLoading] = useState(true)
  const { t } = useTranslation()
  
  const { user, token } = useContext(AuthContext)

  // Publish form state
  const [form, setForm] = useState({ title: '', content: '', author: '', contact: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = ''
    fetchTopBlogs()
  }, [])

  // Lock scroll when modal is open
  useEffect(() => {
    if (showAllBlogs || showPublish) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showAllBlogs, showPublish])

  const fetchTopBlogs = async () => {
    setBlogsLoading(true)
    try {
      const res = await fetch(`${API}/api/blogs/top`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setTopBlogs(Array.isArray(data) ? data : [])
    } catch {
      setTopBlogs([])
    } finally {
      setBlogsLoading(false)
    }
  }

  const fetchAllBlogs = async () => {
    try {
      const res = await fetch(`${API}/api/blogs`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAllBlogs(Array.isArray(data) ? data : [])
    } catch {
      setAllBlogs([])
    }
  }

  const handleSeeAll = () => {
    fetchAllBlogs()
    setShowAllBlogs(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleFormChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handlePublish = async (e) => {
    e.preventDefault()
    setPublishError('')
    if (!form.title || !form.content || !form.author) {
      setPublishError('Title, content, and author are required.')
      return
    }
    setPublishing(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('content', form.content)
      fd.append('author', form.author)
      fd.append('contact', form.contact)
      if (imageFile) fd.append('image', imageFile)

      const res = await fetch(`${API}/api/blogs`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd 
      })
      if (!res.ok) throw new Error('Server error')
      setPublishSuccess(true)
      setForm({ title: '', content: '', author: '', contact: '' })
      setImageFile(null)
      setImagePreview(null)
      setTimeout(() => {
        setPublishSuccess(false)
        setShowPublish(false)
        fetchTopBlogs()
      }, 2000)
    } catch {
      setPublishError('Failed to publish. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <>
      <Navbar variant="story" />
      <div className="detail-overlay" id="detail-page" style={{ position: 'relative', overflowY: 'auto', height: 'auto', minHeight: '100vh' }}>
        {/* Back Button */}
        <button
          className="detail-close"
          onClick={() => navigate('/')}
          id="detail-close-btn"
          aria-label="Back to home"
          title="Back to Home"
        >
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
            <span className="detail-hero__badge">{t('story.badge')}</span>
            <h1 className="detail-hero__title">{t('story.title1')}<br />{t('story.title2')}</h1>
            <p className="detail-hero__subtitle">{t('story.subtitle')}</p>
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
        <section className="fest-section">
          <h2 className="fest-section__heading">{t('story.festHeading')}</h2>
          <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
            <path d="M2 10C10.5 2 17.5 18 26 10C34.5 2 41.5 18 50 10C58.5 2 65.5 18 74 10C82.5 2 89.5 18 98 10C106.5 2 113.5 18 118 10" stroke="rgb(154, 204, 192)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="fest">
            {/* ── Left: Featured Festival ── */}
            <div className="fest__left">
              <div className="fest__img-wrap">
                <img src={balaji} alt="Jai Bajrang Bali Festival" />
              </div>
              <div className="fest__title-card">
                <h2>{t('story.festTitle')}</h2>
              </div>
              <div className="fest__desc">
                <p>
                  {t('story.festDesc')}
                </p>
                <button className="fest__readmore" onClick={() => navigate('/temples')}>
                  {t('story.readMore')}
                </button>
              </div>
            </div>

            {/* ── Right: Explore More Items ── */}
            <div className="fest__right">
              <span className="fest__explore-badge" onClick={() => navigate('/temples')} style={{ cursor: 'pointer' }}>{t('story.exploreMore')}</span>
              <div className="fest__items">
                <div className="fest__item">
                  <img src={shanidev} alt="Festival" className="fest__item-img" />
                  <div className="fest__item-body">
                    <h3>{t('story.festItem1Title')}</h3>
                    <p>{t('story.festItem1Desc')}</p>
                    <button className="fest__item-link" onClick={() => navigate('/temples')}>{t('story.readMore')}</button>
                  </div>
                </div>
                <div className="fest__item">
                  <img src={balaji} alt="Festival" className="fest__item-img" />
                  <div className="fest__item-body">
                    <h3>{t('story.festItem2Title')}</h3>
                    <p>{t('story.festItem2Desc')}</p>
                    <button className="fest__item-link" onClick={() => navigate('/temples')}>{t('story.readMore')}</button>
                  </div>
                </div>
                <div className="fest__item">
                  <img src={balaji} alt="Festival" className="fest__item-img" />
                  <div className="fest__item-body">
                    <h3>{t('story.festItem3Title')}</h3>
                    <p>{t('story.festItem3Desc')}</p>
                    <button className="fest__item-link" onClick={() => navigate('/temples')}>{t('story.readMore')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ── Culture & Festivals – Trip Ideas style ── */}
        <section className="trip-ideas">
          {/* Left: intro card */}
          <div className="trip-ideas__intro">
            <h2 className="trip-ideas__intro-title">{t('story.cultureTitle')}</h2>
            <p className="trip-ideas__intro-desc">
              {t('story.cultureDesc')}
            </p>
            <button className="trip-ideas__explore-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => navigate('/culture')}>{t('story.exploreMore')} &rarr;</button>
          </div>

          {/* Right: three image cards */}
          <div className="trip-ideas__cards">
            {/* Card 1 */}
            <div className="trip-card">
              <div className="trip-card__img-wrap">
                <img src={balaji} alt="Hanuman Jayanti" className="trip-card__img" />
              </div>
              <h3 className="trip-card__title">{t('story.cultureCard1Title')}</h3>
              <ul className="trip-card__bullets">
                <li>{t('story.cultureCard1Li1')}</li>
                <li>{t('story.cultureCard1Li2')}</li>
              </ul>
              <button className="trip-card__readmore" onClick={() => navigate('/culture')}>{t('story.readMore')}</button>
            </div>

            {/* Card 2 */}
            <div className="trip-card">
              <div className="trip-card__img-wrap">
                <img src={balaji} alt="Folk Music Evening" className="trip-card__img" />
              </div>
              <h3 className="trip-card__title">{t('story.cultureCard2Title')}</h3>
              <p className="trip-card__desc">
                {t('story.cultureCard2Desc')}
              </p>
              <button className="trip-card__readmore" onClick={() => navigate('/culture')}>{t('story.readMore')}</button>
            </div>

            {/* Card 3 */}
            <div className="trip-card">
              <div className="trip-card__img-wrap">
                <img src={balaji} alt="Heritage Walk" className="trip-card__img" />
              </div>
              <h3 className="trip-card__title">{t('story.cultureCard3Title')}</h3>
              <p className="trip-card__desc">
                {t('story.cultureCard3Desc')}
              </p>
              <button className="trip-card__readmore" onClick={() => navigate('/culture')}>{t('story.readMore')}</button>
            </div>
          </div>
        </section>
        {/* ── History Section ── */}
        <section className="history-section">
          <div className="history-section__header">
            <h2 className="history-section__title">{t('story.historyTitle')}</h2>
            <svg width="100" height="18" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10C10.5 2 17.5 18 26 10C34.5 2 41.5 18 50 10C58.5 2 65.5 18 74 10C82.5 2 89.5 18 98 10C106.5 2 113.5 18 118 10" stroke="rgb(79,39,68)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="history-grid">

            {/* Decorative squiggle — sits between the two columns, upper area */}
            <svg className="history-squiggle" width="80" height="16" viewBox="0 0 100 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8C10 2 14 14 22 8C30 2 34 14 42 8C50 2 54 14 62 8C70 2 74 14 82 8C90 2 94 14 98 8" stroke="rgb(210,90,60)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* 1. Maroon card — top-left, z-index 2 */}
            <div className="hcard hcard--maroon">
              <div className="hcard__title-bar hcard__title-bar--orange">
                <h3 className="hcard__title">{t('story.historyCard1Title')}</h3>
              </div>
              <div className="hcard__body">
                <p className="hcard__desc">
                  {t('story.historyCard1Desc')}
                </p>
                <button className="hcard__link" onClick={() => navigate('/history')}>{t('story.historyExploreBtn')}</button>
              </div>
            </div>

            {/* 2. Photo — top-right (image.webp), z-index 3 — overlaps golden card top */}
            <div className="hcard__photo hcard__photo--tr">
              <img src={imageWebp} alt="Heritage view of Mali Tibba" />
            </div>

            {/* 3. Photo — bottom-left (lalpahadi), z-index 3 — overlaps maroon card bottom */}
            <div className="hcard__photo hcard__photo--bl">
              <img src={lalpahadi} alt="Lal Pahadi landscape" />
            </div>

            {/* 4. Golden card — bottom-right, z-index 1, sits BEHIND photos */}
            <div className="hcard hcard--golden">
              <div className="hcard__title-bar hcard__title-bar--purple">
                <h3 className="hcard__title">{t('story.historyCard2Title')}</h3>
              </div>
              <div className="hcard__body">
                <p className="hcard__desc">
                  {t('story.historyCard2Desc')}
                </p>
                <button className="hcard__link" onClick={() => navigate('/history')}>{t('story.historyFindMoreBtn')}</button>
              </div>
            </div>

          </div>
        </section>

        {/* ── Blog Section ── */}
        <section className="blog-section" id="blog-section">
          <div className="blog-section__header">
            <div className="blog-section__title-row">
              <div>
                <h2 className="blog-section__title">{t('story.blogsTitle')}</h2>
                <svg width="120" height="18" viewBox="0 0 140 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px' }}>
                  <path d="M2 10C12 2 20 18 30 10C40 2 48 18 58 10C68 2 76 18 86 10C96 2 104 18 114 10C124 2 132 18 138 10" stroke="rgb(154,204,192)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="blog-section__actions">
                <button className="blog-btn blog-btn--outline" id="see-all-blogs-btn" onClick={handleSeeAll}>
                  {t('story.seeAllBtn')}
                </button>
                {user && (
                  <button className="blog-btn blog-btn--primary" id="publish-blog-btn" onClick={() => setShowPublish(true)}>
                    {t('story.publishBtn')}
                  </button>
                )}
              </div>
            </div>
            <p className="blog-section__subtitle">
              {t('story.blogsSubtitle')}
            </p>
          </div>

          {/* Top 3 blogs */}
          <div className="blog-cards-grid">
            {blogsLoading ? (
              <div className="blog-skeleton-row">
                {[1, 2, 3].map(i => <div key={i} className="blog-skeleton" />)}
              </div>
            ) : topBlogs.length === 0 ? (
              <div className="blog-empty">
                <span className="blog-empty__icon">📝</span>
                <p>{t('story.noBlogs')}</p>
                {user && (
                  <button className="blog-btn blog-btn--primary" onClick={() => setShowPublish(true)}>
                    {t('story.publishFirstBtn')}
                  </button>
                )}
              </div>
            ) : (
              topBlogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} rank={i} />
              ))
            )}
          </div>
        </section>

      </div>
      <Footer />

      {/* ── All Blogs Modal ── */}
      {showAllBlogs && (
        <div className="blog-modal-overlay" onClick={() => setShowAllBlogs(false)}>
          <div className="blog-modal" onClick={e => e.stopPropagation()}>
            <div className="blog-modal__header">
              <h2 className="blog-modal__title">{t('story.allBlogsTitle')}</h2>
              <button className="blog-modal__close" onClick={() => setShowAllBlogs(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="blog-modal__body">
              {allBlogs.length === 0 ? (
                <div className="blog-empty">
                  <span className="blog-empty__icon">📭</span>
                  <p>{t('story.noBlogsPublished')}</p>
                </div>
              ) : (
                <div className="blog-modal-list">
                  {allBlogs.map((blog, i) => (
                    <BlogCard key={blog._id} blog={blog} rank={i} layout="horizontal" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Publish Blog Modal ── */}
      {showPublish && (
        <div className="blog-modal-overlay" onClick={() => setShowPublish(false)}>
          <div className="blog-modal blog-modal--publish" onClick={e => e.stopPropagation()}>
            <div className="blog-modal__header">
              <h2 className="blog-modal__title">{t('story.publishModalTitle')}</h2>
              <button className="blog-modal__close" onClick={() => setShowPublish(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="blog-modal__body">
              {publishSuccess ? (
                <div className="publish-success">
                  <div className="publish-success__icon">🎉</div>
                  <h3>{t('story.publishSuccessMsg')}</h3>
                  <p>{t('story.publishSuccessSub')}</p>
                </div>
              ) : (
                <form className="publish-form" onSubmit={handlePublish} encType="multipart/form-data">
                  {/* Image upload */}
                  <div className="publish-form__image-upload">
                    <label htmlFor="blog-image-input" className="publish-form__image-label">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="publish-form__image-preview" />
                      ) : (
                        <div className="publish-form__image-placeholder">
                          <span className="publish-form__image-icon">🖼️</span>
                          <span>{t('story.clickToUpload')}</span>
                          <span className="publish-form__image-hint">{t('story.max1Image')}</span>
                        </div>
                      )}
                    </label>
                    <input
                      id="blog-image-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    {imagePreview && (
                      <button type="button" className="publish-form__image-remove" onClick={() => { setImageFile(null); setImagePreview(null) }}>
                        {t('story.removeImg')}
                      </button>
                    )}
                  </div>

                  <div className="publish-form__group">
                    <label className="publish-form__label" htmlFor="blog-title">{t('story.blogTitleLabel')}</label>
                    <input id="blog-title" className="publish-form__input" name="title" value={form.title} onChange={handleFormChange} placeholder={t('story.blogTitlePlaceholder')} required />
                  </div>

                  <div className="publish-form__group">
                    <label className="publish-form__label" htmlFor="blog-content">{t('story.blogContentLabel')}</label>
                    <textarea id="blog-content" className="publish-form__textarea" name="content" value={form.content} onChange={handleFormChange} placeholder={t('story.blogContentPlaceholder')} rows={6} required />
                  </div>

                  <div className="publish-form__row">
                    <div className="publish-form__group">
                      <label className="publish-form__label" htmlFor="blog-author">{t('story.authorLabel')}</label>
                      <input id="blog-author" className="publish-form__input" name="author" value={form.author} onChange={handleFormChange} placeholder={t('story.authorPlaceholder')} required />
                    </div>
                    <div className="publish-form__group">
                      <label className="publish-form__label" htmlFor="blog-contact">{t('story.contactLabel')}</label>
                      <input id="blog-contact" className="publish-form__input" name="contact" value={form.contact} onChange={handleFormChange} placeholder={t('story.contactPlaceholder')} />
                    </div>
                  </div>

                  {publishError && <p className="publish-form__error">{publishError}</p>}

                  <button type="submit" className="blog-btn blog-btn--primary publish-form__submit" disabled={publishing}>
                    {publishing ? (
                      <span className="publish-spinner">{t('story.publishing')}</span>
                    ) : t('story.publishSubmit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Blog Card Component ── */
function BlogCard({ blog, rank, layout = 'vertical' }) {
  const navigate = useNavigate()
  const isHorizontal = layout === 'horizontal'
  const rankColors = ['rgb(230,175,55)', 'rgb(154,204,192)', 'rgb(210,90,60)']
  const rankBg = rankColors[rank] || 'rgba(79,39,68,0.08)'

  return (
    <div className={`blog-card ${isHorizontal ? 'blog-card--horizontal' : ''}`}>
      {blog.image && (
        <div className="blog-card__img-wrap">
          <img src={blog.image} alt={blog.title} className="blog-card__img" loading="lazy" />
          {!isHorizontal && rank < 3 && (
            <span className="blog-card__rank" style={{ background: rankBg }}>
            
            </span>
          )}
        </div>
      )}
      {!blog.image && !isHorizontal && rank < 3 && (
        <div className="blog-card__no-img">
          <span className="blog-card__rank blog-card__rank--solo" style={{ background: rankBg }}>#{rank + 1}</span>
        </div>
      )}
      <div className="blog-card__body">
        <h3 className="blog-card__title">{blog.title}</h3>
        <p className="blog-card__excerpt">{blog.content?.slice(0, 120)}{blog.content?.length > 120 ? '…' : ''}</p>
        <div className="blog-card__meta">
          <span className="blog-card__author">✍️ {blog.author}</span>
          {blog.contact && <span className="blog-card__contact">📞 {blog.contact}</span>}
        </div>
        <div className="blog-card__footer">
          <span className="blog-card__date">
            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
          </span>
          <button
            className="blog-card__read-btn"
            onClick={() => navigate(`/blog/${blog._id}`)}
            aria-label={`Read full blog: ${blog.title}`}
          >
            Read Full Blog →
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaliTibbaDetail
