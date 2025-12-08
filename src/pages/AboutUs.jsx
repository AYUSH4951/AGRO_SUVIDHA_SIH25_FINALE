import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, Sprout, Sun, Settings, Globe } from "lucide-react";
import "../styles/Weather.css";
import "../styles/AboutUs.css";
import { useLanguage } from "../context/LanguageContext";

// ✅ FIXED: Correct aboutTexts object (no self-reference)
const aboutTexts = {
  en: {
    brandTitle: "AgroSubhidha",
    brandSubtitle: "Farmer's Digital Companion",
    navHome: "Home",
    navCrops: "Crops",
    navWeather: "Weather",
    navSettings: "Settings",
    navLanguage: "Language",
    navAbout: "About Us",
    title: "About Us",
    description:
      "Welcome to Farm Manager, your trusted companion for smart agriculture. Our platform helps farmers monitor weather, manage crops, track tasks, and make informed decisions to improve productivity.",
    mission:
      "Our mission is to empower farmers with modern tools, accurate insights, and technology-driven solutions that make farming easier and more sustainable.",
    contactTitle: "Contact Us",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "Siliguri, India",
    feedbackTitle: "Feedback",
    feedbackPlaceholder: "Write your feedback here...",
    feedbackButton: "Submit Feedback",
    footer: "Made or Created by Team BLACK SYNTEX",
  },

  hi: {
    brandTitle: "एग्रो सुविधा",
    brandSubtitle: "किसानों का डिजिटल साथी",
    navHome: "होम",
    navCrops: "फसलें",
    navWeather: "मौसम",
    navSettings: "सेटिंग्स",
    navLanguage: "भाषा",
    navAbout: "हमारे बारे में",
    title: "हमारे बारे में",
    description:
      "फार्म मैनेजर एक स्मार्ट कृषि प्लेटफ़ॉर्म है जो किसानों को मौसम, फसलों और दैनिक कार्यों में सहायता करता है।",
    mission:
      "हमारा मिशन किसानों को आधुनिक तकनीक और सटीक जानकारी देकर खेती को आसान और टिकाऊ बनाना है।",
    contactTitle: "संपर्क करें",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "सिलीगुड़ी, भारत",
    feedbackTitle: "प्रतिक्रिया",
    feedbackPlaceholder: "अपनी प्रतिक्रिया यहाँ लिखें...",
    feedbackButton: "सबमिट करें",
    footer: "टीम BLACK SYNTEX द्वारा बनाया गया",
  },

  bn: {
    brandTitle: "এগ্রো সুবিধা",
    brandSubtitle: "কৃষকদের ডিজিটাল সহকারী",
    navHome: "হোম",
    navCrops: "ফসল",
    navWeather: "আবহাওয়া",
    navSettings: "সেটিংস",
    navLanguage: "ভাষা",
    navAbout: "আমাদের সম্পর্কে",
    title: "আমাদের সম্পর্কে",
    description:
      "ফার্ম ম্যানেজার একটি স্মার্ট কৃষি প্ল্যাটফর্ম, যা কৃষকদের আবহাওয়া, ফসল এবং কাজ ব্যবস্থাপনায় সাহায্য করে।",
    mission:
      "আমাদের লক্ষ্য কৃষকদের আধুনিক টুলস এবং প্রযুক্তি দিয়ে আরও সক্ষম করা।",
    contactTitle: "যোগাযোগ",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "শিলিগুড়ি, ভারত",
    feedbackTitle: "প্রতিক্রিয়া",
    feedbackPlaceholder: "আপনার প্রতিক্রিয়া লিখুন...",
    feedbackButton: "সাবমিট",
    footer: "টিম BLACK SYNTEX দ্বারা তৈরি",
  },

  pa: {
    brandTitle: "ਐਗਰੋ ਸੁਵਿਧਾ",
    brandSubtitle: "ਕਿਸਾਨਾਂ ਦਾ ਡਿਜ਼ੀਟਲ ਸਾਥੀ",
    navHome: "ਹੋਮ",
    navCrops: "ਫਸਲਾਂ",
    navWeather: "ਮੌਸਮ",
    navSettings: "ਸੈਟਿੰਗਜ਼",
    navLanguage: "ਭਾਸ਼ਾ",
    navAbout: "ਸਾਡੇ ਬਾਰੇ",
    title: "ਸਾਡੇ ਬਾਰੇ",
    description:
      "ਫਾਰਮ ਮੈਨੇਜਰ ਇੱਕ ਸਮਾਰਟ ਖੇਤੀ ਪ੍ਰਣਾਲੀ ਹੈ ਜੋ ਕਿਸਾਨਾਂ ਨੂੰ ਮੌਸਮ, ਫਸਲ ਅਤੇ ਕੰਮ ਪ੍ਰਬੰਧਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।",
    mission:
      "ਸਾਡਾ ਉਦੇਸ਼ ਨਵੀਂ ਤਕਨਾਲੋਜੀ ਅਤੇ ਸਹੀ ਜਾਣਕਾਰੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਮਜ਼ਬੂਤ ਬਣਾਉਣਾ ਹੈ।",
    contactTitle: "ਸੰਪਰਕ ਕਰੋ",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "ਸਿਲਿਗੁੜੀ, ਭਾਰਤ",
    feedbackTitle: "ਫੀਡਬੈਕ",
    feedbackPlaceholder: "ਆਪਣਾ ਫੀਡਬੈਕ ਲਿਖੋ...",
    feedbackButton: "ਸਬਮਿਟ",
    footer: "ਟੀਮ BLACK SYNTEX ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ",
  },
};

export default function AboutUs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const text = aboutTexts[language] || aboutTexts.en;

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

  // FEEDBACK STATE
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  // Load stored feedback on page load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("feedbackList")) || [];
    setFeedbackList(stored);
  }, []);

  // Update localStorage when feedbackList changes
  useEffect(() => {
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
  }, [feedbackList]);

  const handleSubmitFeedback = () => {
    if (feedback.trim() === "") return;

    const newFeedback = {
      id: Date.now(),
      message: feedback,
      date: new Date().toLocaleString(),
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    setFeedback("");
  };

  return (
    <div className="about-page">
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div className="brand-text">
            <div className="brand-title">{text.brandTitle}</div>
            <div className="brand-subtitle">{text.brandSubtitle}</div>
          </div>
        </div>

        <div className="nav-pill">
          <button className={isActive("/dashboard")} onClick={() => navigate("/dashboard")}>
            <HomeIcon />
            <span className="nav-label">{text.navHome}</span>
          </button>

          <button className={isActive("/manager")} onClick={() => navigate("/manager")}>
            <Sprout />
            <span className="nav-label">{text.navCrops}</span>
          </button>

          <button className={isActive("/weather")} onClick={() => navigate("/weather")}>
            <Sun />
            <span className="nav-label">{text.navWeather}</span>
          </button>

          <button className={isActive("/settings")} onClick={() => navigate("/settings")}>
            <Settings />
            <span className="nav-label">{text.navSettings}</span>
          </button>

          <button className={isActive("/language")} onClick={() => navigate("/language")}>
            <Globe />
            <span className="nav-label">{text.navLanguage}</span>
          </button>

          <button className={isActive("/about")} onClick={() => navigate("/about")}>
            <Globe />
            <span className="nav-label">{text.navAbout}</span>
          </button>
        </div>
      </div>

      {/* About Content */}
      <div className="about-container">
        <h1 className="about-title">{text.title}</h1>

        <p className="about-text">{text.description}</p>
        <p className="about-text">{text.mission}</p>

        {/* Contact Section */}
        <div className="about-contact-section">
          <h2 className="about-title about-small-title">{text.contactTitle}</h2>

          <div className="about-contact-item">📞 <span>{text.phone}</span></div>
          <div className="about-contact-item">📧 <span>{text.email}</span></div>
          <div className="about-contact-item">📍 <span>{text.location}</span></div>
        </div>

        {/* Feedback Section */}
        <div className="about-feedback-section">
          <h2 className="about-title about-small-title">{text.feedbackTitle}</h2>

          <textarea
            rows="4"
            className="about-feedback-textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={text.feedbackPlaceholder}
          ></textarea>

          <button
            type="button"
            className="about-feedback-btn"
            onClick={handleSubmitFeedback}
          >
            {text.feedbackButton}
          </button>

          {/* Feedback List */}
          <div className="feedback-list">
            {feedbackList.length === 0 ? (
              <p className="no-feedback">No feedback submitted yet.</p>
            ) : (
              feedbackList.map((item) => (
                <div className="feedback-item" key={item.id}>
                  <p>{item.message}</p>
                  <span className="feedback-date">{item.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">{text.footer}</div>
    </div>
  );
}
