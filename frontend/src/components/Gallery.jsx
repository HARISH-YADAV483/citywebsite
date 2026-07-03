import { useState, useEffect, useCallback, useContext } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { AuthContext } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import './Gallery.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'
const PAGE_SIZE = 6

/* ─────────────────────────────────────────────────────────
   Gallery Page
   ───────────────────────────────────────────────────────── */
function Gallery() {
  const [images, setImages] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lightbox, setLightbox] = useState(null) // index into images array
  const [showContribute, setShowContribute] = useState(false)
  const { t } = useTranslation()
  
  const { user, token } = useContext(AuthContext)

  // Lock scroll when overlay is open
  useEffect(() => {
    if (lightbox || showContribute) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightbox, showContribute])

  // Initial load — first 6 images
  const fetchImages = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const res = await fetch(`${API}/api/gallery?page=${pageNum}&limit=${PAGE_SIZE}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setTotal(data.total || 0)
      setImages(prev => append ? [...prev, ...(data.images || [])] : (data.images || []))
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchImages(1, false)
  }, [fetchImages])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchImages(nextPage, true)
  }

  const handleImageAdded = (newImage) => {
    setImages(prev => [newImage, ...prev])
    setTotal(prev => prev + 1)
  }

  const hasMore = images.length < total

  // ── Arrange images into staggered hex rows (3 per row) ─
  const rows = buildHexRows(images, 3)

  return (
    <>
      <Navbar variant="story" />

      <div className="gallery-page">
        {/* ── Hero ── */}
        <div className="gallery-hero">
          <div className="gallery-hero__bg-pattern" />
          <div className="gallery-hero__gradient" />
          <div className="gallery-hero__content">
            <span className="gallery-hero__badge">{t('gallery.badge')}</span>
            <h1 className="gallery-hero__title">
              {t('gallery.title1')} <span>{t('gallery.title2')}</span>
            </h1>
            <p className="gallery-hero__subtitle">
              {t('gallery.subtitle')}
            </p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="gallery-content">
          {/* Toolbar */}
          <div className="gallery-toolbar">
            <div className="gallery-toolbar__left">
              <h2>{t('gallery.toolbarTitle')}</h2>
              <p>{total > 0 ? `${total} ${t('gallery.toolbarSubtitlePlural')}` : t('gallery.toolbarSubtitleEmpty')}</p>
            </div>
            {user?.isResident && (
              <button
                className="gallery-contribute-btn"
                onClick={() => setShowContribute(true)}
                id="gallery-contribute-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('gallery.contributeBtn')}
              </button>
            )}
          </div>

          {/* Grid / States */}
          {loading ? (
            <div className="gallery-loading">
              <div className="gallery-spinner" />
              {t('gallery.loading')}
            </div>
          ) : images.length === 0 ? (
            <div className="gallery-empty">
              <span className="gallery-empty__icon">🖼️</span>
              <h3>{t('gallery.emptyTitle')}</h3>
              <p>{t('gallery.emptyText')}</p>
              {user?.isResident && (
                <button
                  className="gallery-contribute-btn"
                  onClick={() => setShowContribute(true)}
                >
                  {t('gallery.addFirstBtn')}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Hex grid */}
              <div className="hex-grid" role="list">
                {rows.map((row, ri) => (
                  <div
                    key={ri}
                    className={`hex-row ${ri % 2 === 1 ? 'hex-row--offset' : ''}`}
                  >
                    {row.map((img, ci) =>
                      img ? (
                        <HexItem
                          key={img._id}
                          image={img}
                          onClick={() => setLightbox(images.indexOf(img))}
                        />
                      ) : (
                        /* empty filler cell to maintain grid shape */
                        <div key={`empty-${ri}-${ci}`} className="hex-item hex-item--empty" aria-hidden="true">
                          <div className="hex-item__inner" />
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="gallery-load-more-wrap">
                  <button
                    className="gallery-load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    id="gallery-load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <div className="gallery-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        <span>{t('gallery.loadingMore')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('gallery.loadMore')}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Count info */}
              <p className="gallery-count-info">
                {t('gallery.showing')} {images.length} {t('gallery.of')} {total} {t('gallery.photos')}
              </p>
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <LightboxModal
          images={images}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={(newIdx) => setLightbox(newIdx)}
        />
      )}

      {/* ── Contribute Modal ── */}
      {showContribute && (
        <ContributeModal
          onClose={() => setShowContribute(false)}
          onSuccess={handleImageAdded}
          token={token}
        />
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   Hex Item
   ───────────────────────────────────────────────────────── */
function HexItem({ image, onClick }) {
  return (
    <div
      className="hex-item"
      role="listitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`View photo: ${image.title}`}
    >
      <div className="hex-item__inner">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="hex-item__img"
          loading="lazy"
        />
        <div className="hex-item__overlay">
          <span className="hex-item__title">{image.title}</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Lightbox Modal
   ───────────────────────────────────────────────────────── */
function LightboxModal({ images, index, onClose, onNavigate }) {
  const image = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  const goPrev = () => { if (hasPrev) onNavigate(index - 1) }
  const goNext = () => { if (hasNext) onNavigate(index + 1) }

  // Keyboard: Escape closes, arrows navigate
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length])

  if (!image) return null

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
    >
      <div className="lightbox-box" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image */}
        <div className="lightbox-img-wrap">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="lightbox-img"
          />
        </div>

        {/* Footer: counter + title + date */}
        <div className="lightbox-footer">
          <div className="lightbox-counter">{index + 1} / {images.length}</div>
          <h2 className="lightbox-title">{image.title}</h2>
          {image.createdAt && (
            <span className="lightbox-date">
              {new Date(image.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* Prev arrow */}
        <button
          className={`lightbox-nav lightbox-nav--prev${!hasPrev ? ' lightbox-nav--disabled' : ''}`}
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          className={`lightbox-nav lightbox-nav--next${!hasNext ? ' lightbox-nav--disabled' : ''}`}
          onClick={goNext}
          disabled={!hasNext}
          aria-label="Next image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Contribute Modal
   ───────────────────────────────────────────────────────── */
function ContributeModal({ onClose, onSuccess, token }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Escape key
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
    if (!imageFile)   { setError(t('common.errImg')); return }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('image', imageFile)
      const res = await fetch(`${API}/api/gallery`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd 
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Upload failed')
      }
      const newImage = await res.json()
      setSuccess(true)
      onSuccess(newImage)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2200)
    } catch (err) {
      setError(err.message || t('common.errUpload'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="contribute-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="contribute-modal" onClick={e => e.stopPropagation()}>
        <div className="contribute-modal__header">
          <h2 className="contribute-modal__title">{t('gallery.modalTitle')}</h2>
          <button className="contribute-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="contribute-modal__body">
          {success ? (
            <div className="contribute-success">
              <span className="contribute-success__icon">🎉</span>
              <h3>{t('gallery.successMsg')}</h3>
              <p>{t('gallery.successSub')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Image Upload */}
              <label
                className="contribute-upload-zone"
                htmlFor="gallery-image-input"
                style={{ cursor: 'pointer' }}
              >
                {preview ? (
                  <div className="contribute-preview-wrap">
                    <img src={preview} alt="Preview" className="contribute-preview-img" />
                  </div>
                ) : (
                  <div className="contribute-upload-placeholder">
                    <span className="contribute-upload-icon">🖼️</span>
                    <span className="contribute-upload-hint">{t('common.clickChoose')}</span>
                    <span className="contribute-upload-sub">{t('common.supportedFormats')}</span>
                  </div>
                )}
              </label>
              <input
                id="gallery-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {preview && (
                <button
                  type="button"
                  className="contribute-preview-remove"
                  style={{ marginBottom: 16, display: 'block', marginLeft: 'auto' }}
                  onClick={() => { setImageFile(null); setPreview(null) }}
                >
                  {t('common.removeImg')}
                </button>
              )}

              {/* Title */}
              <div className="contribute-form-group">
                <label className="contribute-form-label" htmlFor="gallery-title-input">
                  {t('common.photoTitleLabel')}
                </label>
                <input
                  id="gallery-title-input"
                  className="contribute-form-input"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={t('gallery.photoTitlePlaceholder')}
                  maxLength={120}
                  required
                />
              </div>

              {error && <p className="contribute-error">{error}</p>}

              <button
                type="submit"
                className="contribute-submit-btn"
                disabled={uploading}
                id="gallery-upload-submit-btn"
              >
                {uploading ? t('common.uploading') : t('gallery.uploadBtn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────── */

/**
 * Split a flat array of images into rows of `perRow` items.
 * The last row is padded with `null` if it's not full —
 * so the hex grid always looks balanced.
 */
function buildHexRows(images, perRow) {
  if (!images.length) return []
  const rows = []
  for (let i = 0; i < images.length; i += perRow) {
    const slice = images.slice(i, i + perRow)
    // Pad the last row so hex offset math stays correct
    while (slice.length < perRow) slice.push(null)
    rows.push(slice)
  }
  return rows
}

export default Gallery
