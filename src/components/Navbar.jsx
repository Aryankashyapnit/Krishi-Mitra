import React from 'react';
import Logo from './Logo';

const Navbar = ({
  lang,
  setLang,
  token,
  user,
  handleLogout,
  setAuthTab,
  setShowAuthModal,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  t
}) => {
  return (
    <nav className="navbar">
      <a href="#home" className="brand-container">
        <Logo width={45} height={45} />
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1' }}>
          <span className="brand-name" style={{ display: 'flex', gap: '4px', fontSize: '1.4rem', margin: '0' }}>
            <span style={{ color: '#0B4B28' }}>Krishi</span>
            <span style={{ color: '#4CAF50' }}>Mitra</span>
          </span>
          <span style={{ fontSize: '0.5rem', fontWeight: '700', letterSpacing: '0.5px', color: '#666666', marginTop: '2px' }}>
            AGRICULTURE'S TRUE FRIEND
          </span>
        </div>
      </a>

      {/* Mobile Hamburger Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><a href="#crops" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.navCrops}</a></li>
        <li><a href="#mandi" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.navMandi}</a></li>
        <li><a href="#weather" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.checkWeather}</a></li>
        <li><a href="#simulator" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.navSimulator}</a></li>
        <li><a href="#schemes" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.navSchemes}</a></li>
        
        {/* Authenticated Links */}
        {token && (
          <li><a href="#dashboard" className="nav-link" style={{ color: 'var(--primary-dark)', fontWeight: '700' }} onClick={() => setIsMobileMenuOpen(false)}>{t.navDashboard}</a></li>
        )}
        {token && user?.role === 'admin' && (
          <li><a href="#admin" className="nav-link" style={{ color: '#D35400', fontWeight: '700' }} onClick={() => setIsMobileMenuOpen(false)}>{t.navAdmin}</a></li>
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
              🚪 {t.logout}
            </button>
          ) : (
            <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); setIsMobileMenuOpen(false); }} className="nav-btn">
              👤 {t.login}
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
