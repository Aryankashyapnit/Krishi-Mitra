import React, { useState, useEffect } from 'react';

const Weather = ({ lang, t }) => {
  const [weatherCity, setWeatherCity] = useState('New Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(`${API_BASE}/weather?city=${city}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      } else {
        throw new Error('Not found');
      }
    } catch (err) {
      // Simulation fallback
      setWeatherData({
        name: city,
        sys: { country: 'IN' },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        main: { temp: 32, humidity: 65 },
        wind: { speed: 3.4 },
        advice: lang === 'en' 
          ? 'Great weather conditions. Ideal time for sowing, ensure adequate organic base fertilizers.' 
          : 'मौसम बुवाई के अनुकूल है। पर्याप्त जैविक खाद सुनिश्चित करें।'
      });
    }
  };

  useEffect(() => {
    fetchWeather(weatherCity);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '300px', height: '300px', background: 'rgba(2, 132, 199, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', width: '350px', height: '350px', background: 'rgba(76, 175, 80, 0.06)', filter: 'blur(110px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
        <div className="section-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span className="hero-badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-blue)', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
            🌤️ METEOROLOGY
          </span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{t.weatherTitle}</h2>
          <p className="section-subtitle">{t.weatherSub}</p>
        </div>

        <div className="simulator-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div className="simulator-info" style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-dark)', fontSize: '1.1rem' }}>
              {lang === 'en' ? 'Search Your Region' : 'अपने क्षेत्र का मौसम खोजें'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder={t.searchCity} 
                value={weatherCity} 
                onChange={(e) => setWeatherCity(e.target.value)}
                style={{ flexGrow: 1, padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--sans)', fontSize: '0.95rem' }}
              />
              <button onClick={() => fetchWeather(weatherCity)} className="btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '12px' }}>
                {t.checkWeather}
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {lang === 'en' 
                ? 'Get humidity level, temperature parameters and tailored crop advises.' 
                : 'नमी का स्तर, तापमान मापदंड और अनुकूलित फसल सलाह प्राप्त करें।'}
            </p>
          </div>

          <div className="interactive-panel" style={{ minHeight: '260px', background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-md)', textAlign: 'left' }}>
            {weatherData ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>{weatherData.name}, {weatherData.sys?.country}</span>
                  <span style={{ fontSize: '3rem' }}>
                    {weatherData.weather?.[0]?.main === 'Clear' ? '☀️' : '☁️'}
                  </span>
                </div>
                <p style={{ margin: '0.25rem 0 1.75rem', textTransform: 'capitalize', opacity: '0.9', fontSize: '0.98rem' }}>
                  {weatherData.weather?.[0]?.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>{t.temp}</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0.25rem 0 0' }}>{Math.round(weatherData.main?.temp)}°C</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>{t.humidity}</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0.25rem 0 0' }}>{weatherData.main?.humidity}%</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>{t.wind}</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0.25rem 0 0' }}>{weatherData.wind?.speed} m/s</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '12px', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  <strong>🌾 {t.advice}:</strong> {weatherData.advice || (weatherData.main?.temp > 28 ? 'Ideal for sowing summer seeds. Ensure soil remains wet.' : 'Mild conditions. Good time for organic fertilizing.')}
                </div>
              </div>
            ) : (
              <div className="placeholder-view" style={{ color: 'white', textAlign: 'center' }}>
                <p>Loading weather conditions...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Weather;
