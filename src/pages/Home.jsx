import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Home = ({ user, t, lang }) => {
  return (
    <div className="home-page-container">
      {/* Background Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '350px', height: '350px', background: 'rgba(76, 175, 80, 0.07)', filter: 'blur(110px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '5%', width: '400px', height: '400px', background: 'rgba(212, 175, 55, 0.05)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* Hero Section */}
      <header className="hero-section" style={{ zIndex: 1, position: 'relative' }}>
        <div className="hero-text">
          <div className="hero-badge">
            <span style={{ fontSize: '1.1rem' }}>🌾</span>
            {user ? (
              <span>Welcome, {user.name} ({user.role}) / स्वागत है, {user.name}</span>
            ) : (
              <span>Your Farming Partner / आपका खेती मित्र</span>
            )}
          </div>
          <h1 className="hero-title">{t.tagline}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-actions">
            <Link to="/crops" className="btn-primary">{t.getStarted}</Link>
            <Link to="/disease" className="btn-secondary">{t.learnMore}</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-card">
            <Logo width={120} height={120} />
            <div className="visual-tagline" style={{ display: 'flex', gap: '4px', fontSize: '1.5rem', fontWeight: '700', marginTop: '1rem' }}>
              <span style={{ color: '#0B4B28' }}>Krishi</span>
              <span style={{ color: '#4CAF50' }}>Mitra</span>
            </div>
            <div className="visual-subtext" style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.5px', color: '#666666', marginTop: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              AGRICULTURE'S TRUE FRIEND
            </div>
          </div>
        </div>
      </header>

      {/* Feature Navigation Grid */}
      <section className="features-section" style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
        <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="section-title">{lang === 'en' ? 'Our Digital Farming Ecosystem' : 'हमारा डिजिटल कृषि तंत्र'}</h2>
          <p className="section-subtitle">{lang === 'en' ? 'Explore key tools built to assist you in modern, scientific agriculture.' : 'आधुनिक, वैज्ञानिक खेती में आपकी सहायता के लिए बनाए गए प्रमुख उपकरणों का पता लगाएं।'}</p>
        </div>

        <div className="features-grid">
          {/* Card 1: Crops Guide */}
          <Link to="/crops" style={{ textDecoration: 'none', color: 'inherit' }} className="feature-card">
            <div className="feature-icon-wrapper">🌱</div>
            <h3 className="feature-title">{t.navCrops}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {lang === 'en' ? 'Access scientific cultivation guides, optimum soil temp and water advice.' : 'वैज्ञानिक खेती गाइड, इष्टतम मिट्टी के तापमान और पानी की सलाह प्राप्त करें।'}
            </p>
            <span style={{ fontWeight: '700', color: 'var(--primary-light)', fontSize: '0.85rem' }}>{lang === 'en' ? 'Explore Guide →' : 'गाइड देखें →'}</span>
          </Link>

          {/* Card 2: Disease Scanner */}
          <Link to="/disease" style={{ textDecoration: 'none', color: 'inherit' }} className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(192, 57, 43, 0.1)' }}>🍃</div>
            <h3 className="feature-title">{t.navSimulator}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {lang === 'en' ? 'Upload leaf photos to instantly diagnose bacterial rusts or blights with remedies.' : 'Remedies के साथ बैक्टीरियल जंग या ब्लाइट्स का तुरंत निदान करने के लिए पत्ती की तस्वीरें अपलोड करें।'}
            </p>
            <span style={{ fontWeight: '700', color: '#C0392B', fontSize: '0.85rem' }}>{lang === 'en' ? 'Scan Now →' : 'अभी जांचें →'}</span>
          </Link>

          {/* Card 3: Mandi Marketplace */}
          <Link to="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }} className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>🚜</div>
            <h3 className="feature-title">{t.navMandi}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {lang === 'en' ? 'List your harvest produce, browse current mandi prices, and connect directly.' : 'अपनी फसल की उपज को सूचीबद्ध करें, वर्तमान मंडी भाव देखें, और सीधे जुड़ें।'}
            </p>
            <span style={{ fontWeight: '700', color: '#D4AF37', fontSize: '0.85rem' }}>{lang === 'en' ? 'Visit Market →' : 'मंडी जाएं →'}</span>
          </Link>

          {/* Card 4: Weather Advisor */}
          <Link to="/weather" style={{ textDecoration: 'none', color: 'inherit' }} className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(2, 132, 199, 0.1)' }}>🌤️</div>
            <h3 className="feature-title">{t.checkWeather}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {lang === 'en' ? 'Search weather by city and receive customized weekly sowing advice.' : 'शहर के अनुसार मौसम खोजें और साप्ताहिक बुवाई की सलाह प्राप्त करें।'}
            </p>
            <span style={{ fontWeight: '700', color: 'var(--accent-blue)', fontSize: '0.85rem' }}>{lang === 'en' ? 'Check Weather →' : 'मौसम देखें →'}</span>
          </Link>

          {/* Card 5: KCC Loans & Subsidies */}
          <Link to="/loans" style={{ textDecoration: 'none', color: 'inherit' }} className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(155, 89, 182, 0.1)' }}>💰</div>
            <h3 className="feature-title">{t.navSchemes}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {lang === 'en' ? 'Check your eligibility for PM-Kisan subsidies and Kisan Credit Cards.' : 'पीएम-किसान सब्सिडी और किसान क्रेडिट कार्ड के लिए अपनी पात्रता की जांच करें।'}
            </p>
            <span style={{ fontWeight: '700', color: '#9B59B6', fontSize: '0.85rem' }}>{lang === 'en' ? 'View Schemes →' : 'योजनाएं देखें →'}</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
