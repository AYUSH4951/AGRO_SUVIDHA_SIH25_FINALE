// src/pages/LanguageProfile.jsx
import React, { useState } from "react";
import "../styles/LanguageProfile.css";

export default function LanguageProfile() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "mr", label: "मराठी" },
    { code: "gu", label: "ગુજરાતી" },
  ];

  return (
    <div className="lp-container">
      <div className="lp-card">
        <h1 className="lp-title">Select Language</h1>
        <p className="lp-subtitle">Choose your preferred language</p>

        <div className="lp-language-list">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={
                selectedLanguage === lang.code
                  ? "lp-lang-btn active"
                  : "lp-lang-btn"
              }
              onClick={() => setSelectedLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {selectedLanguage && (
          <div className="lp-selected-box">
            You selected: <strong>{selectedLanguage}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
