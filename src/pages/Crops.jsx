import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

const Crops = () => {
  const [crops, setCrops] = useState([]);
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
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="section-title">Crop Advisory Guide</h2>
          <p className="section-subtitle">Scientific cultivation protocols, seasonal detail trackers, and soil recommendations.</p>
        </div>

        <div className="features-grid">
          {crops.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading crop databases from backend API...
            </p>
          ) : (
            crops.map((crop) => (
              <div key={crop.id} className="feature-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={crop.image_url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'} 
                    alt={crop.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-dark)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {crop.season}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: '1', textAlign: 'left' }}>
                  <h3 className="feature-title" style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', margin: '0 0 1rem' }}>{crop.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: '1' }}>
                    <div><strong>🌱 Soil:</strong> {crop.soil_type}</div>
                    <div><strong>💧 Water:</strong> {crop.water_needs}</div>
                    <div><strong>🧪 Nutrients:</strong> {crop.fertilizer_tips}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Crops;
