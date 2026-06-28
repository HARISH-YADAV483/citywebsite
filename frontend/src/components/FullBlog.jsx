import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import './FullBlog.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'

function FullBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${API}/api/blogs/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(data => { setBlog(data); setLoading(false) })
      .catch(() => { setError('Could not load this blog.'); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar variant="story" />
        <div className="fb-loading">
          <div className="fb-loading__bar" />
          <p>Loading blog…</p>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !blog) {
    return (
      <>
        <Navbar variant="story" />
        <div className="fb-error">
          <span className="fb-error__icon">📭</span>
          <h2>Blog not found</h2>
          <p>{error || 'This blog does not exist or was removed.'}</p>
          <button className="fb-back-btn" onClick={() => navigate('/story')}>
            ← Back to Mali Tibba
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <>
      <Navbar variant="story" />

      <div className="fb-page">
        {/* Back button */}
        <button className="fb-page__back" onClick={() => navigate('/story')} aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        {/* Hero image */}
        {blog.image && (
          <div className="fb-hero">
            <img src={blog.image} alt={blog.title} className="fb-hero__img" />
            <div className="fb-hero__overlay" />
          </div>
        )}

        {/* Article */}
        <article className={`fb-article ${!blog.image ? 'fb-article--no-hero' : ''}`}>
          {/* Meta */}
          <div className="fb-article__meta">
            <span className="fb-article__badge">📍 Mali Tibba Community Blog</span>
          </div>

          {/* Title */}
          <h1 className="fb-article__title">{blog.title}</h1>

          {/* Author row */}
          <div className="fb-article__author-row">
            <div className="fb-article__avatar">
              {blog.author?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="fb-article__author-info">
              <span className="fb-article__author-name">{blog.author}</span>
              {(blog.contact || formattedDate) && (
                <span className="fb-article__author-sub">
                  {blog.contact && <>{blog.contact}</>}
                  {blog.contact && formattedDate && <span className="fb-dot">·</span>}
                  {formattedDate && <>{formattedDate}</>}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="fb-article__divider">
            <svg width="80" height="14" viewBox="0 0 100 14" fill="none">
              <path d="M2 7C12 1 18 13 28 7C38 1 44 13 54 7C64 1 70 13 80 7C90 1 96 13 98 7"
                stroke="rgb(154,204,192)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Content */}
          <div className="fb-article__content">
            {(blog.content || '').split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

          {/* Footer */}
          <div className="fb-article__footer">
            <button className="fb-back-btn" onClick={() => navigate('/story')}>
              ← Back to Mali Tibba
            </button>
          </div>
        </article>
      </div>

      <Footer />
    </>
  )
}

export default FullBlog
