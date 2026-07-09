import React, { useState } from 'react';

const Login = ({ lang, setToken, setUser, t }) => {
  const [authTab, setAuthTab] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLocation, setAuthLocation] = useState('');
  const [authRole, setAuthRole] = useState('farmer');

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('km_token', data.token);
        localStorage.setItem('km_user', JSON.stringify(data.user));
        alert(lang === 'en' ? 'Logged in successfully!' : 'सफलतापूर्वक लॉग इन किया गया!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Login request failed.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
          role: authRole,
          phone: authPhone,
          location: authLocation
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAuthTab('login');
        alert(lang === 'en' ? 'Registration successful! Please login.' : 'पंजीकरण सफल रहा! कृपया लॉग इन करें।');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Registration request failed.');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '300px', height: '300px', background: 'rgba(76, 175, 80, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      
      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div className="visual-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', textAlign: 'left', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.7)', boxShadow: 'var(--shadow-lg)' }}>
          {/* Header Tab Toggles */}
          <div style={{ display: 'flex', gap: '1.25rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => setAuthTab('login')} 
              style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', fontWeight: authTab === 'login' ? '800' : '500', color: authTab === 'login' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--sans)', outline: 'none' }}
            >
              {t.login}
            </button>
            <button 
              onClick={() => setAuthTab('register')} 
              style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', fontWeight: authTab === 'register' ? '800' : '500', color: authTab === 'register' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--sans)', outline: 'none' }}
            >
              {t.register}
            </button>
          </div>

          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.email}</label>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.password}</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>{t.login}</button>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer', textAlign: 'center', fontWeight: '600' }} onClick={() => setAuthTab('register')}>
                {t.noAccount}
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.fullName}</label>
                <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.email}</label>
                  <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                </div>
                <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.role}</label>
                  <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', height: '100%', background: 'white' }}>
                    <option value="farmer">{t.farmer}</option>
                    <option value="buyer">{t.buyer}</option>
                  </select>
                </div>
              </div>
              <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.password}</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.phone}</label>
                  <input type="text" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                </div>
                <div className="auth-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.location}</label>
                  <input type="text" value={authLocation} onChange={(e) => setAuthLocation(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>{t.register}</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
