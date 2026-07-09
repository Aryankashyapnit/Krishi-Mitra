import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Reusable Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Crops from './pages/Crops';
import Disease from './pages/Disease';
import Weather from './pages/Weather';
import Loans from './pages/Loans';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';

import './App.css';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api';

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
    cropsTitle: "Crop Advisory Guide",
    cropsSub: "Scientific cultivation techniques, seasonal details, and irrigation advisories.",
    season: "Season",
    soil: "Soil Type",
    water: "Water Requirements",
    fertilizer: "Fertilizer Advice",
    viewDetails: "View Details",
    cropDetailsTitle: "Crop Management Protocol",
    sowingSeason: "Sowing Season",
    soilPreparation: "Soil Preparation",
    irrigationSchedule: "Irrigation Schedule",
    nutrientManagement: "Nutrient & Fertilizer Management",
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
    weatherTitle: "Live Weather Advisor",
    weatherSub: "Check hyperlocal weather guidelines for crop planning.",
    searchCity: "Enter City Name",
    checkWeather: "Get Forecast",
    temp: "Temperature",
    humidity: "Humidity",
    wind: "Wind Speed",
    advice: "Advisor Tip",
    simulatorTitle: "AI leaf scanner",
    simulatorDesc: "Upload an image of a crop leaf or select a default crop model to test our AI diagnostic engine.",
    simSelectCrop: "Select a crop model to simulate:",
    simCuring: "Organic Cure & Remedial Steps:",
    simConfidence: "AI Confidence Score",
    simPlaceholder: "Upload a crop leaf photo or select a model crop to scan.",
    simScanning: "Analyzing leaf image with AI...",
    uploadFile: "Upload Leaf Photo",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    phone: "Phone Number",
    role: "I am a...",
    farmer: "Farmer",
    buyer: "Buyer / Trader",
    hasAccount: "Already have an account? Login",
    noAccount: "Don't have an account? Register",
    dashboardTitle: "User Dashboard",
    dashboardSub: "Manage your profile, listings, and view past disease diagnosis history.",
    myProfile: "My Profile",
    myListings: "My Active Listings",
    scanHistory: "Disease Diagnostic History",
    markSold: "Mark as Sold",
    noListings: "You have no active listings on the marketplace.",
    noHistory: "No diagnostic history found.",
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
    cropsTitle: "फसल वैज्ञानिक मार्गदर्शिका",
    cropsSub: "डेटाबेस से वैज्ञानिक खेती के तरीके, मौसमी विवरण और सिंचाई सलाह देखें।",
    season: "मौसम",
    soil: "मिट्टी का प्रकार",
    water: "पानी की आवश्यकता",
    fertilizer: "उर्वरक सलाह",
    viewDetails: "विवरण देखें",
    cropDetailsTitle: "फसल प्रबंधन प्रोटोकॉल",
    sowingSeason: "बुवाई का मौसम",
    soilPreparation: "मिट्टी की तैयारी",
    irrigationSchedule: "सिंचाई कार्यक्रम",
    nutrientManagement: "पोषक तत्व और उर्वरक प्रबंधन",
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
    weatherTitle: "मौसम सलाहकार",
    weatherSub: "फसल योजना के लिए मौसम की स्थिति और कृषि सलाह जानें।",
    searchCity: "शहर का नाम दर्ज करें",
    checkWeather: "पूर्वानुमान प्राप्त करें",
    temp: "तापमान",
    humidity: "आर्द्रता",
    wind: "हवा की गति",
    advice: "विशेषज्ञ सलाह",
    simulatorTitle: "एआई फसल रोग स्कैनर",
    simulatorDesc: "हमारे एआई रोग निदान इंजन का परीक्षण करने के लिए फसल की पत्ती की तस्वीर अपलोड करें या मॉडल फसल चुनें।",
    simSelectCrop: "मॉडल फसल चुनकर टेस्ट करें:",
    simCuring: "जैविक उपचार और समाधान:",
    simConfidence: "एआई सटीकता (Confidence)",
    simPlaceholder: "रोग की जांच करने के लिए पत्ती की फोटो अपलोड करें या मॉडल चुनें।",
    simScanning: "एआई द्वारा रोग की जांच की जा रही है...",
    uploadFile: "पत्ती की फोटो अपलोड करें",
    fullName: "पूरा नाम",
    email: "ईमेल आईडी",
    password: "पासवर्ड",
    phone: "मोबाइल नंबर",
    role: "मेरा रोल है...",
    farmer: "किसान",
    buyer: "खरीदार / व्यापारी",
    hasAccount: "पहले से खाता है? लॉगिन करें",
    noAccount: "खाता नहीं है? पंजीकरण करें",
    dashboardTitle: "किसान डैशबोर्ड",
    dashboardSub: "अपनी प्रोफ़ाइल, मंडी सूचियां प्रबंधित करें और पुराना रोग निदान इतिहास देखें।",
    myProfile: "मेरी प्रोफ़ाइल",
    myListings: "मेरी सक्रिय सूचियां",
    scanHistory: "रोग निदान इतिहास (Scans)",
    markSold: "बेचा गया (Mark Sold)",
    noListings: "मंडी बाजार में आपकी कोई सक्रिय फसल सूची नहीं है।",
    noHistory: "कोई पुराना रोग स्कैन इतिहास नहीं मिला।",
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
  const [token, setToken] = useState(localStorage.getItem('km_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('km_user')) || null);
  
  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'assistant', text: 'Hello! I am your Krishi Assistant. Ask me anything about crop diseases, Mandi prices, KCC loans or weather! / नमस्ते! मैं आपका कृषि सहायक हूँ। फसलों की बीमारी, मंडी भाव, KCC लोन या मौसम के बारे में कुछ भी पूछें!' }
  ]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
    alert(lang === 'en' ? 'Logged out successfully!' : 'सफलतापूर्वक लॉगआउट किया गया!');
  };

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
        throw new Error('Chatbot error');
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'assistant', text: lang === 'en' ? 'Sorry, I am facing connectivity issues.' : 'क्षमा करें, वर्तमान में कोई संपर्क विफलता है।' }]);
    }
  };

  const t = localizations[lang];

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Navbar 
          lang={lang} 
          setLang={setLang} 
          token={token} 
          user={user} 
          handleLogout={handleLogout} 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          t={t} 
        />

        {/* Alerts Scrolling Ticker */}
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

        {/* Page Switcher Route mappings */}
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home user={user} t={t} lang={lang} />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/disease" element={<Disease lang={lang} token={token} t={t} />} />
            <Route path="/weather" element={<Weather lang={lang} t={t} />} />
            <Route path="/loans" element={<Loans lang={lang} token={token} user={user} t={t} />} />
            <Route path="/marketplace" element={<Marketplace lang={lang} token={token} user={user} t={t} />} />
            <Route path="/login" element={<Login lang={lang} setToken={setToken} setUser={setUser} t={t} />} />
          </Routes>
        </div>

        {/* Floating Chatbot Assistant */}
        {showChatbot ? (
          <div className="chatbot-window" style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000, background: 'white', width: '320px', height: '420px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div className="chatbot-header" style={{ background: 'var(--primary-dark)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🤖 Krishi AI Assistant</strong>
              <button onClick={() => setShowChatbot(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <div className="chatbot-messages" style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC' }}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--primary-light)' : 'white', color: msg.sender === 'user' ? 'white' : 'var(--text-dark)', padding: '0.65rem 0.85rem', borderRadius: '12px', maxWidth: '85%', fontSize: '0.88rem', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', border: msg.sender === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)', textAlign: 'left', lineHeight: '1.45' }}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleChatbotSubmit} style={{ display: 'flex', padding: '0.75rem', borderTop: '1px solid var(--border-color)', gap: '0.5rem', background: 'white' }}>
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Ask crop advisory...' : 'कृषि सलाह पूछें...'} 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                style={{ flexGrow: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.88rem', fontFamily: 'var(--sans)' }}
              />
              <button type="submit" style={{ padding: '0.6rem 1rem', background: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'en' ? 'Send' : 'भेजें'}
              </button>
            </form>
          </div>
        ) : (
          <button 
            className="chatbot-toggle" 
            onClick={() => setShowChatbot(true)}
            title={lang === 'en' ? 'Chat with Krishi Assistant' : 'कृषि सहायक से चैट करें'}
            style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
          >
            💬
          </button>
        )}

        <Footer />
      </div>
    </Router>
  );
}

export default App;
