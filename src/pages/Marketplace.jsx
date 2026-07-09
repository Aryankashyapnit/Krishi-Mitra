import React, { useState, useEffect } from 'react';

const Marketplace = ({ lang, token, user, t }) => {
  const [marketTab, setMarketTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Listing form states
  const [newCrop, setNewCrop] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLoc, setNewLoc] = useState('');

  // Official Mandi Board states
  const [mandiRatesList, setMandiRatesList] = useState([]);
  const [mandiStateFilter, setMandiStateFilter] = useState('All');
  const [mandiCropSearch, setMandiCropSearch] = useState('');

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/listings`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      // Local fallback
      setListings([
        { id: 1, crop_name: "Premium Wheat (गेंहू)", quantity: "500 kg", price: 24, location: "Indore Mandi", seller_phone: "9876543210", seller_name: "Ramesh Kumar" },
        { id: 2, crop_name: "Basmati Rice (धान)", quantity: "1200 kg", price: 65, location: "Karnal Hub", seller_phone: "9988776655", seller_name: "Sukhbir Singh" }
      ]);
    }
  };

  const fetchMandiBoard = async (state, crop) => {
    try {
      const stateQuery = state && state !== 'All' ? `&state=${state}` : '';
      const cropQuery = crop ? `&crop=${crop}` : '';
      const res = await fetch(`${API_BASE}/mandi-board?q=1${stateQuery}${cropQuery}`);
      if (res.ok) {
        const data = await res.json();
        setMandiRatesList(data);
      }
    } catch (err) {
      setMandiRatesList([
        { id: 1, crop: "Wheat (गेंहू)", state: "MP", mandi: "Indore", minPrice: 2050, maxPrice: 2300, avgPrice: 2180 },
        { id: 2, crop: "Wheat (गेंहू)", state: "PB", mandi: "Khanna", minPrice: 2125, maxPrice: 2275, avgPrice: 2210 },
        { id: 3, crop: "Rice (धान)", state: "HR", mandi: "Karnal", minPrice: 2800, maxPrice: 3400, avgPrice: 3100 }
      ]);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    fetchMandiBoard(mandiStateFilter, mandiCropSearch);
  }, [mandiStateFilter, mandiCropSearch]);

  const handleAddListing = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to post a listing.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cropName: newCrop,
          quantity: newQty,
          price: newPrice,
          location: newLoc
        })
      });

      if (res.ok) {
        fetchListings();
        setNewCrop('');
        setNewQty('');
        setNewPrice('');
        setNewLoc('');
        setShowAddForm(false);
        alert('Listing posted successfully!');
      } else {
        alert('Failed to post listing.');
      }
    } catch (err) {
      alert('Failed to post listing.');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '300px', height: '300px', background: 'rgba(212, 175, 55, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', width: '350px', height: '350px', background: 'rgba(76, 175, 80, 0.06)', filter: 'blur(110px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
        <div className="section-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span className="hero-badge" style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            🚜 MANDI TRADE
          </span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{t.mandiTitle}</h2>
          <p className="section-subtitle">{t.mandiSub}</p>
        </div>

        {/* Sub Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => setMarketTab('listings')} 
            className={marketTab === 'listings' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.65rem 1.75rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}
          >
            🛒 {lang === 'en' ? 'Farmer Listings' : 'किसान फसल सूचियां'}
          </button>
          <button 
            onClick={() => setMarketTab('mandiRates')} 
            className={marketTab === 'mandiRates' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.65rem 1.75rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}
          >
            📈 {lang === 'en' ? 'Official Mandi Rates' : 'सरकारी मंडी भाव'}
          </button>
        </div>

        {marketTab === 'listings' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '12px', fontSize: '0.95rem' }}>
                🌾 {t.addListing}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddListing} className="visual-card" style={{ maxWidth: '500px', margin: '0 auto 3rem', padding: '2.25rem', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 1.25rem', color: 'var(--primary-dark)', fontSize: '1.4rem', fontWeight: '800' }}>{t.addListing}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>{t.cropName}</label>
                    <input 
                      type="text" 
                      value={newCrop} 
                      onChange={(e) => setNewCrop(e.target.value)} 
                      required 
                      className="auth-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>{t.quantity}</label>
                      <input 
                        type="text" 
                        value={newQty} 
                        onChange={(e) => setNewQty(e.target.value)} 
                        placeholder="e.g. 200 kg" 
                        required 
                        className="auth-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>{t.price} (Rs/kg)</label>
                      <input 
                        type="number" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)} 
                        placeholder="e.g. 25" 
                        required 
                        className="auth-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>{t.location}</label>
                    <input 
                      type="text" 
                      value={newLoc} 
                      onChange={(e) => setNewLoc(e.target.value)} 
                      placeholder="e.g. Indore Mandi" 
                      className="auth-input"
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.85rem' }}>
                    {t.submitListing}
                  </button>
                </div>
              </form>
            )}

            <div className="features-grid">
              {listings.map((list) => (
                <div key={list.id} className="feature-card" style={{ borderLeft: '5px solid var(--primary-light)', padding: '1.75rem', textAlign: 'left', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{list.crop_name}</span>
                    <span style={{ background: '#E8F5E9', color: 'var(--primary-dark)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '800' }}>
                      {list.quantity}
                    </span>
                  </div>
                  <div style={{ margin: '1rem 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-dark)', flexGrow: 1 }}>
                    ₹{list.price} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-muted)' }}>/ kg</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                    <div>📍 {list.location}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>👤 {list.seller_name || 'Farmer'}</span>
                      <a href={`tel:${list.seller_phone}`} style={{ textDecoration: 'none', background: 'var(--primary-dark)', color: 'white', padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                        📞 Call
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Search Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(12px)', textAlign: 'left' }}>
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search Crop (e.g. Wheat)...' : 'फसल खोजें (जैसे गेंहू)...'} 
                value={mandiCropSearch} 
                onChange={(e) => setMandiCropSearch(e.target.value)} 
                style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', width: '280px', maxWidth: '100%', fontFamily: 'var(--sans)', fontSize: '0.92rem' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{lang === 'en' ? 'State:' : 'राज्य:'}</span>
                <select 
                  value={mandiStateFilter} 
                  onChange={(e) => setMandiStateFilter(e.target.value)} 
                  style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '0.92rem', background: 'white' }}
                >
                  <option value="All">{lang === 'en' ? 'All States' : 'सभी राज्य'}</option>
                  <option value="MP">Madhya Pradesh (MP)</option>
                  <option value="MH">Maharashtra (MH)</option>
                  <option value="PB">Punjab (PB)</option>
                  <option value="UP">Uttar Pradesh (UP)</option>
                </select>
              </div>
            </div>

            {/* Mandi Rates Board Table */}
            <div className="mandi-table-container" style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <table className="mandi-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                <thead>
                  <tr style={{ background: 'var(--primary-dark)', color: 'white' }}>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>{lang === 'en' ? 'Crop' : 'फसल'}</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>{lang === 'en' ? 'State' : 'राज्य'}</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>{lang === 'en' ? 'Market / Mandi' : 'मंडी / बाज़ार'}</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>{lang === 'en' ? 'Min Price' : 'न्यूनतम भाव'}</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>{lang === 'en' ? 'Max Price' : 'अधिकतम भाव'}</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>{lang === 'en' ? 'Average Price' : 'औसत भाव'}</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiRatesList.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {lang === 'en' ? 'No mandi records found.' : 'कोई मंडी रिकॉर्ड नहीं मिला।'}
                      </td>
                    </tr>
                  ) : (
                    mandiRatesList.map((rate) => (
                      <tr key={rate.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--primary-dark)' }}>{rate.crop}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}><span className="badge-role" style={{ background: '#7F8C8D', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700' }}>{rate.state}</span></td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-dark)' }}>📍 {rate.mandi}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: '#C0392B', fontWeight: '700' }}>₹{rate.minPrice} / qtl</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: '#27AE60', fontWeight: '700' }}>₹{rate.maxPrice} / qtl</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--primary-dark)', fontWeight: '800', fontSize: '1rem' }}>₹{rate.avgPrice} / qtl</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Price Trend Chart Card */}
            <div className="visual-card" style={{ padding: '2rem', textAlign: 'left', width: '100%', boxSizing: 'border-box', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ color: 'var(--primary-dark)', margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: '800' }}>
                📈 {lang === 'en' ? 'Wheat Price Trend (Rs./Quintal)' : 'गेंहू मंडी भाव रुझान (₹/क्विंटल)'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                {lang === 'en' ? 'Average market prices tracked over the last 5 months across major hubs.' : 'पिछले 5 महीनों में प्रमुख केंद्रों पर ट्रैक किए गए औसत बाजार भाव।'}
              </p>
              
              {/* SVG Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '200px', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: '25%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)', borderStyle: 'dashed' }}></div>
                  <div style={{ position: 'absolute', bottom: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)', borderStyle: 'dashed' }}></div>
                  <div style={{ position: 'absolute', bottom: '75%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)', borderStyle: 'dashed' }}></div>
                  
                  {/* Bar 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', gap: '0.5rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-dark)' }}>₹2,050</span>
                    <div style={{ width: '100%', height: '110px', background: 'var(--primary-light)', opacity: '0.7', borderRadius: '6px 6px 0 0' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Mar</span>
                  </div>
                  
                  {/* Bar 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', gap: '0.5rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-dark)' }}>₹2,120</span>
                    <div style={{ width: '100%', height: '125px', background: 'var(--primary-light)', opacity: '0.8', borderRadius: '6px 6px 0 0' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Apr</span>
                  </div>

                  {/* Bar 3 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', gap: '0.5rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-dark)' }}>₹2,180</span>
                    <div style={{ width: '100%', height: '135px', background: 'var(--primary-light)', opacity: '0.9', borderRadius: '6px 6px 0 0' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>May</span>
                  </div>

                  {/* Bar 4 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', gap: '0.5rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-dark)' }}>₹2,210</span>
                    <div style={{ width: '100%', height: '145px', background: 'var(--primary-gradient)', borderRadius: '6px 6px 0 0' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Jun</span>
                  </div>

                  {/* Bar 5 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', gap: '0.5rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-dark)' }}>₹2,225</span>
                    <div style={{ width: '100%', height: '150px', background: 'var(--primary-gradient)', borderRadius: '6px 6px 0 0', boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-dark)' }}>Jul (Now)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
