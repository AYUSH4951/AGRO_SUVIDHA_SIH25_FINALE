// src/pages/RoleSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/RoleSelect.css";

// Button Component
const Button = ({ children, onClick, className, variant }) => {
  const baseClass = variant === "ghost" ? "btn-ghost" : "btn-primary";
  return (
    <button onClick={onClick} className={`btn ${baseClass} ${className || ""}`}>
      {children}
    </button>
  );
};

// Card Components
const Card = ({ children, className, onClick }) => {
  return (
    <div onClick={onClick} className={`card ${className || ""}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`card-content ${className || ""}`}>{children}</div>;
};

function RoleSelection({ onRoleSelect, onBack }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Select Your Role",
      subtitle: "Choose how you want to use Agro Suvidha",
      farmer: {
        title: "Farmer",
        description:
          "I am a farmer looking for agricultural guidance and solutions",
        features: [
          "Crop disease diagnosis",
          "Market price updates",
          "Soil quality analysis",
          "AI chatbot assistance",
        ],
      },
      fieldOfficer: {
        title: "Field Officer",
        description: "I am a field officer managing multiple farms and farmers",
        features: [
          "Manage multiple farmers",
          "Monitor farm activities",
          "Generate reports",
          "Provide expert guidance",
        ],
      },
      back: "Back",
      continueAs: "Continue as",
    },
    hi: {
      title: "अपनी भूमिका चुनें",
      subtitle: "आप एग्रो सुविधा का उपयोग कैसे करना चाहते हैं, चुनें",
      farmer: {
        title: "किसान",
        description:
          "मैं किसान हूँ और खेती से जुड़ी सलाह और समाधान चाहता हूँ",
        features: [
          "फसल रोग की पहचान",
          "मंडी भाव जानकारी",
          "मिट्टी की गुणवत्ता विश्लेषण",
          "एआई चैटबॉट सहायता",
        ],
      },
      fieldOfficer: {
        title: "फील्ड ऑफिसर",
        description:
          "मैं फील्ड ऑफिसर हूँ और कई खेतों व किसानों का प्रबंधन करता हूँ",
        features: [
          "कई किसानों का प्रबंधन",
          "खेत की गतिविधियों की निगरानी",
          "रिपोर्ट तैयार करना",
          "विशेषज्ञ मार्गदर्शन देना",
        ],
      },
      back: "वापस",
      continueAs: "जारी रखें",
    },
    bn: {
      title: "আপনার ভূমিকা নির্বাচন করুন",
      subtitle: "আপনি কীভাবে অ্যাগ্রো সুবিধা ব্যবহার করতে চান তা নির্বাচন করুন",
      farmer: {
        title: "কৃষক",
        description:
          "আমি একজন কৃষক এবং কৃষি সংক্রান্ত পরামর্শ ও সমাধান চাই",
        features: [
          "ফসল রোগ নির্ণয়",
          "বাজার মূল্যের আপডেট",
          "মাটির গুণমান বিশ্লেষণ",
          "এআই চ্যাটবট সহায়তা",
        ],
      },
      fieldOfficer: {
        title: "ফিল্ড অফিসার",
        description:
          "আমি একজন ফিল্ড অফিসার এবং একাধিক খামার ও কৃষক পরিচালনা করি",
        features: [
          "একাধিক কৃষক পরিচালনা",
          "খামারের কার্যক্রম মনিটর",
          "রিপোর্ট তৈরি",
          "বিশেষজ্ঞ পরামর্শ প্রদান",
        ],
      },
      back: "ফিরে যান",
      continueAs: "চালিয়ে যান",
    },
    pa: {
      title: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
      subtitle: "ਤੁਸੀਂ ਐਗਰੋ ਸੁਵਿਧਾ ਕਿਵੇਂ ਵਰਤਣਾ ਚਾਹੁੰਦੇ ਹੋ, ਚੁਣੋ",
      farmer: {
        title: "ਕਿਸਾਨ",
        description:
          "ਮੈਂ ਕਿਸਾਨ ਹਾਂ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਬੰਧੀ ਰਹਿਨੁਮਾਈ ਅਤੇ ਹੱਲ ਚਾਹੀਦੇ ਹਨ",
        features: [
          "ਫਸਲ ਬਿਮਾਰੀ ਦੀ ਪਹਿਚਾਣ",
          "ਮੰਡੀ ਭਾਅ ਅੱਪਡੇਟ",
          "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਵਿਸ਼ਲੇਸ਼ਣ",
          "ਏਆਈ ਚੈਟਬੋਟ ਸਹਾਇਤਾ",
        ],
      },
      fieldOfficer: {
        title: "ਫੀਲਡ ਅਫਸਰ",
        description:
          "ਮੈਂ ਫੀਲਡ ਅਫਸਰ ਹਾਂ ਅਤੇ ਕਈ ਖੇਤਾਂ ਅਤੇ ਕਿਸਾਨਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਦਾ ਹਾਂ",
        features: [
          "ਕਈ ਕਿਸਾਨਾਂ ਦਾ ਪ੍ਰਬੰਧਨ",
          "ਖੇਤੀ ਗਤੀਵਿਧੀਆਂ ਦੀ ਨਿਗਰਾਨੀ",
          "ਰਿਪੋਰਟਾਂ ਤਿਆਰ ਕਰਨਾ",
          "ਵਿਸ਼ੇਸ਼ਗਿਆਨ ਰਹਿਨੁਮਾਈ",
        ],
      },
      back: "ਵਾਪਸ",
      continueAs: "ਤੋਂ ਜਾਰੀ ਰੱਖੋ",
    },
  };

  const t = translations[language] || translations.en;

  const handleRoleSelect = (role) => {
    if (onRoleSelect) onRoleSelect(role);

    if (role === "farmer") {
      navigate("/login");
    } else if (role === "officer") {
      navigate("/loginofficer");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/language");
    }
  };

  return (
    <div className="min-h-screen">
      {/* HEADER SECTION */}
      <div className="header-section">
        <Button variant="ghost" onClick={handleBack} className="back-button">
          ← {t.back}
        </Button>

        <h2 className="select-role-text">{t.title}</h2>
      </div>

      {/* ROLE PANELS */}
      <div className="content-wrapper">
        <div className="cards-container">
          {/* FARMER PANEL */}
          <Card
            className="role-card farmer-card"
            onClick={() => handleRoleSelect("farmer")}
          >
            <CardContent className="card-padding">
              <div className="card-header">
                <div className="icon-wrapper farmer-icon">
                  <User className="icon" />
                </div>
                <h2 className="card-title">{t.farmer.title}</h2>
                <p className="card-description">{t.farmer.description}</p>
              </div>

              <div className="features-list">
                {t.farmer.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="tick-circle">✓</div>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="continue-btn farmer-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect("farmer");
                }}
              >
                {t.continueAs} {t.farmer.title}
              </Button>
            </CardContent>
          </Card>

          {/* FIELD OFFICER PANEL */}
          <Card
            className="role-card officer-card"
            onClick={() => handleRoleSelect("officer")}
          >
            <CardContent className="card-padding">
              <div className="card-header">
                <div className="icon-wrapper officer-icon">
                  <Users className="icon" />
                </div>
                <h2 className="card-title">{t.fieldOfficer.title}</h2>
                <p className="card-description">
                  {t.fieldOfficer.description}
                </p>
              </div>

              <div className="features-list">
                {t.fieldOfficer.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="tick-circle">✓</div>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="continue-btn officer-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect("officer");
                }}
              >
                {t.continueAs} {t.fieldOfficer.title}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
