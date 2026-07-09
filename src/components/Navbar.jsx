import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(27, 94, 32, 0.05)' }}>
      <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '1rem 5%', boxSizing: 'border-box' }}>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          {/* Vector Logo representing Plant + Sun */}
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
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
            <h1 style={{ display: 'flex', gap: '4px', fontSize: '1.4rem', margin: 0, lineHeight: 1 }}>
              <span style={{ color: '#0B4B28' }}>Krishi</span>
              <span style={{ color: '#4CAF50' }}>Mitra</span>
            </h1>
            <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.5px', color: '#666666', marginTop: '2px' }}>
              AGRICULTURE'S TRUE FRIEND
            </span>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" className="nav-link" style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--text-dark)' }}>Home</Link>
          <Link to="/crops" className="nav-link" style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--primary-light)' }}>Crops Guide</Link>
          <a href="/#mandi" className="nav-link" style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--text-dark)' }}>Marketplace</a>
          <a href="/#weather" className="nav-link" style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--text-dark)' }}>Weather Advisor</a>
          <a href="/#schemes" className="nav-link" style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--text-dark)' }}>Subsidies</a>
          <a href="/#simulator" className="nav-link" style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--text-dark)' }}>Disease Scanner</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
