import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, Sprout, Sun, Settings, Globe } from "lucide-react";
import "../styles/Weather.css";
import "../styles/AboutUs.css";
import { useLanguage } from "../context/LanguageContext";

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
    brandSubtitle: "किसान का डिजिटल साथी",
    navHome: "होम",
    navCrops: "फसलें",
    navWeather: "मौसम",
    navSettings: "सेटिंग्स",
    navLanguage: "भाषा",
    navAbout: "हमारे बारे में",
    title: "हमारे बारे में",
    description:
      "फार्म मैनेजर में आपका स्वागत है, स्मार्ट खेती के लिए आपका विश्वसनीय साथी। हमारा प्लेटफॉर्म किसानों को मौसम की निगरानी, फसल प्रबंधन, कार्यों की ट्रैकिंग और उत्पादकता बढ़ाने के लिए बेहतर निर्णय लेने में मदद करता है।",
    mission:
      "हमारा लक्ष्य किसानों को आधुनिक टूल, सटीक जानकारी और तकनीक आधारित समाधानों से सशक्त बनाना है, जिससे खेती आसान और अधिक टिकाऊ बन सके।",
    contactTitle: "संपर्क करें",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "सिलीगुड़ी, भारत",
    feedbackTitle: "प्रतिक्रिया",
    feedbackPlaceholder: "अपनी प्रतिक्रिया यहाँ लिखें...",
    feedbackButton: "प्रतिक्रिया भेजें",
    footer: "टीम BLACK SYNTEX द्वारा बनाया गया",
  },
  bn: {
    brandTitle: "এগ্রো সুবিধা",
    brandSubtitle: "কৃষকের ডিজিটাল সঙ্গী",
    navHome: "হোম",
    navCrops: "ফসল",
    navWeather: "আবহাওয়া",
    navSettings: "সেটিংস",
    navLanguage: "ভাষা",
    navAbout: "আমাদের সম্পর্কে",
    title: "আমাদের সম্পর্কে",
    description:
      "ফার্ম ম্যানেজারে স্বাগতম, স্মার্ট কৃষির জন্য আপনার বিশ্বস্ত সঙ্গী। আমাদের প্ল্যাটফর্ম কৃষকদের আবহাওয়া পর্যবেক্ষণ, ফসল ব্যবস্থাপনা, কাজ ট্র্যাক করা এবং উৎপাদনশীলতা বাড়াতে সঠিক সিদ্ধান্ত নিতে সাহায্য করে।",
    mission:
      "আমাদের লক্ষ্য আধুনিক টুল, নির্ভুল তথ্য এবং প্রযুক্তি নির্ভর সমাধানের মাধ্যমে কৃষকদের শক্তিশালী করে তোলা, যাতে কৃষিকাজ আরও সহজ এবং টেকসই হয়।",
    contactTitle: "যোগাযোগ করুন",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "শিলিগুড়ি, ভারত",
    feedbackTitle: "মতামত",
    feedbackPlaceholder: "আপনার মতামত এখানে লিখুন...",
    feedbackButton: "মতামত পাঠান",
    footer: "টিম BLACK SYNTEX দ্বারা নির্মিত",
  },
  pa: {
    brandTitle: "ਐਗਰੋ ਸੁਵਿਧਾ",
    brandSubtitle: "ਕਿਸਾਨ ਦਾ ਡਿਜ਼ਿਟਲ ਸਾਥੀ",
    navHome: "ਘਰ",
    navCrops: "ਫਸਲਾਂ",
    navWeather: "ਮੌਸਮ",
    navSettings: "ਸੈਟਿੰਗਜ਼",
    navLanguage: "ਭਾਸ਼ਾ",
    navAbout: "ਸਾਡੇ ਬਾਰੇ",
    title: "ਸਾਡੇ ਬਾਰੇ",
    description:
      "ਫਾਰਮ ਮੈਨੇਜਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ, ਸਮਾਰਟ ਖੇਤੀ ਲਈ ਤੁਹਾਡਾ ਭਰੋਸੇਮੰਦ ਸਾਥੀ। ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਕਿਸਾਨਾਂ ਨੂੰ ਮੌਸਮ ਦੇਖਣ, ਫਸਲਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨ, ਕੰਮ ਟਰੈਕ ਕਰਨ ਅਤੇ ਉਤਪਾਦਕਤਾ ਵਧਾਉਣ ਲਈ ਸੋਚ-ਸਮਝ ਕੇ ਫੈਸਲੇ ਲੈਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    mission:
      "ਸਾਡਾ ਮਿਸ਼ਨ ਕਿਸਾਨਾਂ ਨੂੰ ਆਧੁਨਿਕ ਟੂਲ, ਸਹੀ ਜਾਣਕਾਰੀ ਅਤੇ ਤਕਨਾਲੋਜੀ-ਅਧਾਰਿਤ ਹੱਲਾਂ ਨਾਲ ਸਸ਼ਕਤ ਕਰਨਾ ਹੈ, ਤਾਂ ਜੋ ਖੇਤੀ ਆਸਾਨ ਅਤੇ ਜ਼ਿਆਦਾ ਟਿੱਕਾਊ ਬਣ ਸਕੇ।",
    contactTitle: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    phone: "+91 98765 43210",
    email: "farmmanager@gmail.com",
    location: "ਸਿਲਿਗੁਰੀ, ਭਾਰਤ",
    feedbackTitle: "ਫੀਡਬੈਕ",
    feedbackPlaceholder: "ਇੱਥੇ ਆਪਣਾ ਫੀਡਬੈਕ ਲਿਖੋ...",
    feedbackButton: "ਫੀਡਬੈਕ ਭੇਜੋ",
    footer: "ਟੀਮ BLACK SYNTEX ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਗਿਆ",
  },
};

export default function AboutUs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const text = aboutTexts[language] || aboutTexts.en;

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

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
          <button
            className={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            <HomeIcon />
            <span className="nav-label">{text.navHome}</span>
          </button>
          <button
            className={isActive("/manager")}
            onClick={() => navigate("/manager")}
          >
            <Sprout />
            <span className="nav-label">{text.navCrops}</span>
          </button>
          <button
            className={isActive("/weather")}
            onClick={() => navigate("/weather")}
          >
            <Sun />
            <span className="nav-label">{text.navWeather}</span>
          </button>
          <button
            className={isActive("/settings")}
            onClick={() => navigate("/settings")}
          >
            <Settings />
            <span className="nav-label">{text.navSettings}</span>
          </button>

          <button
            className={isActive("/language")}
            onClick={() => navigate("/language")}
          >
            <Globe />
            <span className="nav-label">{text.navLanguage}</span>
          </button>
          <button
            className={isActive("/about")}
            onClick={() => navigate("/about")}
          >
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
          <h2 className="about-title about-small-title">
            {text.contactTitle}
          </h2>

          <div className="about-contact-item">
            {/* Phone */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#059669"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
            </svg>
            <span>{text.phone}</span>
          </div>

          <div className="about-contact-item">
            {/* Email */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#059669"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
            </svg>
            <span>{text.email}</span>
          </div>

          <div className="about-contact-item">
            {/* Location */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#059669"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{text.location}</span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="about-feedback-section">
          <h2 className="about-title about-small-title">
            {text.feedbackTitle}
          </h2>
          <textarea
            rows="4"
            className="about-feedback-textarea"
            placeholder={text.feedbackPlaceholder}
          ></textarea>

          <button type="button" className="about-feedback-btn">
            {text.feedbackButton}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">{text.footer}</div>
    </div>
  );
}
