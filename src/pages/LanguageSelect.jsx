// src/pages/LanguageSelect.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [selected, setSelected] = useState(language || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selected) {
      setLanguage(selected); // "en" | "hi" | "bn" | "pa"
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function onCardClick(code) {
    setSelected(code);
  }

  return (
    <div className="lang-page">
      <div className="lang-header">
        <h1 id="appName">
          <img src={logo} alt="Logo" />
          <span className="app-name-text">{t("appName")}</span>
        </h1>
        <div className="lang-badge" id="stepText">
          {t("stepText")}
        </div>
      </div>

      <div className="lang-content">
        <div className="lang-card-container">
          <div className="lang-namaste">
            <img src={namasteImg} alt="Namaste" />
            <h1 id="greeting">{t("greeting")}</h1>
            <div className="lang-line" />
          </div>

          <div className="lang-title">
            <h2 id="chooseLang">{t("chooseLang")}</h2>
            <p id="chooseLangDesc">{t("chooseLangDesc")}</p>
          </div>

          <div className="lang-languages">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`lang-card ${selected === lang.code ? "selected" : ""}`}
                onClick={() => onCardClick(lang.code)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onCardClick(lang.code);
                }}
              >
                <div className="lang-left">
                  <span className="lang-flag">{lang.flag}</span>
                  <div>
                    <h3>{lang.name}</h3>
                    <p>{lang.native}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            id="continueBtn"
            className={`lang-btn ${selected ? "active" : ""}`}
            onClick={() => navigate("/role-select")}
            disabled={!selected}
            aria-disabled={!selected}
          >
            {t("continueBtn")}
          </button>

          <p className="lang-help-text" id="helpText">
            {t("helpText")}
          </p>
        </div>
      </div>

      <div className="lang-footer" id="footerText">
        {t("footerText")}
      </div>
    </div>
  );
}
