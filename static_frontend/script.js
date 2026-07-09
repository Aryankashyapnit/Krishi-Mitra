const API_BASE = 'http://localhost:3000/api';

// On Document Load
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  
  // Check which page we are on
  const path = window.location.pathname;
  if (path.includes('crops.html')) {
    loadCrops();
  } else if (path.includes('marketplace.html')) {
    loadMarketplace();
  } else if (path.includes('weather.html')) {
    setupWeather();
  } else if (path.includes('loans.html')) {
    loadSchemes();
  } else if (path.includes('disease.html')) {
    setupDiseaseScanner();
  } else if (path.includes('login.html')) {
    setupLogin();
  }
});

// Configure Navbar dynamically based on Auth state
function setupNavbar() {
  const token = localStorage.getItem('km_token');
  const user = JSON.parse(localStorage.getItem('km_user') || 'null');
  const nav = document.querySelector('nav');
  
  if (!nav) return;

  // Find or create login action btn
  let actionBtn = document.getElementById('nav-action-btn');
  if (!actionBtn) {
    actionBtn = document.createElement('a');
    actionBtn.id = 'nav-action-btn';
    actionBtn.className = 'login-btn';
    nav.appendChild(actionBtn);
  }

  if (token && user) {
    actionBtn.innerText = `Logout (${user.name})`;
    actionBtn.href = '#';
    actionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('km_token');
      localStorage.removeItem('km_user');
      window.location.href = 'index.html';
    });

    // Add dashboard option if not already present
    if (!document.getElementById('nav-dashboard-link')) {
      const dbLink = document.createElement('a');
      dbLink.id = 'nav-dashboard-link';
      dbLink.href = 'marketplace.html'; // In static, marketplace serves listing publishes
      dbLink.innerText = 'Dashboard';
      dbLink.style.color = 'var(--primary-light)';
      nav.insertBefore(dbLink, actionBtn);
    }
  } else {
    actionBtn.innerText = 'Login';
    actionBtn.href = 'login.html';
  }
}

// 1. Crops Advisory Grid
async function loadCrops() {
  const container = document.getElementById('crops-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/crops`);
    const crops = await res.json();
    
    container.innerHTML = crops.map(crop => `
      <div class="item-card">
        <div class="item-img-container">
          <img src="${crop.image_url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'}" alt="${crop.name}">
        </div>
        <div class="item-body">
          <span class="item-badge">${crop.season}</span>
          <h3>${crop.name}</h3>
          <div class="item-details">
            <p><strong>🌱 Soil:</strong> ${crop.soil_type}</p>
            <p><strong>💧 Water:</strong> ${crop.water_needs}</p>
            <p><strong>🧪 Fertilizer:</strong> ${crop.fertilizer_tips}</p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching crops:', err);
    container.innerHTML = '<p>Could not connect to backend server. Run "npm run dev" in backend/ first.</p>';
  }
}

// 2. Marketplace listings
async function loadMarketplace() {
  const container = document.getElementById('listings-container');
  const form = document.getElementById('add-listing-form');
  if (!container) return;

  // Load listings
  try {
    const res = await fetch(`${API_BASE}/listings`);
    const listings = await res.json();
    
    container.innerHTML = listings.map(list => `
      <div class="item-card" style="border-left: 4px solid var(--primary-light)">
        <div class="item-body">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <h3 style="margin:0">${list.crop_name}</h3>
            <span class="item-badge" style="margin:0">${list.quantity}</span>
          </div>
          <div style="margin: 1rem 0; font-size: 1.3rem; font-weight:700; color:var(--primary-dark)">
            Rs. ${list.price} <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted)">/ kg</span>
          </div>
          <div class="item-details" style="font-size:0.85rem; color:var(--text-muted)">
            <p style="margin:0">📍 Mandi: ${list.location}</p>
            <p style="margin:0.25rem 0 0">👤 Seller: ${list.seller_name}</p>
            <p style="margin:0.25rem 0 0">📞 Phone: ${list.seller_phone}</p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching listings:', err);
    container.innerHTML = '<p>Failed to load marketplace listings.</p>';
  }

  // Handle Add Listing submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('km_token');
      if (!token) {
        alert('Please login first to post produce!');
        window.location.href = 'login.html';
        return;
      }

      const payload = {
        crop_name: document.getElementById('crop_name').value,
        quantity: document.getElementById('quantity').value,
        price: document.getElementById('price').value,
        location: document.getElementById('location').value
      };

      try {
        const res = await fetch(`${API_BASE}/listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('Produce published successfully!');
          form.reset();
          loadMarketplace();
        } else {
          const errData = await res.json();
          alert(`Error: ${errData.error}`);
        }
      } catch (err) {
        alert('Failed to publish crop offer.');
      }
    });
  }
}

// 3. Weather forecast advisor
function setupWeather() {
  const form = document.getElementById('weather-form');
  const resultDiv = document.getElementById('weather-result');
  if (!form || !resultDiv) return;

  // Default query Indore on load
  queryWeather('Indore');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) queryWeather(city);
  });

  async function queryWeather(city) {
    try {
      const res = await fetch(`${API_BASE}/weather?city=${city}`);
      const data = await res.json();
      
      resultDiv.innerHTML = `
        <div class="item-card" style="max-width: 500px; margin: 2rem auto; padding: 2rem; background: var(--primary-gradient); color:white; border:none">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <h3 style="margin:0; font-size:1.8rem; color:white">${data.name}, ${data.sys?.country || 'IN'}</h3>
            <span style="font-size:3rem">${data.weather?.[0]?.main === 'Clear' ? '☀️' : '☁️'}</span>
          </div>
          <p style="text-transform: capitalize; margin: 0.25rem 0 1.5rem; opacity: 0.9">${data.weather?.[0]?.description}</p>
          
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top:1rem; margin-bottom: 1rem">
            <div>
              <span style="font-size:0.8rem; opacity:0.8">Temp</span>
              <p style="font-size:1.3rem; font-weight:700; margin:0.25rem 0 0">${Math.round(data.main?.temp)}°C</p>
            </div>
            <div>
              <span style="font-size:0.8rem; opacity:0.8">Humidity</span>
              <p style="font-size:1.3rem; font-weight:700; margin:0.25rem 0 0">${data.main?.humidity}%</p>
            </div>
            <div>
              <span style="font-size:0.8rem; opacity:0.8">Wind</span>
              <p style="font-size:1.3rem; font-weight:700; margin:0.25rem 0 0">${data.wind?.speed} m/s</p>
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.15); padding:1rem; border-radius:8px; font-size:0.9rem">
            <strong>🌾 Sowing Tip:</strong> ${data.advice || 'Ideal weather. Keep soil hydrated.'}
          </div>
        </div>
      `;
    } catch (err) {
      resultDiv.innerHTML = '<p>Failed to load weather report details.</p>';
    }
  }
}

// 4. Government Schemes
async function loadSchemes() {
  const container = document.getElementById('schemes-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/schemes`);
    const schemes = await res.json();
    
    container.innerHTML = schemes.map(scheme => `
      <div class="feature-card" style="text-align:left; border-top: 4px solid var(--primary-dark)">
        <span class="item-badge" style="text-transform:uppercase">${scheme.category}</span>
        <h3>${scheme.title}</h3>
        <p>${scheme.description}</p>
        <p style="background:#F8FAFC; padding:0.5rem; border-radius:6px; font-size:0.85rem">
          <strong>🎓 Eligibility:</strong> ${scheme.eligibility}
        </p>
        <a href="${scheme.link}" target="_blank" class="login-btn" style="display:block; text-align:center; padding:0.4rem; font-size:0.85rem; margin-top:1rem">
          🔗 Visit Portal
        </a>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p>Failed to load subsidy schemes.</p>';
  }
}

// 5. Leaf Scanner & AI Image upload
function setupDiseaseScanner() {
  const form = document.getElementById('scanner-form');
  const resultDiv = document.getElementById('scan-result');
  if (!form || !resultDiv) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('leaf-image');
    if (fileInput.files.length === 0) return;

    resultDiv.innerHTML = '<p>⏳ Uploading leaf photo and analyzing with AI engine...</p>';

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
      const res = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        resultDiv.innerHTML = `
          <div class="item-card" style="max-width: 500px; margin: 2rem auto; border: 1px solid var(--border-color)">
            <div style="height:200px; overflow:hidden">
              <img src="http://localhost:3000${data.imageUrl}" style="width:100%; height:100%; object-fit:cover" alt="Scan upload">
            </div>
            <div class="item-body">
              <h3 style="color:#C0392B">${data.predictedDisease}</h3>
              <p><strong>Crop Sowing:</strong> ${data.cropName}</p>
              <p><strong>AI Confidence:</strong> ${data.confidence}%</p>
              <div style="background:rgba(76, 175, 80, 0.08); border-left: 4px solid var(--primary-dark); padding:1rem; border-radius:0 8px 8px 0; margin-top:1rem">
                <strong style="color:var(--primary-dark)">🌿 Remedial Actions:</strong>
                <p style="margin:0.25rem 0 0; font-size:0.9rem">${data.cure}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        resultDiv.innerHTML = '<p>❌ Failed to analyze image format. Please use PNG or JPG.</p>';
      }
    } catch (err) {
      resultDiv.innerHTML = '<p>❌ Server offline. Unable to complete diagnosis.</p>';
    }
  });
}

// 6. User Authentication Card (login.html)
function setupLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('km_token', data.token);
        localStorage.setItem('km_user', JSON.stringify(data.user));
        alert('Welcome back, login successful!');
        window.location.href = 'index.html';
      } else {
        const errData = await res.json();
        alert(`Login failed: ${errData.error}`);
      }
    } catch (err) {
      alert('Failed to connect to authentication server.');
    }
  });
}
