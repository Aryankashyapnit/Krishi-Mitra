import React, { useState, useEffect } from 'react';
import '../App.css';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCropDetails, setSelectedCropDetails] = useState(null);
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(`${API_BASE}/crops`);
        if (res.ok) {
          const data = await res.json();
          setCrops(data);
        }
      } catch (err) {
        console.error("Failed to fetch crops database in page Crops.jsx:", err);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%' }}>
      {/* Background Decorative Blur Blobs for Premium Aesthetic */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '300px', height: '300px', background: 'rgba(76, 175, 80, 0.08)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', width: '400px', height: '400px', background: 'rgba(212, 175, 55, 0.06)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box', zIndex: 1 }}>
        <div className="section-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span className="hero-badge" style={{ background: 'rgba(76, 175, 80, 0.12)', color: 'var(--primary-dark)', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
            🌾 CROP HANDBOOK
          </span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Scientific Cultivation Protocols</h2>
          <p className="section-subtitle">Click on any crop card below to view detailed soil prep, water regimes, and organic fertilizer schedules.</p>
        </div>

        <div className="features-grid">
          {crops.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading crop databases from backend API...
            </p>
          ) : (
            crops.map((crop) => (
              <div 
                key={crop.id} 
                className="feature-card" 
                onClick={() => setSelectedCropDetails(crop)}
                style={{ 
                  padding: '0', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={crop.image_url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'} 
                    alt={crop.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    className="crop-card-img"
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary-gradient)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                    {crop.season.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: '1', textAlign: 'left' }}>
                  <h3 className="feature-title" style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', margin: '0 0 1.25rem', fontWeight: '800' }}>{crop.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: '1', color: 'var(--text-dark)' }}>
                    <div><strong>🌱 Soil:</strong> {crop.soil_type}</div>
                    <div><strong>💧 Water:</strong> {crop.water_needs.substring(0, 45)}...</div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                    View Protocols →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Scientific Detail Modal Overlay */}
      {selectedCropDetails && (
        <div className="modal-overlay" onClick={() => setSelectedCropDetails(null)} style={{ zIndex: 1000 }}>
          <div 
            className="modal-card" 
            style={{ 
              position: 'relative', 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '24px', 
              border: '1px solid rgba(255, 255, 255, 0.7)',
              maxWidth: '550px',
              padding: '2.25rem'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCropDetails(null)} 
              style={{ 
                position: 'absolute', 
                top: '15px', 
                right: '15px', 
                background: 'rgba(0,0,0,0.06)', 
                border: 'none', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.1rem', 
                fontWeight: '700',
                color: 'var(--primary-dark)'
              }}
            >
              ✕
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ height: '220px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                <img 
                  src={selectedCropDetails.image_url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'} 
                  alt={selectedCropDetails.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              
              <div>
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--primary-dark)', fontSize: '1.75rem', fontWeight: '800' }}>{selectedCropDetails.name}</h3>
                <span style={{ background: 'rgba(76, 175, 80, 0.12)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid rgba(76, 175, 80, 0.15)' }}>
                  {selectedCropDetails.season.toUpperCase()} SEASON
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.25rem' }}>
                <div>
                  <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>🌱 Soil Type / मिट्टी</strong>
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-dark)' }}>{selectedCropDetails.soil_type}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>💧 Water Demand / सिंचाई</strong>
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-dark)' }}>{selectedCropDetails.water_needs}</span>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>🧪 Scientific Fertilizers & Organic tips / वैज्ञानिक खाद</strong>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', margin: 0, lineHeight: '1.55' }}>{selectedCropDetails.fertilizer_tips}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crops;
