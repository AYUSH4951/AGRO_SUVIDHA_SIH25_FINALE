import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useTranslation } from "react-i18next";

import bgImage from "../assets/Gemini_Generated_Image_5ux9x95ux9x95ux9.png";
import logo from "../assets/leaf img.png";

function Home() {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bgImage})` }}
      key={i18n.language}
    >
      <Link to="/dashboard" className="skip-btn">
        {t("Skip To Dashboard")}
      </Link>

      <div className="home-content">
        <img src={logo} alt="logo" className="logo-img" />
        <h1 className="product-text">{t("Agro Suvidha")}</h1>
        <h2 className="home-title">{t("THE NEW ERA OF")}</h2>
        <h2 className="home-title">{t("AGRICULTURE ADVISORY")}</h2>

        <p className="home-subtext">
          {t("")}
        </p>

        <Link to="/language" className="get-started-btn">
          {t("Get Started")}
        </Link>
      </div>
    </div>
  );
}

export default Home;
