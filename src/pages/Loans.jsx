import React, { useState, useEffect } from 'react';

const Loans = ({ lang, token, user, t }) => {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Scheme creation form states
  const [asTitle, setAsTitle] = useState('');
  const [asDesc, setAsDesc] = useState('');
  const [asElig, setAsElig] = useState('');
  const [asLink, setAsLink] = useState('');
  const [asCat, setAsCat] = useState('loan');
  
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_BASE}/schemes`);
      if (res.ok) {
        const data = await res.json();
        setSchemes(data);
      }
    } catch (err) {
      // Local fallback
      setSchemes([
        { id: 1, title: "PM Kisan Samman Nidhi Yojana", description: "All landholding farmers families are provided income support of Rs. 6000 per year in three installments.", eligibility: "All small and marginal landholding farmer families.", link: "https://pmkisan.gov.in/", category: "subsidy" },
        { id: 2, title: "Kisan Credit Card (KCC) Scheme", description: "Subsidized agricultural loans starting at 4% interest rates to meet short-term credit requirements.", eligibility: "All farmers and owner-cultivators.", link: "https://www.sbi.co.in/web/personal-banking/loans/agriculture-banking/kisan-credit-card", category: "loan" }
      ]);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleAddScheme = async (e) => {
    e.preventDefault();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/schemes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: asTitle,
          description: asDesc,
          eligibility: asElig,
          link: asLink,
          category: asCat
        })
      });

      if (res.ok) {
        fetchSchemes();
        setAsTitle('');
        setAsDesc('');
        setAsElig('');
        setAsLink('');
        alert('New scheme added successfully!');
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      alert('Failed to add scheme.');
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '300px', height: '300px', background: 'rgba(155, 89, 182, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', width: '350px', height: '350px', background: 'rgba(76, 175, 80, 0.06)', filter: 'blur(110px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
        <div className="section-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span className="hero-badge" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9B59B6', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(155, 89, 182, 0.2)' }}>
            💰 SCHEMES & LOANS
          </span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{lang === 'en' ? 'Government Loans & Subsidies' : 'सरकारी ऋण और सब्सिडी योजनाएं'}</h2>
          <p className="section-subtitle">{lang === 'en' ? 'Get financial support and agricultural subsidies easily.' : 'कृषि ऋण और वित्तीय सब्सिडी की जानकारी प्राप्त करें।'}</p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.7)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(12px)' }}>
          <input 
            type="text" 
            placeholder={lang === 'en' ? 'Search schemes...' : 'योजनाएं खोजें...'} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', width: '300px', maxWidth: '100%', fontFamily: 'var(--sans)', fontSize: '0.92rem' }}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Loan', 'Subsidy'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setCategoryFilter(cat)}
                style={{ 
                  padding: '0.6rem 1.25rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  background: categoryFilter === cat ? 'var(--primary-dark)' : 'white', 
                  color: categoryFilter === cat ? 'white' : 'var(--text-dark)', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Display Grid */}
        <div className="features-grid">
          {filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="feature-card" style={{ borderTop: '5px solid var(--primary-dark)', padding: '2rem', display: 'flex', flexDirection: 'column', textAlign: 'left', minHeight: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: scheme.category === 'loan' ? '#D35400' : 'var(--primary-light)', background: 'rgba(0,0,0,0.03)', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
                  {scheme.category}
                </span>
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{scheme.title}</h3>
              <p className="feature-description" style={{ fontSize: '0.9rem', marginBottom: '1.25rem', flexGrow: 1, color: 'var(--text-muted)', lineHeight: '1.5' }}>{scheme.description}</p>
              
              <div style={{ fontSize: '0.82rem', background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.03)' }}>
                <strong>🎓 {lang === 'en' ? 'Eligibility:' : 'पात्रता:'}</strong> {scheme.eligibility}
              </div>
              
              <a 
                href={scheme.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary" 
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.65rem', fontSize: '0.9rem', borderRadius: '10px', fontWeight: '700' }}
              >
                🔗 {lang === 'en' ? 'Official Link' : 'आधिकारिक लिंक'}
              </a>
            </div>
          ))}
        </div>

        {/* Admin Controls Panel */}
        {token && user?.role === 'admin' && (
          <div className="visual-card" style={{ maxWidth: '650px', margin: '3.5rem auto 0', padding: '2.5rem', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.4rem', margin: '0 0 1.25rem', fontWeight: '800' }}>🛠️ Add New Scheme (Admin Only)</h3>
            <form onSubmit={handleAddScheme} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>Scheme Title</label>
                <input type="text" value={asTitle} onChange={(e) => setAsTitle(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>Description</label>
                <textarea value={asDesc} onChange={(e) => setAsDesc(e.target.value)} required rows="3" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', fontFamily: 'var(--sans)' }}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>Eligibility Criteria</label>
                  <input type="text" value={asElig} onChange={(e) => setAsElig(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                </div>
                <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>Category</label>
                  <select value={asCat} onChange={(e) => setAsCat(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', height: '100%', background: 'white' }}>
                    <option value="loan">Loan</option>
                    <option value="subsidy">Subsidy</option>
                  </select>
                </div>
              </div>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>Official Website URL</label>
                <input type="url" value={asLink} onChange={(e) => setAsLink(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.85rem' }}>Add Scheme</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Loans;
