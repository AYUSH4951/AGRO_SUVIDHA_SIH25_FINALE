import React, { useState } from "react";
import "../styles/Settings_language.css";

export default function App() {
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Normal");
  const [voiceAssistantOn, setVoiceAssistantOn] = useState(true);

  const handleChangeLanguage = () => {
    // demo: toggle between English and Hindi
    setLanguage((prev) => (prev === "English" ? "Hindi" : "English"));
  };

  const handleChangeFont = () => {
    // demo: cycle through a few options
    setFontSize((prev) => {
      if (prev === "Normal") return "Large";
      if (prev === "Large") return "Extra Large";
      return "Normal";
    });
  };

  return (
    <div className="app">

      <main className="page">

        <section className="card">

          {/* Header */}
          <div className="card-header">
            <div className="settings-icon">
              <span>🌐</span>
            </div>
            <div>
              <h1 className="card-title">Language &amp; Accessibility</h1>
              <p className="card-subtitle">
                Customize your app experience
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="divider" />

          {/* Font Size row */}
          <div className="settings-row">
            <div className="settings-label">Font Size</div>
            <div className="settings-right">
              <button
                type="button"
                className="dropdown-pill"
                onClick={handleChangeFont}
              >
                <span>{fontSize}</span>
                <span className="chevron">⌄</span>
              </button>
            </div>
          </div>

          {/* Voice Assistant row */}
          <div className="settings-row settings-row-column">
            <div>
              <div className="settings-label">Voice Assistant</div>
              <p className="settings-description">
                Enable voice commands and responses
              </p>
            </div>
            <div className="settings-right">
              <div
                className={`toggle ${voiceAssistantOn ? "on" : "off"}`}
                onClick={() => setVoiceAssistantOn((v) => !v)}
              >
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
