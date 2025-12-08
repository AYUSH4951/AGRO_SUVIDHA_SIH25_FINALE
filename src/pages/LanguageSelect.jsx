// src/pages/LanguageSelect.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/LanguageSelect.css";

import logo from "../assets/leaflogo.png";
import namasteImg from "../assets/img4-removebg-preview.png";

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export default function LanguageSelect() {
  const { setLanguage, language, t } = useLanguage();
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState(language || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selected) {
      setLanguage(selected);
    }
  }, [selected, setLanguage]);

  function onCardClick(code) {
    setSelected(code);
  }

  return (
    <div className="lang-page">
      {/* Header + Logo */}
      <div className="lang-header">
        <img src={logo} alt="App Logo" className="app-logo" />
        <h1 className="app-title">{t("appName")}</h1>
        <div className="lang-badge">{t("stepText")}</div>
      </div>

      {/* Center Content */}
      <div className="lang-content">
        <div className="lang-card-container">

          <div className="lang-namaste">
            <img src={namasteImg} alt="Namaste" />
            <h1>{t("greeting")}</h1>
            <div className="lang-line"></div>
          </div>

          <div className="lang-title">
            <h2>{t("chooseLang")}</h2>
            <p>{t("chooseLangDesc")}</p>
          </div>

          <div className="lang-languages">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`lang-card ${selected === lang.code ? "selected" : ""}`}
                onClick={() => onCardClick(lang.code)}
              >
                <div className="lang-left">
                  <h3>{lang.name}</h3>
                  <p>{lang.native}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`lang-btn ${selected ? "active" : ""}`}
            onClick={() => {
              if (!selected) return;
              // If user is already logged in, return to dashboard.
              if (currentUser) navigate("/dashboard");
              else navigate("/role-select");
            }}
            disabled={!selected}
          >
            {t("continueBtn")}
          </button>

          <p className="lang-help-text">{t("helpText")}</p>
        </div>
      </div>

      <div className="lang-footer">
        {t("footerText")}
      </div>
    </div>
  );
}
