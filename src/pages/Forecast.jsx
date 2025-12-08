import React, { useEffect, useState } from "react";
import "../styles/Forecast.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, Sprout, Sun, Settings, Globe } from "lucide-react";
import "../styles/Weather.css"; // already used for navbar styles
import * as Icons from "lucide-react";

// -----------------------------
// TRANSLATIONS
// -----------------------------
const translations = {
  en: {
    weather: {
      title: "Weather Dashboard",
      currentWeather: "Current Weather",
      forecast: "7-Day Forecast",
      smartPrediction: "3-Day Smart Prediction",
      farmingAdvice: "Farming Advice",
      humidity: "Humidity",
      windSpeed: "Wind",
      pressure: "Pressure",
      visibility: "Visibility",
      uvIndex: "UV Index",
      today: "Today",
      tomorrow: "Tomorrow",
      lastUpdated: "Last updated",
    },
  },
  hi: {
    weather: {
      title: "मौसम डैशबोर्ड",
      currentWeather: "वर्तमान मौसम",
      forecast: "7-दिन का पूर्वानुमान",
      smartPrediction: "3-दिन का स्मार्ट पूर्वानुमान",
      farmingAdvice: "कृषि सलाह",
      humidity: "आर्द्रता",
      windSpeed: "हवा",
      pressure: "दबाव",
      visibility: "दृश्यता",
      uvIndex: "यूवी इंडेक्स",
      today: "आज",
      tomorrow: "कल",
      lastUpdated: "अंतिम अपडेट",
    },
  },
};

// -----------------------------
// WEATHER CODE → ICON + DESCRIPTION
// -----------------------------
function getWeatherInfoFromCode(code) {
  const weatherMap = {
    0: { description: "Clear sky", icon: "Sun" },
    1: { description: "Mainly clear", icon: "Sun" },
    2: { description: "Partly cloudy", icon: "CloudSun" },
    3: { description: "Overcast", icon: "Cloud" },
    45: { description: "Fog", icon: "CloudFog" },
    48: { description: "Rime fog", icon: "CloudFog" },
    51: { description: "Drizzle", icon: "CloudDrizzle" },
    61: { description: "Rain", icon: "CloudRain" },
    80: { description: "Rain showers", icon: "CloudRain" },
    95: { description: "Thunderstorm", icon: "CloudLightning" },
  };
  return weatherMap[code] || { description: "Clear", icon: "Sun" };
}

// -----------------------------
// OPTION A – SIMPLE TREND-BASED PREDICTION ENGINE
// -----------------------------
function predictNext3Days(current, daily) {
  const trend = [];
  const tempToday = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m;

  for (let i = 1; i <= 3; i++) {
    let prediction = { day: i, text: "" };

    if (humidity > 70 && daily.weather_code[i] >= 2) {
      prediction.text = "High chance of rain due to humidity and cloud cover.";
    } else if (wind > 25) {
      prediction.text = "High winds detected; storm chances may increase.";
    } else if (daily.temperature_2m_max[i] > tempToday + 2) {
      prediction.text = "Temperature rising — expect a hotter day.";
    } else {
      prediction.text = "Stable weather expected.";
    }

    trend.push(prediction);
  }

  return trend;
}

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function Forecast() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

  const [language, setLanguage] = useState("en");
  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("--");

  async function fetchWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    setCurrent(data.current);
    setDaily(data.daily);
    setPrediction(predictNext3Days(data.current, data.daily));
    setLastUpdated(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(24.1, 88.25)
      );
    } else {
      fetchWeather(24.1, 88.25);
    }
  }, []);

  if (!current || !daily)
    return <div className="forecast-loading">Loading...</div>;

  const trans = translations[language].weather;
  const weatherInfo = getWeatherInfoFromCode(current.weather_code);

  const WeatherIcon = Icons[weatherInfo.icon];

  return (
    <div className="forecast-page">
      {/* LANGUAGE DROPDOWN 
      <div className="forecast-language-selector">
        <select
          className="forecast-language-dropdown"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </div>*/}

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div className="brand-text">
            <div className="brand-title">AgroSubhidha</div>
            <div className="brand-subtitle">
              Farmer&apos;s Digital Companion
            </div>
          </div>
        </div>

        <div className="nav-pill">
          <button
            className={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            <HomeIcon />
            <span className="nav-label">Home</span>
          </button>
          <button
            className={isActive("/manager")}
            onClick={() => navigate("/manager")}
          >
            <Sprout />
            <span className="nav-label">Crops</span>
          </button>
          <button
            className={isActive("/weather")}
            onClick={() => navigate("/weather")}
          >
            <Sun />
            <span className="nav-label">Weather</span>
          </button>
          <button
            className={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            <Settings />
            <span className="nav-label">Settings</span>
          </button>

          <button
            className={isActive("/language")}
            onClick={() => navigate("/language")}
          >
            <Globe />
            <span className="nav-label">Language</span>
          </button>
          <button
            className={isActive("/about")}
            onClick={() => navigate("/about")}
          >
            <Globe />
            <span className="nav-label">About Us</span>
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="forecast-dashboard">
        <h1 className="forecast-dashboard-title">{trans.title}</h1>
        <p className="forecast-last-updated">
          {trans.lastUpdated}: {lastUpdated}
        </p>

        {/* CURRENT WEATHER */}
        <div className="forecast-card">
          <h2 className="forecast-card-title">
            <Icons.Sun className="forecast-icon-md" />
            {trans.currentWeather}
          </h2>

          <div className="forecast-current-weather">
            <WeatherIcon className="forecast-weather-main-icon" />

            <div>
              <p className="forecast-temperature">
                {Math.round(current.temperature_2m)}°C
              </p>
              <p className="forecast-condition">{weatherInfo.description}</p>
              <p className="forecast-feels">
                Feels like {Math.round(current.apparent_temperature)}°C
              </p>
            </div>
          </div>

          <div className="forecast-details-grid">
            <p>
              {trans.humidity}: {current.relative_humidity_2m}%
            </p>
            <p>
              {trans.windSpeed}: {current.wind_speed_10m} km/h
            </p>
            <p>
              {trans.pressure}: {current.pressure_msl} hPa
            </p>
            <p>
              {trans.visibility}: {(current.visibility / 1000).toFixed(1)} km
            </p>
            <p>
              {trans.uvIndex}: {daily.uv_index_max[0]}
            </p>
            <p>Dew Point: {Math.round(current.dew_point_2m)}°C</p>
          </div>
        </div>

        {/* 7-DAY FORECAST */}
        <div className="forecast-card">
          <h2 className="forecast-card-title">
            <Icons.Calendar className="forecast-icon-md" />
            {trans.forecast}
          </h2>

          <div className="forecast-grid">
            {daily.time.map((date, i) => {
              const info = getWeatherInfoFromCode(daily.weather_code[i]);
              const Icon = Icons[info.icon];

              return (
                <div key={i} className="forecast-grid-item">
                  <p className="forecast-day">
                    {i === 0
                      ? trans.today
                      : i === 1
                      ? trans.tomorrow
                      : new Date(date).toLocaleDateString("en", {
                          weekday: "short",
                        })}
                  </p>

                  <Icon className="forecast-grid-icon" />

                  <p className="forecast-temp">
                    {Math.round(daily.temperature_2m_max[i])}°C /
                    {Math.round(daily.temperature_2m_min[i])}°C
                  </p>

                  <p className="forecast-condition-small">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-DAY SMART PREDICTION */}
        <div className="forecast-card">
          <h2 className="forecast-card-title">
            <Icons.Radar className="forecast-icon-md" />
            {trans.smartPrediction}
          </h2>

          <div className="forecast-prediction-list">
            {prediction.map((p, idx) => (
              <div key={idx} className="forecast-prediction-item">
                <strong>Day {p.day}:</strong> {p.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}