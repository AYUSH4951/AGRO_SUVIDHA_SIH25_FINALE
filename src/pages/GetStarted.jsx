import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/leaflogo.png";
import "../styles/LanguageSelect.css";

export default function GetStarted() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="lang-page">
      <div className="lang-header">
        <img src={logo} alt="App Logo" className="app-logo" />
        <h1 className="app-title">{t ? t("appName") : "Agro Suvidha"}</h1>
      </div>

      <div className="lang-content">
        <div className="lang-card-container">
          <div className="lang-title">
            <h2>{t ? t("welcomeTitle") : "Welcome to Agro Suvidha"}</h2>
            <p>{t ? t("welcomeDesc") : "A farmer's digital companion."}</p>
          </div>

          <button
            className="lang-btn active"
            onClick={() => navigate("/language")}
          >
            {t ? t("getStartedBtn") : "Get Started"}
          </button>

          <p className="lang-help-text">{t ? t("helpText") : ""}</p>
        </div>
      </div>

      <div className="lang-footer">{t ? t("footerText") : "Agro Suvidha"}</div>
    </div>
  );
}
