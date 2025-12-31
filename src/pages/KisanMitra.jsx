// src/pages/KisanMitra.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext"; // ✅ ADDED
import "../styles/KisanMitra.css";
import kisanBot from "../assets/kisanbot.jpg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8005/chat";

export default function KisanMitra() {
  // ✅ USE CONTEXT INSTEAD OF LOCAL STATE
  const { t: translate, language, setLanguage } = useLanguage();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const nextIdRef = useRef(1);

  // ✅ Speech language mapping (SIMPLIFIED)
  const speechLangMap = {
    en: "en-US",
    hi: "hi-IN",
    bn: "bn-IN",
    pa: "pa-IN"
  };

  // ✅ SIMPLIFIED - use context translations
  const quickActions = [
    { 
      key: "predictYield", 
      icon: "📊", 
      prompt: translate("predictYieldPrompt") || "Predict crop yield for my current field and season."
    },
    { 
      key: "pestAnalysis", 
      icon: "🐛", 
      prompt: translate("pestAnalysisPrompt") || "My mango tree leaves have yellow spots what should i do."
    },
    { 
      key: "weatherImpact", 
      icon: "🌤️", 
      prompt: translate("weatherImpactPrompt") || "How will the upcoming weather affect my crops?"
    },
    { 
      key: "cropRecommendation", 
      icon: "🌾", 
      prompt: translate("cropRecommendationPrompt") || "Recommend the best crops for my land and region."
    },
  ];

  // ✅ Set welcome message using context
  useEffect(() => {
    setMessages([
      { 
        id: 0, 
        sender: "bot", 
        text: translate("kisanWelcome") || "Hello! I'm your Kisan Mitra. How can I assist you today?"
      },
    ]);
  }, [language, translate]);

  // ✅ Scroll to bottom
  useEffect(() => {
    const el = chatBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ✅ Speech recognition with dynamic language
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = speechLangMap[language] || "hi-IN"; // ✅ DYNAMIC LANGUAGE
      recognitionRef.current = recog;

      recog.onstart = () => setListening(true);
      recog.onresult = (e) => setInput(e.results[0][0].transcript || "");
      recog.onerror = () => setListening(false);
      recog.onend = () => {
        setListening(false);
        if (input.trim() !== "") sendMessage();
      };
    }
  }, [language]); // ✅ Reconfigure when language changes

  function pushMessage(text, sender = "bot") {
    setMessages((prev) => [...prev, { id: nextIdRef.current++, sender, text }]);
  }

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    pushMessage(text, "user");
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }), // ✅ CONTEXT LANGUAGE
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      pushMessage(data.text || "(no reply)", "bot");

      if (data.audioData) {
        const raw = data.audioData;
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
      }
    } catch (err) {
      pushMessage(translate("chatError") || "⚠ Error connecting to server", "bot");
    }
    setLoading(false);
  }

  function toggleMic() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      try { rec.stop(); } catch {}
      setListening(false);
    } else {
      rec.lang = speechLangMap[language] || "hi-IN"; // ✅ DYNAMIC
      try { rec.start(); } catch {}
    }
  }

  return (
    <div className="km-root">
      <div className="km-shell">
        <header className="km-header">
          <div className="km-header-left">
            <div className="km-avatar">
              <img src={kisanBot} alt="Kisan Mitra Bot" className="km-avatar-img" />
            </div>
            <div className="km-header-text">
              <div className="km-title">
                {translate("kisanTitle") || "Kisan Mitra"}
              </div>
              <div className="km-subtitle">
                {translate("kisanSubtitle") || "Your intelligent farming companion"}
              </div>
            </div>
          </div>
          <div className="km-header-right">
            {/* ✅ USE CONTEXT LANGUAGE SELECTOR */}
            <select 
              className="km-lang-select" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>
        </header>

        <div className="km-chat" ref={chatBoxRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`km-msg-row ${msg.sender === "user" ? "km-msg-user" : "km-msg-bot"}`}>
              {msg.sender === "bot" && <div className="km-msg-icon bot-icon">🌱</div>}
              <div className="km-msg-bubble">
                <div className="km-msg-text">{msg.text}</div>
                <div className="km-msg-time">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {msg.sender === "user" && <div className="km-msg-icon user-icon">👤</div>}
            </div>
          ))}
          {loading && (
            <div className="km-msg-row km-msg-bot">
              <div className="km-msg-icon bot-icon">🌱</div>
              <div className="km-msg-bubble">
                <div className="km-msg-text">
                  {translate("typing") || "लिख रहे हैं..."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ QUICK ACTIONS WITH TRANSLATIONS */}
        <div className="km-quick-actions">
          <span className="km-qa-label">
            {translate("quickActions") || "Quick actions:"}
          </span>
          <div className="km-qa-buttons">
            {quickActions.map((qa, index) => (
              <button 
                key={index} 
                className="km-qa-btn" 
                onClick={() => sendMessage(qa.prompt)} 
                disabled={loading}
              >
                <span className="km-qa-icon">{qa.icon}</span>
                <span className="km-qa-text">
                  {translate(qa.key) || qa.prompt.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="km-input-row">
          <input
            className="km-input"
            type="text"
            value={input}
            placeholder={loading ? translate("wait") || "Wait..." : translate("chatPlaceholder") || "Type your message..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className={`km-icon-btn ${listening ? "km-mic-listening" : ""}`}
            onClick={toggleMic}
            type="button"
            disabled={loading}
            title={translate("voiceInput") || "Voice input"}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2v3z" />
            </svg>
          </button>
          <button
            className="km-icon-btn km-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
