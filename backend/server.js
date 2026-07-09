const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { query, dbType } = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'krishi-mitra-secret-key-12345';

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '../static_frontend')));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Admin Guard Middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied, admin role required' });
  }
};

// --- AUTHENTICATION ROUTES ---

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await query(
      'INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'farmer', phone || '', location || '']
    );

    // Generate token
    const token = jwt.sign({ id: result.insertId, email, role: role || 'farmer' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name, email, role: role || 'farmer' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Logged-in User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, phone, location, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- CROPS ADVISORY ROUTES ---

// Get All Crops
app.get('/api/crops', async (req, res) => {
  try {
    const crops = await query('SELECT * FROM crops ORDER BY name ASC');
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Crop by ID
app.get('/api/crops/:id', async (req, res) => {
  try {
    const crops = await query('SELECT * FROM crops WHERE id = ?', [req.params.id]);
    if (!crops || crops.length === 0) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.json(crops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Route: Add New Crop
app.post('/api/crops', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, season, soil_type, water_needs, fertilizer_tips, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Crop name is required' });
    }

    const result = await query(
      'INSERT INTO crops (name, season, soil_type, water_needs, fertilizer_tips, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, season || '', soil_type || '', water_needs || '', fertilizer_tips || '', image_url || '']
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Crop added successfully!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- SCHEMES & SUBSIDIES ROUTES ---

// Get All Schemes
app.get('/api/schemes', async (req, res) => {
  try {
    const category = req.query.category;
    let sql = 'SELECT * FROM schemes';
    let params = [];

    if (category) {
      sql += ' WHERE category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY id DESC';
    const schemes = await query(sql, params);
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Route: Add New Scheme
app.post('/api/schemes', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, eligibility, link, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const result = await query(
      'INSERT INTO schemes (title, description, eligibility, link, category) VALUES (?, ?, ?, ?, ?)',
      [title, description, eligibility || '', link || '', category || 'loan']
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Scheme added successfully!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- MARKETPLACE LISTINGS ROUTES ---

// Get All Available Listings
app.get('/api/listings', async (req, res) => {
  try {
    const sql = `
      SELECT l.*, u.name as seller_name, u.phone as seller_phone
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      WHERE l.status = 'available'
      ORDER BY l.id DESC
    `;
    const listings = await query(sql);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User's Own Listings
app.get('/api/listings/my', authenticateToken, async (req, res) => {
  try {
    const listings = await query(
      'SELECT * FROM listings WHERE seller_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add New Marketplace Listing
app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const { crop_name, quantity, price, location } = req.body;

    if (!crop_name || !quantity || !price) {
      return res.status(400).json({ error: 'Crop name, quantity, and price are required' });
    }

    const seller_id = req.user.id;
    
    const result = await query(
      'INSERT INTO listings (crop_name, quantity, price, seller_id, location, status) VALUES (?, ?, ?, ?, ?, ?)',
      [crop_name, quantity, parseFloat(price), seller_id, location || '', 'available']
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Marketplace listing created successfully!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark Listing as Sold
app.patch('/api/listings/:id/sell', authenticateToken, async (req, res) => {
  try {
    const listingId = req.params.id;
    const sellerId = req.user.id;

    // Check if listing belongs to this seller
    const listings = await query('SELECT * FROM listings WHERE id = ?', [listingId]);
    if (!listings || listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listings[0].seller_id !== sellerId) {
      return res.status(403).json({ error: 'You are not authorized to modify this listing' });
    }

    await query("UPDATE listings SET status = 'sold' WHERE id = ?", [listingId]);
    res.json({ message: 'Listing marked as sold successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- WEATHER ROUTE WITH MOCK FALLBACK ---

app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Indore';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    }

    // Realistic Mock Weather response
    const mockWeather = {
      name: city.charAt(0).toUpperCase() + city.slice(1),
      main: {
        temp: 28.5 + (Math.random() * 4 - 2),
        humidity: 65 + Math.floor(Math.random() * 10 - 5),
        pressure: 1012
      },
      weather: [
        {
          main: Math.random() > 0.4 ? 'Clear' : 'Clouds',
          description: Math.random() > 0.4 ? 'clear sky' : 'scattered clouds',
          icon: '01d'
        }
      ],
      wind: {
        speed: 3.6
      },
      sys: {
        country: 'IN'
      },
      advice: 'Perfect temperature for sowing Kharif crops. Maintain soil hydration.'
    };

    res.json(mockWeather);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve weather details' });
  }
});


// --- IMAGE UPLOAD & MOCK DISEASE ANALYSIS ---

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, webp) are allowed'));
  }
});

// GET user's disease reports
app.get('/api/disease-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await query(
      'SELECT * FROM disease_reports WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Mock AI analysis
    const originalName = req.file.originalname.toLowerCase();
    let cropName = 'Unknown Crop';
    let predictedDisease = 'Healthy Leaf';
    let confidence = 98.5;
    let cure = 'No treatment needed. Maintain normal irrigation.';

    if (originalName.includes('wheat') || originalName.includes('gehu')) {
      cropName = 'Wheat (गेंहू)';
      predictedDisease = 'Leaf Rust (पत्ती गेरूआ)';
      confidence = 94.2;
      cure = 'Spray neem oil solution (10ml/liter of water) or copper fungicide. Avoid over-irrigation.';
    } else if (originalName.includes('tomato') || originalName.includes('tamatar')) {
      cropName = 'Tomato (टमाटर)';
      predictedDisease = 'Early Blight (अगेती झुलसा)';
      confidence = 91.8;
      cure = 'Prune lower infected leaves. Apply Trichoderma-based bio-fungicide. Avoid sprinkler watering.';
    } else if (originalName.includes('rice') || originalName.includes('dhan')) {
      cropName = 'Rice (धान)';
      predictedDisease = 'Bacterial Leaf Blight (जीवाणु झुलसा)';
      confidence = 89.5;
      cure = 'Drain excess standing water. Apply potash fertilizer. Spray copper hydroxide formulation.';
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Optionally save report to database if authorization token exists
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
        
        await query(
          'INSERT INTO disease_reports (user_id, image_url, predicted_disease, confidence) VALUES (?, ?, ?, ?)',
          [userId, imageUrl, predictedDisease, confidence]
        );
      } catch (tokenErr) {
        // Continue without saving user if token is invalid
      }
    }

    res.json({
      message: 'Analysis completed successfully',
      imageUrl,
      cropName,
      predictedDisease,
      confidence,
      cure
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DYNAMIC CHATBOT & MANDI BOARD RATES ---

app.get('/api/mandi-board', (req, res) => {
  const { state, crop } = req.query;
  
  const mandiRates = [
    { id: 1, crop: "Wheat (गेंहू)", state: "MP", mandi: "Indore Mandi", minPrice: 2100, maxPrice: 2350, avgPrice: 2225 },
    { id: 2, crop: "Wheat (गेंहू)", state: "UP", mandi: "Hapur Mandi", minPrice: 2150, maxPrice: 2400, avgPrice: 2275 },
    { id: 3, crop: "Wheat (गेंहू)", state: "PB", mandi: "Khanna Mandi", minPrice: 2200, maxPrice: 2450, avgPrice: 2325 },
    { id: 4, crop: "Paddy (Rice/धान)", state: "PB", mandi: "Amritsar Mandi", minPrice: 1950, maxPrice: 2200, avgPrice: 2075 },
    { id: 5, crop: "Paddy (Rice/धान)", state: "MP", mandi: "Jabalpur Mandi", minPrice: 1850, maxPrice: 2100, avgPrice: 1975 },
    { id: 6, crop: "Onion (प्याज़)", state: "MH", mandi: "Lasalgaon Mandi", minPrice: 1500, maxPrice: 2200, avgPrice: 1850 },
    { id: 7, crop: "Onion (प्याज़)", state: "MP", mandi: "Neemuch Mandi", minPrice: 1300, maxPrice: 1900, avgPrice: 1600 },
    { id: 8, crop: "Potato (आलू)", state: "UP", mandi: "Agra Mandi", minPrice: 950, maxPrice: 1350, avgPrice: 1150 },
    { id: 9, crop: "Potato (आलू)", state: "MH", mandi: "Pune Mandi", minPrice: 1100, maxPrice: 1500, avgPrice: 1300 },
    { id: 10, crop: "Mustard (सरसों)", state: "PB", mandi: "Bhatinda Mandi", minPrice: 5200, maxPrice: 5800, avgPrice: 5500 },
    { id: 11, crop: "Mustard (सरसों)", state: "MP", mandi: "Morena Mandi", minPrice: 5000, maxPrice: 5600, avgPrice: 5300 },
    { id: 12, crop: "Tomato (टमाटर)", state: "MH", mandi: "Nashik Mandi", minPrice: 1200, maxPrice: 1800, avgPrice: 1500 }
  ];

  let filtered = mandiRates;
  if (state && state !== 'All') {
    filtered = filtered.filter(item => item.state.toLowerCase() === state.toLowerCase());
  }
  if (crop) {
    filtered = filtered.filter(item => item.crop.toLowerCase().includes(crop.toLowerCase()));
  }

  res.json(filtered);
});

app.post('/api/chatbot', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const queryMsg = message.toLowerCase();
  let reply = "";

  if (queryMsg.includes('hello') || queryMsg.includes('hi ') || queryMsg.includes('hey')) {
    reply = "Hello! I am your Krishi Assistant. How can I help you today with crops, weather, mandi prices, or loans?";
  } else if (queryMsg.includes('wheat') || queryMsg.includes('rust')) {
    reply = "Wheat crops are prone to Leaf Rust disease (brown spots on leaves). Remedy: Spray neem oil formulation (10ml/L of water) or copper fungicide. Avoid over-irrigation during tillering.";
  } else if (queryMsg.includes('tomato') || queryMsg.includes('blight')) {
    reply = "Tomato Early Blight causes concentric dark spots on lower leaves. Remedy: Prune infected lower leaves, avoid overhead irrigation, and spray Trichoderma bio-fungicide.";
  } else if (queryMsg.includes('rice') || queryMsg.includes('blight') || queryMsg.includes('paddy')) {
    reply = "Rice Bacterial Leaf Blight causes yellowing and drying of leaves. Remedy: Drain excess water, apply potash fertilizer in split doses, and avoid excess nitrogen.";
  } else if (queryMsg.includes('loan') || queryMsg.includes('kcc') || queryMsg.includes('subsidy')) {
    reply = "You can access subsidized credits via the Kisan Credit Card (KCC) scheme starting at 4% interest, or PM Kisan subsidy (Rs 6,000/year). Check our 'Subsidies' tab for direct links.";
  } else if (queryMsg.includes('weather') || queryMsg.includes('rain')) {
    reply = "You can check dynamic weather advisories in the 'Weather Advisor' tab. Sowing is recommended when soil moisture is balanced.";
  } else if (queryMsg.includes('mandi') || queryMsg.includes('price') || queryMsg.includes('rate')) {
    reply = "Use our Marketplace 'Mandi Rates' panel to check the latest prices for crops across major Indian states.";
  }
  // Hindi
  else if (queryMsg.includes('नमस्ते') || queryMsg.includes('प्रणाम') || queryMsg.includes('राम राम')) {
    reply = "नमस्ते! मैं आपका कृषि सहायक हूँ। आज मैं फसलों, मौसम, मंडी भाव या कृषि ऋण योजनाओं में आपकी क्या सहायता कर सकता हूँ?";
  } else if (queryMsg.includes('गेंहू') || queryMsg.includes('गेरूआ')) {
    reply = "गेंहू में पत्ती गेरूआ (Rust) रोग की संभावना होती है। समाधान: नीम के तेल के घोल (10 मिली प्रति लीटर) का छिड़काव करें। खेतों में जल निकासी अच्छी रखें और बुवाई समय पर करें।";
  } else if (queryMsg.includes('टमाटर') || queryMsg.includes('झुलसा')) {
    reply = "टमाटर में अगेती झुलसा (Early Blight) रोग पत्तियों को सुखा देता है। समाधान: संक्रमित पत्तियों को हटाएं, तने के पास पानी दें, और ट्राइकोडर्मा जैविक कवकनाशी का प्रयोग करें।";
  } else if (queryMsg.includes('धान') || queryMsg.includes('चावल')) {
    reply = "धान में जीवाणु झुलसा (Bacterial Blight) रोग होने पर खेतों से अतिरिक्त पानी निकाल दें, यूरिया का अधिक उपयोग न करें और पोटाश की संतुलित मात्रा डालें।";
  } else if (queryMsg.includes('लोन') || queryMsg.includes('कर्ज') || queryMsg.includes('योजना')) {
    reply = "किसान क्रेडिट कार्ड (KCC) के तहत 4% ब्याज पर ऋण मिल सकता है। इसके अलावा पीएम किसान सम्मान निधि से प्रतिवर्ष ₹6,000 की वित्तीय मदद मिलती है। 'योजनाएं' टैब देखें।";
  } else if (queryMsg.includes('मौसम') || queryMsg.includes('बारिश')) {
    reply = "आप हमारे 'मौसम सलाहकार' टैब में जाकर अपने शहर का मौसम चेक कर सकते हैं और उसके अनुसार बुवाई की तैयारी कर सकते हैं।";
  } else if (queryMsg.includes('भाव') || queryMsg.includes('रेट') || queryMsg.includes('मंडी')) {
    reply = "मंडी बाजार में 'सरकारी मंडी भाव' पैनल का उपयोग करके आप मध्यप्रदेश, महाराष्ट्र, पंजाब और उत्तर प्रदेश की मंडियों के ताजा भाव देख सकते हैं।";
  } else {
    reply = "I'm sorry, I didn't fully catch that. Could you please specify if you're asking about Wheat, Rice, Tomato, Mandi Prices, Weather, or Government Schemes? / क्षमा करें, मैं समझ नहीं पाया। क्या आप गेंहू, टमाटर, धान, मंडी भाव, मौसम या लोन योजनाओं के बारे में पूछ रहे हैं?";
  }

  res.json({ reply });
});

// Run server
app.listen(port, () => {
  console.log(`[Krishi Mitra] Express Server running on port ${port}`);
});
