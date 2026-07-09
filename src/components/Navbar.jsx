import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({
  lang = 'en',
  setLang = () => {},
  token = null,
  user = null,
  handleLogout = () => {},
  setAuthTab = () => {},
  setShowAuthModal = () => {},
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
  t = null
}) => {
  // If localizations ('t') is not passed, use a default english fallback dictionary
  const defaultT = t || {
    navCrops: "Crops Guide",
    navMandi: "Marketplace",
    checkWeather: "Weather Advisor",
    navSimulator: "Disease Scanner",
    navSchemes: "Subsidies",
    navDashboard: "Dashboard",
    navAdmin: "Admin Panel",
    login: "Login",
    logout: "Logout"
  };

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <Link to="/" className="brand-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          {/* Plant + Sun SVG Logo */}
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nav-green" x1="15" y1="85" x2="40" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B4B28" />
                <stop offset="50%" stopColor="#1B5E20" />
                <stop offset="100%" stopColor="#4CAF50" />
              </linearGradient>
              <linearGradient id="nav-gold" x1="45" y1="85" x2="85" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A87F18" />
                <stop offset="60%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#F3E5AB" />
              </linearGradient>
              <linearGradient id="nav-sun" x1="55" y1="15" x2="55" y2="55" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E5A93B" />
                <stop offset="100%" stopColor="#F7D373" />
              </linearGradient>
            </defs>
            <circle cx="56" cy="36" r="18" fill="url(#nav-sun)" />
            <path d="M50 82 C40 82 23 70 16 50 C10 35 12 21 16 14 C27 19 37 32 39 46 C41 60 48 76 50 82 Z" fill="url(#nav-green)" />
            <path d="M18 16 C23 32 31 49 47 67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M50 82 C53 71 63 56 78 52 C88 48 90 60 84 68 C76 76 63 81 50 82 Z" fill="url(#nav-gold)" />
            <path d="M51 82 C61 74 72 70 81 68" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <path d="M50 82 C44 82 40 76 42 70 C44 64 50 60 56 60" stroke="#0B4B28" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1' }}>
            <span className="brand-name" style={{ display: 'flex', gap: '4px', fontSize: '1.4rem', margin: '0' }}>
              <span style={{ color: '#0B4B28' }}>Krishi</span>
              <span style={{ color: '#4CAF50' }}>Mitra</span>
            </span>
            <span style={{ fontSize: '0.5rem', fontWeight: '700', letterSpacing: '0.5px', color: '#666666', marginTop: '2px' }}>
              AGRICULTURE'S TRUE FRIEND
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <li><Link to="/crops" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{defaultT.navCrops}</Link></li>
          <li><a href="/#mandi" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{defaultT.navMandi}</a></li>
          <li><a href="/#weather" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{defaultT.checkWeather}</a></li>
          <li><a href="/#simulator" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{defaultT.navSimulator}</a></li>
          <li><a href="/#schemes" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{defaultT.navSchemes}</a></li>
          
          {/* Authenticated Links */}
          {token && (
            <li><a href="/#dashboard" className="nav-link" style={{ color: 'var(--primary-dark)', fontWeight: '700' }} onClick={() => setIsMobileMenuOpen(false)}>{defaultT.navDashboard}</a></li>
          )}
          {token && user?.role === 'admin' && (
            <li><a href="/#admin" className="nav-link" style={{ color: '#D35400', fontWeight: '700' }} onClick={() => setIsMobileMenuOpen(false)}>{defaultT.navAdmin}</a></li>
          )}

          <li>
            <select 
              value={lang} 
              onChange={(e) => { setLang(e.target.value); setIsMobileMenuOpen(false); }}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--primary-light)',
                fontWeight: '600',
                color: 'var(--primary-dark)',
                background: 'white',
                cursor: 'pointer',
                fontFamily: 'var(--sans)'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </li>

          <li>
            {token ? (
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="nav-btn" style={{ background: '#7F8C8D' }}>
                🚪 {defaultT.logout}
              </button>
            ) : (
              <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); setIsMobileMenuOpen(false); }} className="nav-btn">
                👤 {defaultT.login}
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
