import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Crops from './pages/Crops';
import './App.css';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

const defaultCrops = [
  { id: 1, name: "Wheat (गेंहू)", season: "Rabi", soil_type: "Clayey / Loamy", water_needs: "Moderate watering (4-6 times)", fertilizer_tips: "Apply NPK (4:2:1). Top-dress with urea.", image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" },
  { id: 2, name: "Rice (धान)", season: "Kharif", soil_type: "Clayey with water retention", water_needs: "High water. Keep 5-10cm standing water.", fertilizer_tips: "Split nitrogen applications. Add zinc sulphate.", image_url: "https://images.unsplash.com/photo-1536257130722-ea1c9ad9d447?w=400" },
  { id: 3, name: "Tomato (टमाटर)", season: "Year-round", soil_type: "Sandy Loam", water_needs: "Regular moderate base watering.", fertilizer_tips: "Use organic compost. Apply potash at flowering.", image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400" }
];

const defaultSchemes = [
  { id: 1, title: "PM Kisan Samman Nidhi Yojana", description: "All landholding farmers families are provided income support of Rs. 6000 per year in three installments.", eligibility: "All small and marginal landholding farmer families.", link: "https://pmkisan.gov.in/", category: "subsidy" },
  { id: 2, title: "Kisan Credit Card (KCC) Scheme", description: "Subsidized agricultural loans starting at 4% interest rates to meet short-term credit requirements.", eligibility: "All farmers and owner-cultivators.", link: "https://www.sbi.co.in/web/personal-banking/loans/agriculture-banking/kisan-credit-card", category: "loan" }
];

const localizations = {
  en: {
    navHome: "Home",
    navFeatures: "Features",
    navSimulator: "Leaf Scanner",
    navMandi: "Marketplace",
    navCrops: "Crops Guide",
    navSchemes: "Schemes",
    navDashboard: "My Dashboard",
    navAdmin: "Admin Panel",
    login: "Login",
    register: "Register",
    logout: "Logout",
    tagline: "Empowering Farmers, Digitally.",
    subtitle: "A smart digital companion for every farmer. Real-time weather advisories, live market rates, crop health diagnosis, and government schemes, all in one place.",
    getStarted: "Get Started",
    learnMore: "Try Scanner",
    featuresTitle: "Smart Features",
    featuresSub: "Tailored digital solutions helping you farm smarter, mitigate risks, and increase yields.",
    
    // Crops Guide
    cropsTitle: "Crop Advisory Guide",
    cropsSub: "Scientific cultivation techniques, seasonal details, and irrigation advisories.",
    season: "Season",
    soil: "Soil Type",
    water: "Water Requirements",
    fertilizer: "Fertilizer Advice",
    viewDetails: "View Details",

    // Crop Details Modal
    cropDetailsTitle: "Crop Management Protocol",
    sowingSeason: "Sowing Season",
    soilPreparation: "Soil Preparation",
    irrigationSchedule: "Irrigation Schedule",
    nutrientManagement: "Nutrient & Fertilizer Management",

    // Marketplace
    mandiTitle: "Mandi Marketplace",
    mandiSub: "Live listings uploaded by local farmers. Connect directly with sellers.",
    addListing: "Sell Your Produce",
    cropName: "Crop Name",
    quantity: "Quantity (e.g. 500 kg)",
    price: "Price per kg (Rs.)",
    location: "Location / Mandi",
    submitListing: "Publish Listing",
    buyerPhone: "Phone",
    seller: "Seller",

    // Weather Section
    weatherTitle: "Live Weather Advisor",
    weatherSub: "Check hyperlocal weather guidelines for crop planning.",
    searchCity: "Enter City Name",
    checkWeather: "Get Forecast",
    temp: "Temperature",
    humidity: "Humidity",
    wind: "Wind Speed",
    advice: "Advisor Tip",

    // Simulator
    simulatorTitle: "AI leaf scanner",
    simulatorDesc: "Upload an image of a crop leaf or select a default crop model to test our AI diagnostic engine.",
    simSelectCrop: "Select a crop model to simulate:",
    simCuring: "Organic Cure & Remedial Steps:",
    simConfidence: "AI Confidence Score",
    simPlaceholder: "Upload a crop leaf photo or select a model crop to scan.",
    simScanning: "Analyzing leaf image with AI...",
    uploadFile: "Upload Leaf Photo",

    // Auth
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    phone: "Phone Number",
    role: "I am a...",
    farmer: "Farmer",
    buyer: "Buyer / Trader",
    hasAccount: "Already have an account? Login",
    noAccount: "Don't have an account? Register",

    // Dashboard
    dashboardTitle: "User Dashboard",
    dashboardSub: "Manage your profile, listings, and view past disease diagnosis history.",
    myProfile: "My Profile",
    myListings: "My Active Listings",
    scanHistory: "Disease Diagnostic History",
    markSold: "Mark as Sold",
    noListings: "You have no active listings on the marketplace.",
    noHistory: "No diagnostic history found.",

    // Admin Panel
    adminTitle: "Administrative Control Panel",
    adminSub: "Insert new crop advisory protocols and active government loan schemes.",
    addCrop: "Add New Crop Guide",
    addScheme: "Add Loan / Subsidy Scheme",
    cropImage: "Image URL",
    schemeLink: "Official Scheme Link",
    category: "Category",
    loan: "Loan Scheme",
    subsidy: "Subsidy Scheme",
    training: "Training Scheme",

    footerDesc: "Bridging traditional agricultural wisdom with modern artificial intelligence. Krishi Mitra is built with a deep commitment to sustainable farming.",
    copyright: "© 2026 Krishi Mitra. Your Farming Partner."
  },
  hi: {
    navHome: "मुख्य पृष्ठ",
    navFeatures: "विशेषताएं",
    navSimulator: "लीफ स्कैनर",
    navMandi: "मंडी बाज़ार",
    navCrops: "फसल जानकारी",
    navSchemes: "योजनाएं",
    navDashboard: "मेरा डैशबोर्ड",
    navAdmin: "एडमिन पैनल",
    login: "लॉगिन करें",
    register: "पंजीकरण",
    logout: "लॉगआउट",
    tagline: "कृषकों का संबल, डिजिटल हल।",
    subtitle: "हर किसान का सच्चा डिजिटल साथी। सटीक मौसम पूर्वानुमान, लाइव मंडी भाव, फसल स्वास्थ्य जांच और सरकारी योजनाएं - सब एक साथ एक जगह पर।",
    getStarted: "शुरू करें",
    learnMore: "स्कैनर आज़माएं",
    featuresTitle: "स्मार्ट सुविधाएं",
    featuresSub: "फसलों की पैदावार बढ़ाने और जोखिमों को कम करने में आपकी मदद के लिए अनुकूलित डिजिटल समाधान।",

    // Crops Guide
    cropsTitle: "फसल वैज्ञानिक मार्गदर्शिका",
    cropsSub: "डेटाबेस से वैज्ञानिक खेती के तरीके, मौसमी विवरण और सिंचाई सलाह देखें।",
    season: "मौसम",
    soil: "मिट्टी का प्रकार",
    water: "पानी की आवश्यकता",
    fertilizer: "उर्वरक सलाह",
    viewDetails: "विवरण देखें",

    // Crop Details Modal
    cropDetailsTitle: "फसल प्रबंधन प्रोटोकॉल",
    sowingSeason: "बुवाई का मौसम",
    soilPreparation: "मिट्टी की तैयारी",
    irrigationSchedule: "सिंचाई कार्यक्रम",
    nutrientManagement: "पोषक तत्व और उर्वरक प्रबंधन",

    // Marketplace
    mandiTitle: "कृषि मंडी बाज़ार",
    mandiSub: "स्थानीय किसानों द्वारा अपलोड की गई लाइव फसल सूची। सीधे विक्रेताओं से संपर्क करें।",
    addListing: "अपनी फसल बेचें",
    cropName: "फसल का नाम",
    quantity: "मात्रा (जैसे: 500 किग्रा)",
    price: "मूल्य प्रति किग्रा (रु.)",
    location: "स्थान / मंडी",
    submitListing: "सूची प्रकाशित करें",
    buyerPhone: "फ़ोन नंबर",
    seller: "विक्रेता",

    // Weather Section
    weatherTitle: "मौसम सलाहकार",
    weatherSub: "फसल योजना के लिए मौसम की स्थिति और कृषि सलाह जानें।",
    searchCity: "शहर का नाम दर्ज करें",
    checkWeather: "पूर्वानुमान प्राप्त करें",
    temp: "तापमान",
    humidity: "आर्द्रता",
    wind: "हवा की गति",
    advice: "विशेषज्ञ सलाह",

    // Simulator
    simulatorTitle: "एआई फसल रोग स्कैनर",
    simulatorDesc: "हमारे एआई रोग निदान इंजन का परीक्षण करने के लिए फसल की पत्ती की तस्वीर अपलोड करें या मॉडल फसल चुनें।",
    simSelectCrop: "मॉडल फसल चुनकर टेस्ट करें:",
    simCuring: "जैविक उपचार और समाधान:",
    simConfidence: "एआई सटीकता (Confidence)",
    simPlaceholder: "रोग की जांच करने के लिए पत्ती की फोटो अपलोड करें या मॉडल चुनें।",
    simScanning: "एआई द्वारा रोग की जांच की जा रही है...",
    uploadFile: "पत्ती की फोटो अपलोड करें",

    // Auth
    fullName: "पूरा नाम",
    email: "ईमेल आईडी",
    password: "पासवर्ड",
    phone: "मोबाइल नंबर",
    role: "मेरा रोल है...",
    farmer: "किसान",
    buyer: "खरीदार / व्यापारी",
    hasAccount: "पहले से खाता है? लॉगिन करें",
    noAccount: "खाता नहीं है? पंजीकरण करें",

    // Dashboard
    dashboardTitle: "किसान डैशबोर्ड",
    dashboardSub: "अपनी प्रोफ़ाइल, मंडी सूचियां प्रबंधित करें और पुराना रोग निदान इतिहास देखें।",
    myProfile: "मेरी प्रोफ़ाइल",
    myListings: "मेरी सक्रिय सूचियां",
    scanHistory: "रोग निदान इतिहास (Scans)",
    markSold: "बेचा गया (Mark Sold)",
    noListings: "मंडी बाजार में आपकी कोई सक्रिय फसल सूची नहीं है।",
    noHistory: "कोई पुराना रोग स्कैन इतिहास नहीं मिला।",

    // Admin Panel
    adminTitle: "प्रशासनिक नियंत्रण कक्ष",
    adminSub: "नए फसल दिशानिर्देश और सक्रिय सरकारी लोन नीतियां दर्ज करें।",
    addCrop: "नया फसल विवरण जोड़ें",
    addScheme: "नई लोन / सब्सिडी योजना जोड़ें",
    cropImage: "छवि का यूआरएल link",
    schemeLink: "आधिकारिक योजना लिंक (URL)",
    category: "श्रेणी",
    loan: "ऋण योजना (Loan)",
    subsidy: "सब्सिडी योजना",
    training: "प्रशिक्षण कार्यक्रम",

    footerDesc: "पारंपरिक कृषि ज्ञान और आधुनिक कृत्रिम बुद्धिमत्ता (AI) का संगम। कृषि मित्र सतत और समृद्ध खेती के लिए पूरी तरह समर्पित है।",
    copyright: "© 2026 कृषि मित्र। आपका सच्चा साथी।"
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [crops, setCrops] = useState(defaultCrops);
  const [schemes, setSchemes] = useState(defaultSchemes);
  const [listings, setListings] = useState([]);
  
  // User Authentication states
  const [token, setToken] = useState(localStorage.getItem('km_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('km_user')) || null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  
  // Auth Form inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authRole, setAuthRole] = useState('farmer');
  const [authLoc, setAuthLoc] = useState('');

  // Dashboard states
  const [myListings, setMyListings] = useState([]);
  const [myReports, setMyReports] = useState([]);
  
  // Weather states
  const [weatherCity, setWeatherCity] = useState('Indore');
  const [weatherData, setWeatherData] = useState(null);
  
  // Listing Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCrop, setNewCrop] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLoc, setNewLoc] = useState('');

  // Admin Form states
  const [adminTab, setAdminTab] = useState('crops');
  // Crop Form
  const [acName, setAcName] = useState('');
  const [acSeason, setAcSeason] = useState('Rabi');
  const [acSoil, setAcSoil] = useState('');
  const [acWater, setAcWater] = useState('');
  const [acFert, setAcFert] = useState('');
  const [acImg, setAcImg] = useState('');
  // Scheme Form
  const [asTitle, setAsTitle] = useState('');
  const [asDesc, setAsDesc] = useState('');
  const [asElig, setAsElig] = useState('');
  const [asLink, setAsLink] = useState('');
  const [asCat, setAsCat] = useState('loan');

  // Scanner Simulator states
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Detail Modal state
  const [selectedCropDetails, setSelectedCropDetails] = useState(null);
  
  const [marketTab, setMarketTab] = useState('listings');
  const [mandiRatesList, setMandiRatesList] = useState([]);
  const [mandiStateFilter, setMandiStateFilter] = useState('All');
  const [mandiCropSearch, setMandiCropSearch] = useState('');
  
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'assistant', text: 'Hello! I am your Krishi Assistant. Ask me anything about crop diseases, Mandi prices, KCC loans or weather! / नमस्ते! मैं आपका कृषि सहायक हूँ। फसलों की बीमारी, मंडी भाव, KCC लोन या मौसम के बारे में कुछ भी पूछें!' }
  ]);
  
  const [activeFaq, setActiveFaq] = useState(null);

  const t = localizations[lang];

  // Fetch initial database info on mount
  useEffect(() => {
    fetchCrops();
    fetchSchemes();
    fetchListings();
    fetchWeather(weatherCity);
  }, []);

  // Fetch dashboard details when user logs in
  useEffect(() => {
    if (token) {
      fetchMyListings();
      fetchMyReports();
    }
  }, [token]);

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${API_BASE}/crops`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setCrops(data);
      }
    } catch (err) {
      console.warn('Backend server offline, using default crop advisory.');
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_BASE}/schemes`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setSchemes(data);
      }
    } catch (err) {
      console.warn('Backend server offline, using default loan schemes.');
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/listings`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.warn('Failed to fetch marketplace listings.');
    }
  };

  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/listings/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyListings(data);
      }
    } catch (err) {
      console.warn('Failed to fetch user own listings.');
    }
  };

  const fetchMyReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/disease-reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyReports(data);
      }
    } catch (err) {
      console.warn('Failed to fetch user disease report logs.');
    }
  };

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(`${API_BASE}/weather?city=${city}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.warn('Failed to fetch weather information.');
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
      console.warn('Failed to fetch Mandi rates.');
    }
  };

  useEffect(() => {
    fetchMandiBoard(mandiStateFilter, mandiCropSearch);
  }, [mandiStateFilter, mandiCropSearch]);

  const handleChatbotSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);

    try {
      const res = await fetch(`${API_BASE}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { sender: 'assistant', text: data.reply }]);
      } else {
        throw new Error('Chat error');
      }
    } catch (err) {
      setChatHistory(prev => [
        ...prev, 
        { sender: 'assistant', text: 'Sorry, I am having trouble connecting to the backend. Please check your connection! / क्षमा करें, सर्वर से संपर्क करने में समस्या हो रही है।' }
      ]);
    }
  };

  // --- AUTHENTICATION ACTIONS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('km_token', data.token);
        localStorage.setItem('km_user', JSON.stringify(data.user));
        setShowAuthModal(false);
        clearAuthForm();
      } else {
        const errData = await res.json();
        alert(`Login Failed: ${errData.error}`);
      }
    } catch (err) {
      alert('Cannot connect to backend auth service.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!authName || !authEmail || !authPassword) return;

    const payload = {
      name: authName,
      email: authEmail,
      password: authPassword,
      role: authRole,
      phone: authPhone,
      location: authLoc
    };

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('km_token', data.token);
        localStorage.setItem('km_user', JSON.stringify(data.user));
        setShowAuthModal(false);
        clearAuthForm();
      } else {
        const errData = await res.json();
        alert(`Register Failed: ${errData.error}`);
      }
    } catch (err) {
      alert('Cannot connect to backend register service.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setMyListings([]);
    setMyReports([]);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
  };

  const clearAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthPhone('');
    setAuthLoc('');
  };

  // --- MARKETPLACE ACTIONS ---

  const handleAddListing = async (e) => {
    e.preventDefault();
    if (!newCrop || !newQty || !newPrice) return;
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const payload = {
      crop_name: newCrop,
      quantity: newQty,
      price: newPrice,
      location: newLoc || user.location || 'Local Mandi'
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
        fetchListings();
        fetchMyListings();
        setNewCrop('');
        setNewQty('');
        setNewPrice('');
        setNewLoc('');
        setShowAddForm(false);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      alert('Failed to publish listing.');
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/listings/${id}/sell`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchListings();
        fetchMyListings();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      alert('Failed to mark listing as sold.');
    }
  };

  // --- ADMIN ACTIONS ---

  const handleAddCropAdmin = async (e) => {
    e.preventDefault();
    if (!acName) return;

    const payload = {
      name: acName,
      season: acSeason,
      soil_type: acSoil,
      water_needs: acWater,
      fertilizer_tips: acFert,
      image_url: acImg || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    };

    try {
      const res = await fetch(`${API_BASE}/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchCrops();
        setAcName('');
        setAcSoil('');
        setAcWater('');
        setAcFert('');
        setAcImg('');
        alert('New crop guide added successfully!');
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      alert('Failed to add crop.');
    }
  };

  const handleAddSchemeAdmin = async (e) => {
    e.preventDefault();
    if (!asTitle || !asDesc) return;

    const payload = {
      title: asTitle,
      description: asDesc,
      eligibility: asElig,
      link: asLink,
      category: asCat
    };

    try {
      const res = await fetch(`${API_BASE}/schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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

  // --- CROP LEAF SCANNERS ---

  const handleModelScan = (cropKey) => {
    const defaultImgUrls = {
      wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
      tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      rice: "https://images.unsplash.com/photo-1536257130722-ea1c9ad9d447?w=400"
    };
    setPreviewUrl(defaultImgUrls[cropKey]);
    setIsScanning(true);
    setScanResult(null);
    setSelectedCrop(cropKey);
    
    setTimeout(async () => {
      try {
        const blob = new Blob([''], { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', blob, `${cropKey}_leaf.png`);

        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}/upload-image`, {
          method: 'POST',
          headers,
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          setScanResult(data);
          if (token) fetchMyReports();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        // Local simulation fallback
        const localDiseases = {
          wheat: { cropName: "Wheat (गेंहू)", predictedDisease: "Leaf Rust (पत्ती गेरूआ)", confidence: 94.2, cure: "Spray neem oil solution (10ml/liter) or copper fungicide." },
          tomato: { cropName: "Tomato (टमाटर)", predictedDisease: "Early Blight (अगेती झुलसा)", confidence: 91.8, cure: "Prune lower infected leaves. Apply Trichoderma-based bio-fungicide." },
          rice: { cropName: "Rice (धान)", predictedDisease: "Bacterial Leaf Blight (जीवाणु झुलसा)", confidence: 89.5, cure: "Drain excess standing water. Apply potash. Spray copper hydroxide." }
        };
        setScanResult(localDiseases[cropKey]);
      } finally {
        setIsScanning(false);
      }
    }, 1200);
  };

  const handleCustomImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setIsScanning(true);
    setScanResult(null);
    setSelectedCrop('custom');

    const formData = new FormData();
    formData.append('image', file);

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
        if (token) fetchMyReports();
      } else {
        alert('Failed to analyze image file. Please use JPG/PNG format.');
      }
    } catch (err) {
      setScanResult({
        cropName: 'Custom Leaf Image',
        predictedDisease: 'Fungal Spot (संभावित फंगल संक्रमण)',
        confidence: 84.5,
        cure: 'Ensure proper field drainage and check seed quality. Consult agricultural experts.',
        imageUrl: null
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/crops" element={<Crops />} />
        <Route path="/" element={
          <>
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        token={token} 
        user={user} 
        handleLogout={handleLogout} 
        setAuthTab={setAuthTab} 
        setShowAuthModal={setShowAuthModal} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        t={t} 
      />

      {/* Alerts Ticker */}
      <div className="alerts-ticker-container">
        <div className="alerts-ticker-title">
          📢 {lang === 'en' ? 'Alerts' : 'कृषि सूचना'}
        </div>
        <div className="alerts-ticker-wrapper">
          <div className="alerts-ticker-content">
            {lang === 'en' ? (
              <span>• 🌾 Sowing window for soybean starting next week in Central India • 🌧️ Heavy rains expected in western districts of Maharashtra - take caution • 💰 Apply for Solar Pump subsidy under PM-KUSUM before Aug 15! • 🐛 Leaf Rust alert: inspect wheat crops daily.</span>
            ) : (
              <span>• 🌾 मध्य भारत में अगले सप्ताह से सोयाबीन की बुवाई का समय शुरू • 🌧️ महाराष्ट्र के पश्चिमी जिलों में भारी बारिश की चेतावनी - सतर्क रहें • 💰 पीएम-कुसुम योजना के तहत सोलर पंप सब्सिडी के लिए 15 अगस्त से पहले आवेदन करें! • 🐛 पत्ती गेरूआ रोग की चेतावनी: गेंहू की फसलों की दैनिक जांच करें।</span>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <header id="home" className="hero-section">
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
            <a href="#crops" className="btn-primary">{t.getStarted}</a>
            <a href="#simulator" className="btn-secondary">{t.learnMore}</a>
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
            <div 
              style={{
                background: '#E8F5E9',
                color: '#2E7D32',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '700'
              }}
            >
              {token ? `🟢 ${user.name}` : '🔴 Offline Guest Mode'}
            </div>
          </div>
        </div>
      </header>

      {/* Crops Advisory Section */}
      <section id="crops" className="features-section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <h2 className="section-title">{t.cropsTitle}</h2>
          <p className="section-subtitle">{t.cropsSub}</p>
        </div>
        
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {crops.map((crop) => (
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
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                <h3 className="feature-title" style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', margin: '0 0 1rem' }}>{crop.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: '1' }}>
                  <div><strong>🌱 {t.soil}:</strong> {crop.soil_type}</div>
                  <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <strong>💧 {t.water}:</strong> {crop.water_needs}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCropDetails(crop)} 
                  className="btn-secondary" 
                  style={{ padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', width: '100%' }}
                >
                  🔍 {t.viewDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="mandi" className="features-section">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title">{t.mandiTitle}</h2>
          <p className="section-subtitle">{t.mandiSub}</p>
        </div>

        {/* Sub Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => setMarketTab('listings')} 
            className={marketTab === 'listings' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem' }}
          >
            🛒 {lang === 'en' ? 'Farmer Listings' : 'किसान फसल सूचियां'}
          </button>
          <button 
            onClick={() => setMarketTab('mandiRates')} 
            className={marketTab === 'mandiRates' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem' }}
          >
            📈 {lang === 'en' ? 'Official Mandi Rates' : 'सरकारी मंडी भाव'}
          </button>
        </div>

        {marketTab === 'listings' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '8px' }}>
                🌾 {t.addListing}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddListing} className="visual-card" style={{ maxWidth: '500px', margin: '0 auto 3rem', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', color: 'var(--primary-dark)', fontSize: '1.25rem' }}>{t.addListing}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', textAlign: 'left' }}>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t.cropName}</label>
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
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t.quantity}</label>
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
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t.price}</label>
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
                    <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t.location}</label>
                    <input 
                      type="text" 
                      value={newLoc} 
                      onChange={(e) => setNewLoc(e.target.value)} 
                      placeholder="e.g. Indore Mandi" 
                      className="auth-input"
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                    {t.submitListing}
                  </button>
                </div>
              </form>
            )}

            <div className="features-grid">
              {listings.map((list) => (
                <div key={list.id} className="feature-card" style={{ borderLeft: '4px solid var(--primary-light)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-dark)' }}>{list.crop_name}</span>
                    <span style={{ background: '#E8F5E9', color: 'var(--primary-dark)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {list.quantity}
                    </span>
                  </div>
                  <div style={{ margin: '1rem 0', fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
                    Rs. {list.price} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-muted)' }}>/ kg</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>📍 {list.location}</div>
                    <div>👤 {t.seller}: {list.seller_name}</div>
                    <div>📞 {t.buyerPhone}: {list.seller_phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="visual-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', textAlign: 'left' }}>
            {/* Search Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="auth-label">{lang === 'en' ? 'Search Crop' : 'फसल खोजें'}</label>
                <input 
                  type="text" 
                  value={mandiCropSearch} 
                  onChange={(e) => setMandiCropSearch(e.target.value)} 
                  placeholder={lang === 'en' ? "Search e.g. Wheat..." : "खोजें जैसे: गेंहू..."}
                  className="auth-input"
                />
              </div>
              <div>
                <label className="auth-label">{lang === 'en' ? 'Filter by State' : 'राज्य चुनें'}</label>
                <select 
                  value={mandiStateFilter} 
                  onChange={(e) => setMandiStateFilter(e.target.value)} 
                  className="auth-input"
                >
                  <option value="All">{lang === 'en' ? 'All States' : 'सभी राज्य'}</option>
                  <option value="MP">Madhya Pradesh (MP)</option>
                  <option value="MH">Maharashtra (MH)</option>
                  <option value="PB">Punjab (PB)</option>
                  <option value="UP">Uttar Pradesh (UP)</option>
                </select>
              </div>
            </div>

            {/* Mandi Rates Table */}
            <div className="mandi-table-container">
              <table className="mandi-table">
                <thead>
                  <tr>
                    <th>{lang === 'en' ? 'Crop' : 'फसल'}</th>
                    <th>{lang === 'en' ? 'State' : 'राज्य'}</th>
                    <th>{lang === 'en' ? 'Market / Mandi' : 'मंडी / बाज़ार'}</th>
                    <th>{lang === 'en' ? 'Min Price' : 'न्यूनतम भाव'}</th>
                    <th>{lang === 'en' ? 'Max Price' : 'अधिकतम भाव'}</th>
                    <th>{lang === 'en' ? 'Average Price' : 'औसत भाव'}</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiRatesList.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {lang === 'en' ? 'No mandi records found.' : 'कोई मंडी रिकॉर्ड नहीं मिला।'}
                      </td>
                    </tr>
                  ) : (
                    mandiRatesList.map((rate) => (
                      <tr key={rate.id}>
                        <td style={{ fontWeight: '600' }}>{rate.crop}</td>
                        <td><span className="badge-role" style={{ background: '#7F8C8D' }}>{rate.state}</span></td>
                        <td>📍 {rate.mandi}</td>
                        <td style={{ color: '#C0392B', fontWeight: '600' }}>₹{rate.minPrice} / qtl</td>
                        <td style={{ color: '#27AE60', fontWeight: '600' }}>₹{rate.maxPrice} / qtl</td>
                        <td style={{ color: 'var(--primary-dark)', fontWeight: '700', fontSize: '0.95rem' }}>₹{rate.avgPrice} / qtl</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Price Trend Chart Card */}
            <div className="visual-card" style={{ maxWidth: '900px', margin: '2rem auto 0', padding: '2rem', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ color: 'var(--primary-dark)', margin: '0 0 1rem', fontSize: '1.25rem' }}>
                📈 {lang === 'en' ? 'Wheat Price Trend (Rs./Quintal)' : 'गेंहू मंडी भाव रुझान (₹/क्विंटल)'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {lang === 'en' ? 'Average market prices tracked over the last 5 months across major hubs.' : 'पिछले 5 महीनों में प्रमुख केंद्रों पर ट्रैक किए गए औसत बाजार भाव।'}
              </p>
              
              {/* SVG Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '200px', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)', position: 'relative' }}>
                  {/* Grid Lines */}
                  <div style={{ position: 'absolute', bottom: '25%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)', borderStyle: 'dashed' }}></div>
                  <div style={{ position: 'absolute', bottom: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)', borderStyle: 'dashed' }}></div>
                  <div style={{ position: 'absolute', bottom: '75%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)', borderStyle: 'dashed' }}></div>
                  
                  {/* Bar 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', gap: '0.5rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-dark)' }}>₹2,050</span>
                    <div style={{ width: '100%', height: '110px', background: 'var(--primary-light)', opacity: '0.7', borderRadius: '6px 6px 0 0', transition: 'height 0.3s' }}></div>
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
      </section>

      {/* Weather Advisor Section */}
      <section id="weather" className="simulator-section">
        <div className="simulator-container" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
          <div className="simulator-info">
            <span className="simulator-badge" style={{ background: 'var(--accent-blue)' }}>{lang === 'en' ? 'Weather Info' : 'मौसम जानकारी'}</span>
            <h2 className="simulator-title">{t.weatherTitle}</h2>
            <p className="simulator-description">{t.weatherSub}</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder={t.searchCity} 
                value={weatherCity} 
                onChange={(e) => setWeatherCity(e.target.value)}
                style={{ flexGrow: 1, padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--sans)' }}
              />
              <button onClick={() => fetchWeather(weatherCity)} className="btn-primary" style={{ padding: '0.7rem 1.25rem', borderRadius: '10px' }}>
                {t.checkWeather}
              </button>
            </div>
          </div>

          <div className="interactive-panel" style={{ minHeight: '220px', background: 'var(--primary-gradient)', color: 'white', border: 'none' }}>
            {weatherData ? (
              <div style={{ width: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>{weatherData.name}, {weatherData.sys?.country}</span>
                  <span style={{ fontSize: '2.5rem' }}>
                    {weatherData.weather?.[0]?.main === 'Clear' ? '☀️' : '☁️'}
                  </span>
                </div>
                <p style={{ margin: '0.25rem 0 1.5rem', textTransform: 'capitalize', opacity: '0.9', fontSize: '0.95rem' }}>
                  {weatherData.weather?.[0]?.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>{t.temp}</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.25rem 0 0' }}>{Math.round(weatherData.main?.temp)}°C</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>{t.humidity}</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.25rem 0 0' }}>{weatherData.main?.humidity}%</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>{t.wind}</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.25rem 0 0' }}>{weatherData.wind?.speed} m/s</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem', lineHeight: '1.45' }}>
                  <strong>🌾 {t.advice}:</strong> {weatherData.advice || (weatherData.main?.temp > 28 ? 'Ideal for sowing summer seeds. Ensure soil remains wet.' : 'Mild conditions. Good time for organic fertilizing.')}
                </div>
              </div>
            ) : (
              <div className="placeholder-view" style={{ color: 'white' }}>
                <p>Loading weather conditions...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Leaf Scanner Section */}
      <section id="simulator" className="simulator-section" style={{ background: 'white' }}>
        <div className="simulator-container">
          <div className="simulator-info">
            <span className="simulator-badge" style={{ background: '#C0392B' }}>AI Analysis</span>
            <h2 className="simulator-title">{t.simulatorTitle}</h2>
            <p className="simulator-description">{t.simulatorDesc}</p>
            
            <p style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>
              {t.simSelectCrop}
            </p>
            <div className="crop-select-grid" style={{ marginBottom: '1.5rem' }}>
              <button 
                className={`crop-select-btn ${selectedCrop === 'wheat' ? 'active' : ''}`}
                onClick={() => handleModelScan('wheat')}
                disabled={isScanning}
              >
                <span className="crop-emoji">🌾</span>
                <span>{lang === 'en' ? 'Wheat' : 'गेंहू'}</span>
              </button>
              <button 
                className={`crop-select-btn ${selectedCrop === 'tomato' ? 'active' : ''}`}
                onClick={() => handleModelScan('tomato')}
                disabled={isScanning}
              >
                <span className="crop-emoji">🍅</span>
                <span>{lang === 'en' ? 'Tomato' : 'टमाटर'}</span>
              </button>
              <button 
                className={`crop-select-btn ${selectedCrop === 'rice' ? 'active' : ''}`}
                onClick={() => handleModelScan('rice')}
                disabled={isScanning}
              >
                <span className="crop-emoji">🌾</span>
                <span>{lang === 'en' ? 'Rice' : 'धान'}</span>
              </button>
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem' }}>
              <label className="btn-secondary" style={{ display: 'inline-block', cursor: 'pointer', textAlign: 'center' }}>
                📷 {t.uploadFile}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleCustomImageUpload} 
                  disabled={isScanning}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="interactive-panel" style={{ overflow: 'hidden' }}>
            {isScanning && (
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="scanner-line"></div>
                {previewUrl ? (
                  <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '20px', overflow: 'hidden', border: '3px solid var(--primary-light)', boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)', marginBottom: '1rem' }}>
                    <img src={previewUrl} alt="Scanning Leaf" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(76, 175, 80, 0.15)' }}></div>
                  </div>
                ) : (
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'pulse-soft 1s infinite' }}>🔍</div>
                )}
                <p style={{ fontWeight: '700', color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#27AE60', animation: 'pulse-soft 0.8s infinite' }}></span>
                  {t.simScanning}
                </p>
              </div>
            )}

            {!isScanning && !scanResult && (
              <div className="placeholder-view">
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📷</div>
                <p style={{ maxWidth: '250px', margin: '0 auto', fontWeight: '500' }}>{t.simPlaceholder}</p>
              </div>
            )}

            {!isScanning && scanResult && (
              <div className="result-card">
                {scanResult.imageUrl || previewUrl ? (
                  <div style={{ height: '140px', width: '140px', margin: '0 auto 1rem', borderRadius: '15px', overflow: 'hidden', border: '2px solid var(--primary-light)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <img 
                      src={previewUrl || (scanResult.imageUrl.startsWith('http') ? scanResult.imageUrl : `${API_BASE.replace('/api', '')}${scanResult.imageUrl}`)} 
                      alt="Uploaded Leaf" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {selectedCrop === 'wheat' ? '🌾' : selectedCrop === 'tomato' ? '🍅' : '🍃'}
                  </div>
                )}
                
                <div className="result-header">
                  {scanResult.predictedDisease}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
                  {lang === 'en' ? 'Diagnosed Crop: ' : 'फसल: '}{scanResult.cropName}
                </p>
                
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  {t.simConfidence}: {scanResult.confidence}%
                </div>
                <div className="confidence-bar-container">
                  <div 
                    className="confidence-bar" 
                    style={{ width: `${scanResult.confidence}%` }}
                  ></div>
                </div>

                <div className="cure-box">
                  <div className="cure-title">🌿 {t.simCuring}</div>
                  <div className="cure-text">{scanResult.cure}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Dashboard Section */}
      {token && (
        <section id="dashboard" className="features-section" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: '#FFFFFF' }}>
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">{t.dashboardTitle}</h2>
            <p className="section-subtitle">{t.dashboardSub}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '3rem' }}>
            {/* Profile details */}
            <div>
              <h3 className="dashboard-section-title">👤 {t.myProfile}</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <div className="profile-field-label">{t.fullName}</div>
                  <div className="profile-field-val">{user?.name}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Role</div>
                  <div className="profile-field-val"><span className="badge-role">{user?.role}</span></div>
                </div>
                <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                  <div className="profile-field-label">{t.email}</div>
                  <div className="profile-field-val">{user?.email}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">{t.phone}</div>
                  <div className="profile-field-val">{user?.phone || 'Not provided'}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">{t.location}</div>
                  <div className="profile-field-val">{user?.location || 'Not provided'}</div>
                </div>
              </div>
            </div>

            {/* User listings & scans */}
            <div>
              <h3 className="dashboard-section-title">🌾 {t.myListings}</h3>
              {myListings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.noListings}</p>
              ) : (
                <div className="history-list">
                  {myListings.map((list) => (
                    <div key={list.id} className="history-item">
                      <div className="history-item-details">
                        <span style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{list.crop_name}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {list.location} | Qty: {list.quantity}</span>
                        <span style={{ fontWeight: '600', color: 'var(--primary-dark)', fontSize: '0.95rem' }}>Rs. {list.price} / kg</span>
                      </div>
                      <div>
                        {list.status === 'available' ? (
                          <button onClick={() => handleMarkAsSold(list.id)} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                            ✓ {t.markSold}
                          </button>
                        ) : (
                          <span className="badge-sold">Sold</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="dashboard-section-title">🔍 {t.scanHistory}</h3>
              {myReports.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.noHistory}</p>
              ) : (
                <div className="history-list">
                  {myReports.map((rep) => (
                    <div key={rep.id} className="history-item" style={{ borderLeft: '3px solid #C0392B' }}>
                      <div className="history-item-details">
                        <span style={{ fontWeight: '700', color: '#C0392B' }}>{rep.predicted_disease}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Confidence: {rep.confidence}% | Date: {new Date(rep.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rep.image_url && (
                        <img 
                          src={`http://localhost:3000${rep.image_url}`} 
                          alt="Scan preview" 
                          style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Admin Panel Section */}
      {token && user?.role === 'admin' && (
        <section id="admin" className="features-section">
          <div className="section-header">
            <h2 className="section-title">{t.adminTitle}</h2>
            <p className="section-subtitle">{t.adminSub}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <button 
              onClick={() => setAdminTab('crops')} 
              className={adminTab === 'crops' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}
            >
              🌾 {t.addCrop}
            </button>
            <button 
              onClick={() => setAdminTab('schemes')} 
              className={adminTab === 'schemes' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}
            >
              🏦 {t.addScheme}
            </button>
          </div>

          {adminTab === 'crops' ? (
            <form onSubmit={handleAddCropAdmin} className="visual-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
              <h3 style={{ margin: '0 0 1.5rem', color: 'var(--primary-dark)' }}>{t.addCrop}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', textAlign: 'left' }}>
                <div>
                  <label className="auth-label">{t.cropName}</label>
                  <input type="text" value={acName} onChange={(e) => setAcName(e.target.value)} required className="auth-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="auth-label">{t.season}</label>
                    <select value={acSeason} onChange={(e) => setAcSeason(e.target.value)} className="auth-input">
                      <option value="Rabi">Rabi (रबी)</option>
                      <option value="Kharif">Kharif (खरीफ)</option>
                      <option value="Zaid">Zaid (जायद)</option>
                      <option value="Year-round">Year-round</option>
                    </select>
                  </div>
                  <div>
                    <label className="auth-label">{t.soil}</label>
                    <input type="text" value={acSoil} onChange={(e) => setAcSoil(e.target.value)} placeholder="e.g. Clayey Loam" className="auth-input" />
                  </div>
                </div>
                <div>
                  <label className="auth-label">{t.water}</label>
                  <textarea value={acWater} onChange={(e) => setAcWater(e.target.value)} rows="2" className="auth-input" style={{ resize: 'none' }}></textarea>
                </div>
                <div>
                  <label className="auth-label">{t.fertilizer}</label>
                  <textarea value={acFert} onChange={(e) => setAcFert(e.target.value)} rows="2" className="auth-input" style={{ resize: 'none' }}></textarea>
                </div>
                <div>
                  <label className="auth-label">{t.cropImage}</label>
                  <input type="text" value={acImg} onChange={(e) => setAcImg(e.target.value)} placeholder="https://..." className="auth-input" />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                  {t.addCrop}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddSchemeAdmin} className="visual-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
              <h3 style={{ margin: '0 0 1.5rem', color: 'var(--primary-dark)' }}>{t.addScheme}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', textAlign: 'left' }}>
                <div>
                  <label className="auth-label">{lang === 'en' ? 'Scheme Title' : 'योजना का नाम'}</label>
                  <input type="text" value={asTitle} onChange={(e) => setAsTitle(e.target.value)} required className="auth-input" />
                </div>
                <div>
                  <label className="auth-label">{lang === 'en' ? 'Description' : 'विवरण'}</label>
                  <textarea value={asDesc} onChange={(e) => setAsDesc(e.target.value)} required rows="3" className="auth-input" style={{ resize: 'none' }}></textarea>
                </div>
                <div>
                  <label className="auth-label">{lang === 'en' ? 'Eligibility' : 'पात्रता'}</label>
                  <input type="text" value={asElig} onChange={(e) => setAsElig(e.target.value)} className="auth-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div>
                    <label className="auth-label">{t.schemeLink}</label>
                    <input type="text" value={asLink} onChange={(e) => setAsLink(e.target.value)} placeholder="https://..." className="auth-input" />
                  </div>
                  <div>
                    <label className="auth-label">{t.category}</label>
                    <select value={asCat} onChange={(e) => setAsCat(e.target.value)} className="auth-input">
                      <option value="loan">{t.loan}</option>
                      <option value="subsidy">{t.subsidy}</option>
                      <option value="training">{t.training}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                  {t.addScheme}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Schemes and Subsidies Section */}
      <section id="schemes" className="features-section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <h2 className="section-title">{lang === 'en' ? 'Government Loans & Subsidies' : 'सरकारी ऋण और सब्सिडी योजनाएं'}</h2>
          <p className="section-subtitle">{lang === 'en' ? 'Get financial support and agricultural subsidies easily.' : 'कृषि ऋण और वित्तीय सब्सिडी की जानकारी प्राप्त करें।'}</p>
        </div>
        
        <div className="features-grid">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="feature-card" style={{ borderTop: '4px solid var(--primary-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: scheme.category === 'loan' ? '#D35400' : 'var(--primary-dark)' }}>
                  {scheme.category}
                </span>
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{scheme.title}</h3>
              <p className="feature-description" style={{ fontSize: '0.9rem', marginBottom: '1.25rem', flexGrow: 1 }}>{scheme.description}</p>
              
              <div style={{ fontSize: '0.85rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <strong>🎓 {lang === 'en' ? 'Eligibility:' : 'पात्रता:'}</strong> {scheme.eligibility}
              </div>
              
              <a 
                href={scheme.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary" 
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.5rem', fontSize: '0.9rem', borderRadius: '6px' }}
              >
                🔗 {lang === 'en' ? 'Official Link' : 'आधिकारिक लिंक'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button onClick={() => setShowAuthModal(false)} className="modal-close">×</button>
            
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setAuthTab('login')} 
                style={{ background: 'transparent', border: 'none', fontSize: '1.15rem', fontWeight: authTab === 'login' ? '700' : '400', color: authTab === 'login' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--sans)' }}
              >
                {t.login}
              </button>
              <button 
                onClick={() => setAuthTab('register')} 
                style={{ background: 'transparent', border: 'none', fontSize: '1.15rem', fontWeight: authTab === 'register' ? '700' : '400', color: authTab === 'register' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--sans)' }}
              >
                {t.register}
              </button>
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="auth-input-group">
                  <label className="auth-label">{t.email}</label>
                  <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required className="auth-input" />
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">{t.password}</label>
                  <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required className="auth-input" />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>{t.login}</button>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAuthTab('register')}>
                  {t.noAccount}
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="auth-input-group">
                  <label className="auth-label">{t.fullName}</label>
                  <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} required className="auth-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div className="auth-input-group">
                    <label className="auth-label">{t.email}</label>
                    <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required className="auth-input" />
                  </div>
                  <div className="auth-input-group">
                    <label className="auth-label">{t.role}</label>
                    <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} className="auth-input">
                      <option value="farmer">{t.farmer}</option>
                      <option value="buyer">{t.buyer}</option>
                    </select>
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">{t.password}</label>
                  <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required className="auth-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="auth-input-group">
                    <label className="auth-label">{t.phone}</label>
                    <input type="text" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} className="auth-input" />
                  </div>
                  <div className="auth-input-group">
                    <label className="auth-label">{t.location}</label>
                    <input type="text" value={authLoc} onChange={(e) => setAuthLoc(e.target.value)} placeholder="e.g. Nashik, MH" className="auth-input" />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>{t.register}</button>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAuthTab('login')}>
                  {t.hasAccount}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Crop Details Modal */}
      {selectedCropDetails && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <button onClick={() => setSelectedCropDetails(null)} className="modal-close">×</button>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--primary-dark)', fontSize: '1.6rem' }}>{selectedCropDetails.name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              {t.cropDetailsTitle}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>☀️ {t.sowingSeason}</strong>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{selectedCropDetails.season}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>🌱 {t.soilPreparation}</strong>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{selectedCropDetails.soil_type}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>💧 {t.irrigationSchedule}</strong>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', margin: '0' }}>{selectedCropDetails.water_needs}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>🧪 {t.nutrientManagement}</strong>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', margin: '0' }}>{selectedCropDetails.fertilizer_tips}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Accordion Section */}
      <section id="faq" className="features-section" style={{ background: '#F9FAFB', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <h2 className="section-title">{lang === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}</h2>
          <p className="section-subtitle">
            {lang === 'en' ? 'Find answers to common questions about our crop tools and mandi rates.' : 'फसल रोग स्कैनर और मंडी बाजार के बारे में सामान्य प्रश्नों के उत्तर पाएं।'}
          </p>
        </div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              q: lang === 'en' ? "How does the AI Leaf Disease Scanner work?" : "एआई लीफ डिजीज स्कैनर कैसे काम करता है?",
              a: lang === 'en' 
                ? "Our Leaf Scanner uses deep learning vision models to diagnose crop leaf infections. You can select a preset crop leaf or upload a photo. The system identifies the disease and returns natural, organic remedies instantly."
                : "हमaur लीफ स्कैनर फसल की पत्तियों के रोगों की पहचान के लिए डीप लर्निंग विज़न मॉडल का उपयोग करता है। आप एक पत्ती चुन सकते हैं या फोटो अपलोड कर सकते हैं। सिस्टम बीमारी की पहचान करके जैविक उपचार प्रदान करता है।"
            },
            {
              q: lang === 'en' ? "How do I list my crop produce in the Marketplace?" : "मैं मार्केटप्लेस में अपनी फसल की उपज कैसे सूचीबद्ध करूं?",
              a: lang === 'en'
                ? "First, sign up or log in. Go to the Marketplace section, click 'Add Listing' to input crop name, price, quantity, and location, and publish. Verified buyers will see your contact card and call you directly."
                : "सबसे पहले लॉग इन करें। इसके बाद मंडी मार्केटप्लेस टैब में 'Add Listing' पर क्लिक करें, फसल का नाम, मूल्य, मात्रा और स्थान दर्ज करें और सबमिट करें। खरीदार आपका फोन नंबर देख सकेंगे और सीधे आपसे संपर्क कर सकेंगे।"
            },
            {
              q: lang === 'en' ? "Are there any service charges or commission?" : "क्या कोई सेवा शुल्क या कमीशन है?",
              a: lang === 'en'
                ? "No, Krishi Mitra is completely free. We do not charge commission, listing fees, or transaction costs. The deal is finalized directly between you and the buyer."
                : "नहीं, कृषि मित्र बिल्कुल मुफ्त है। हम कोई कमीशन या लिस्टिंग शुल्क नहीं लेते हैं। सौदे सीधे आपके और खरीदार के बीच तय होते हैं।"
            }
          ].map((faq, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)', 
                overflow: 'hidden', 
                transition: 'all 0.3s' 
              }}
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{ 
                  width: '100%', 
                  padding: '1.25rem 1.5rem', 
                  background: 'none', 
                  border: 'none', 
                  textAlign: 'left', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                  fontFamily: 'var(--sans)', 
                  fontWeight: '700', 
                  fontSize: '1.05rem', 
                  color: 'var(--primary-dark)',
                  outline: 'none'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ transition: 'transform 0.2s', transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▼
                </span>
              </button>
              
              <div 
                style={{ 
                  maxHeight: activeFaq === idx ? '200px' : '0', 
                  overflow: 'hidden', 
                  transition: 'max-height 0.3s cubic-bezier(0, 1, 0, 1)', 
                  background: '#F9FAFB', 
                  borderTop: activeFaq === idx ? '1px solid var(--border-color)' : 'none' 
                }}
              >
                <p style={{ padding: '1.25rem 1.5rem', margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#home" className="brand-container" style={{ color: 'white', marginBottom: '1rem' }}>
              <Logo width={40} height={40} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1' }}>
                <span className="brand-name" style={{ display: 'flex', gap: '4px', fontSize: '1.3rem', margin: '0' }}>
                  <span style={{ color: '#FFFFFF' }}>Krishi</span>
                  <span style={{ color: 'var(--primary-light)' }}>Mitra</span>
                </span>
                <span style={{ fontSize: '0.45rem', fontWeight: '700', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                  AGRICULTURE'S TRUE FRIEND
                </span>
              </div>
            </a>
            <p className="footer-desc">{t.footerDesc}</p>
          </div>
          <div className="footer-links-group">
            <h4 className="footer-title">{lang === 'en' ? 'Quick Links' : 'त्वरित संपर्क'}</h4>
            <a href="#home" className="footer-link">{lang === 'en' ? 'Home' : 'मुख्य पृष्ठ'}</a>
            <a href="#crops" className="footer-link">{t.navCrops}</a>
            <a href="#mandi" className="footer-link">{t.navMandi}</a>
          </div>
          <div className="footer-links-group">
            <h4 className="footer-title">{lang === 'en' ? 'Services' : 'सेवाएं'}</h4>
            <a href="#weather" className="footer-link">{t.checkWeather}</a>
            <a href="#simulator" className="footer-link">{t.navSimulator}</a>
            <a href="#schemes" className="footer-link">{t.navSchemes}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.copyright}</p>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="chatbot-container">
        {showChatbot ? (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                🌾 {lang === 'en' ? 'Krishi Assistant' : 'कृषि सहायक'}
              </span>
              <button className="chatbot-close" onClick={() => setShowChatbot(false)}>×</button>
            </div>
            
            <div className="chatbot-messages">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`chat-bubble ${chat.sender}`}>
                  {chat.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleChatbotSubmit} className="chatbot-input-area">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder={lang === 'en' ? "Ask about crops, disease, KCC..." : "फसलों, बीमारी, KCC के बारे में पूछें..."}
                className="chatbot-input"
              />
              <button type="submit" className="chatbot-send-btn">
                {lang === 'en' ? 'Send' : 'भेजें'}
              </button>
            </form>
          </div>
        ) : (
          <button 
            className="chatbot-toggle" 
            onClick={() => setShowChatbot(true)}
            title={lang === 'en' ? 'Chat with Krishi Assistant' : 'कृषि सहायक से-चैट करें'}
          >
            💬
          </button>
        )}
      </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
