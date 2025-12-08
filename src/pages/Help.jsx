import React from "react";
import "../styles/Help.css"; 

export default function Help() {
  const openFAQ = () => {
    alert("Open FAQ (demo only).");
  };

  const callSupport = () => {
    alert("Calling support… (demo only).");
  };

  const whatsappSupport = () => {
    alert("Opening WhatsApp support… (demo only).");
  };

  const emailSupport = () => {
    alert("Opening email client… (demo only).");
  };

  const openAbout = () => {
    alert("Open About Agro Suvidha (demo only).");
  };

  const openCredits = () => {
    alert("Open Credits & Acknowledgments (demo only).");
  };

  return (
    <div className="help-app">
      <main className="help-page">
        <section className="help-card">
          {/* Header */}
          <div className="help-header">
            <div className="help-header-icon">
              <span>❓</span>
            </div>
            <div>
              <h1 className="help-title">Help &amp; Support</h1>
              <p className="help-subtitle">Get help and learn more</p>
            </div>
          </div>

          {/* FAQ row */}
          <div className="help-row">
            <div className="help-row-left">
              <div className="help-row-title">Frequently Asked Questions</div>
              <p className="help-row-desc">
                Find answers to common questions
              </p>
            </div>
            <div className="help-row-right">
              <button type="button" className="help-pill-btn" onClick={openFAQ}>
                <span className="help-pill-icon">❔</span>
                <span>View</span>
              </button>
            </div>
          </div>

          <hr className="help-divider" />

          {/* Contact support */}
          <div className="help-section">
            <div className="help-row-title">Contact Support</div>
            <p className="help-row-desc">
              Get help from our support team
            </p>

            <div className="help-contact-actions">
              <button
                type="button"
                className="help-contact-btn"
                onClick={callSupport}
              >
                <span className="help-contact-icon">📞</span>
                <span>Call Support</span>
              </button>

              <button
                type="button"
                className="help-contact-btn"
                onClick={emailSupport}
              >
                <span className="help-contact-icon">✉️</span>
                <span>Email Support</span>
              </button>
            </div>
          </div>

          <hr className="help-divider" />

          {/* About row */}
          <div className="help-row">
            <div className="help-row-left">
              <div className="help-row-title">About Agro Suvidha</div>
              <p className="help-row-desc">
                Learn more about the app
              </p>
            </div>
            <div className="help-row-right">
              <button
                type="button"
                className="help-pill-btn"
                onClick={openAbout}
              >
                <span className="help-pill-icon">ℹ️</span>
                <span>View</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="help-footer">
            <div className="help-version">Version 1.0.0</div>
            <button
              type="button"
              className="help-credits-link"
              onClick={openCredits}
            >
              Credits &amp; Acknowledgments
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}