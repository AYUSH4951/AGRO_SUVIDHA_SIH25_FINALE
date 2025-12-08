import React from "react";
import "../styles/Privacy.css";


export default function App() {
  const handleViewData = () => {
    alert("Opening saved data (demo only).");
  };

  const handleClearHistory = () => {
    const ok = window.confirm("Clear history? (demo only)");
    if (ok) alert("History cleared (demo only).");
  };

  const handleResetApp = () => {
    const ok = window.confirm("Reset all settings? (demo only)");
    if (ok) alert("App reset (demo only).");
  };

  const openPrivacyPolicy = () => {
    alert("Open Privacy Policy (demo only).");
  };

  const openTerms = () => {
    alert("Open Terms of Service (demo only).");
  };

  return (
    <div className="app">
      <main className="page">
        <section className="card">
          {/* Header */}
          <div className="card-header">
            <div className="shield-icon">
              <span>🛡️</span>
            </div>
            <div>
              <h1 className="card-title">Privacy &amp; Data</h1>
              <p className="card-subtitle">Manage your data and privacy</p>
            </div>
          </div>

          {/* Manage Saved Data */}
          <div className="privacy-row">
            <div className="privacy-left">
              <div className="privacy-title">Manage Saved Data</div>
              <p className="privacy-desc">
                View and manage your stored information
              </p>
            </div>
            <div className="privacy-right">
              <button
                type="button"
                className="pill-btn"
                onClick={handleViewData}
              >
                <span className="pill-icon">🗄️</span>
                <span>View</span>
              </button>
            </div>
          </div>

          {/* Clear History */}
          <div className="privacy-row">
            <div className="privacy-left">
              <div className="privacy-title">Clear History</div>
              <p className="privacy-desc">
                Remove chat and search history
              </p>
            </div>
            <div className="privacy-right">
              <button
                type="button"
                className="pill-btn"
                onClick={handleClearHistory}
              >
                <span className="pill-icon">🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Reset App */}
          <div className="privacy-row">
            <div className="privacy-left">
              <div className="privacy-title">Reset App</div>
              <p className="privacy-desc">
                Reset all settings to default
              </p>
            </div>
            <div className="privacy-right">
              <button
                type="button"
                className="pill-btn"
                onClick={handleResetApp}
              >
                <span className="pill-icon">🔄</span>
                <span>Reset</span>
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* Legal links */}
          <button
            type="button"
            className="legal-row"
            onClick={openPrivacyPolicy}
          >
            <span className="legal-left">
              <span className="legal-icon">📄</span>
              <span className="legal-text">Privacy Policy</span>
            </span>
            <span className="legal-chevron">›</span>
          </button>

          <button type="button" className="legal-row" onClick={openTerms}>
            <span className="legal-left">
              <span className="legal-icon">📄</span>
              <span className="legal-text">Terms of Service</span>
            </span>
            <span className="legal-chevron">›</span>
          </button>
        </section>
      </main>
    </div>
  );
}