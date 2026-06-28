import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__deco"></div>
      <div className="footer__container">
        
        <div className="footer__grid">
          {/* Brand & Details */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-dot"></span>
              <span className="footer__title">Mali Tibba</span>
            </div>
            <ul className="footer__details-list">
              <li><strong>Locality Name:</strong> Mohalla Mali Tibba</li>
              <li><strong>Town/City:</strong> Narnaul</li>
              <li><strong>Tehsil:</strong> Narnaul</li>
              <li><strong>District:</strong> Mahendragarh</li>
              <li><strong>State:</strong> Haryana</li>
              <li><strong>Division:</strong> Gurgaon Division</li>
              <li><strong>Country:</strong> India</li>
              <li><strong>PIN Code:</strong> 123001</li>
              <li><strong>Post Office:</strong> Narnaul Head Office</li>
              <li><strong>Languages:</strong> Hindi, Haryanvi, Punjabi</li>
              <li><strong>Time Zone:</strong> IST (UTC +05:30)</li>
              <li><strong>Elevation:</strong> Approx 308 m above sea level</li>
              <li><strong>Assembly Constituency:</strong> Narnaul (70)</li>
              <li><strong>Current MLA:</strong> Om Parkash Yadav (BJP)</li>
              <li><strong>Lok Sabha Constituency:</strong> Bhiwani–Mahendragarh</li>
              <li><strong>Current MP:</strong> Dharambir Singh (BJP)</li>
            </ul>
          </div>

          {/* Location & Explore */}
          <div className="footer__column">
            <h3 className="footer__column-title">Explore</h3>
            <ul className="footer__links">
              <li>
                <svg className="footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <a href="https://www.google.com/maps/place/Mohalla+Mali+Tibba,+Narnaul,+Haryana+123001/@28.0364079,76.1066231,16z/data=!3m1!4b1!4m6!3m5!1s0x3912b5c10ab6bd4b:0x72080dfb667d5f3e!8m2!3d28.0349822!4d76.1116997!16s%2Fg%2F1ptwnyfs6?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                 Mali Tibba, Narnaul, Haryana, India
                </a>
              </li>
              <li>
                <svg className="footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                <a href="#explore">Interactive Map</a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="footer__column">
            <h3 className="footer__column-title">Contact</h3>
            <ul className="footer__links">
              <li>
                <svg className="footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="#">info@malitibba.com</a>
              </li>
              <li>
                <svg className="footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+910000000000">+91 000-000-0000</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Developer */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            &copy; {new Date().getFullYear()} Mohalla Mali Tibba. All Rights Reserved.
          </div>
          <div className="footer__developer">
            Designed & Developed by 
            <a href="https://harishpuhaniya.online" target="_blank" rel="noopener noreferrer">
              harishpuhaniya.online
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
