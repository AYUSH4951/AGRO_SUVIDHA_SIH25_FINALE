// src/pages/KisanMitra.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";  // Use global language
import "../styles/KisanMitra.css";

const BACKEND_URL = "http://localhost:8005/chat";

export default function KisanMitra() {
  const { language: globalLang } = useLanguage();  // Global language
  const [messages, setMessages] = useState([]);    // Remove welcome message
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState("Sunny 28°C, dry next 3 days");

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const nextIdRef = useRef(1);

  // Auto-detect location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode to get district/state (use free API)
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(res => res.json())
          .then(data => setLocation(`${data.city || 'Punjab'}`));
      },
      () => setLocation("Punjab"), // Fallback
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch weather (OpenWeatherMap free API - get your key)
  useEffect(() => {
    if (location) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location},IN&appid=YOUR_API_KEY&units=metric&lang=${globalLang}`
      )
        .then(res => res.json())
        .then(data => {
          const desc = data.weather[0].description;
          const temp = Math.round(data.main.temp);
          setWeather(`${desc}, ${temp}°C`);
        })
        .catch(() => {}); // Use fallback
    }
  }, [location, globalLang]);

  useEffect(() => {
    const el = chatBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recognitionRef.current = recog;

      recog.onstart = () => setListening(true);
      recog.onresult = (e) => setInput(e.results[0][0].transcript || "");
      recog.onerror = () => setListening(false);
      recog.onend = () => {
        setListening(false);
        if (input.trim()) sendMessage();
      };
    }
  }, []);

  function pushMessage(text, sender = "bot") {
    setMessages((prev) => [...prev, { id: nextIdRef.current++, sender, text }]);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    pushMessage(text, "user");
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          language: globalLang,
          location: location || "Punjab",
          weather 
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      pushMessage(data.text || "(no reply)", "bot");

      if (data.audioData) {
        const raw = data.audioData;
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
      }
    } catch (err) {
      pushMessage("⚠ Server error", "bot");
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
      rec.lang = globalLang === "hi" ? "hi-IN" : 
                 globalLang === "bn" ? "bn-IN" : 
                 globalLang === "pa" ? "pa-IN" : "en-US";
      try { rec.start(); } catch {}
    }
  }

  return (
    <div className="kisanmitra-root-container">
      <div className="kisanmitra-chat-container">
        {/* HEADER */}
        <div className="kisanmitra-chat-header">
          <button
            className="kisanmitra-back-btn"
            onClick={() => window.history.back()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          Kisan Mitra
        </div>

        {/* LOCATION & WEATHER DISPLAY */}
        <div className="kisanmitra-status-bar">
          📍 {location || "Detecting..."} | ☀️ {weather}
        </div>

        {/* CHAT BOX */}
        <div className="kisanmitra-chat-box" ref={chatBoxRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`kisanmitra-message ${
                msg.sender === "user" ? "kisanmitra-user-message" : "kisanmitra-bot-message"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="kisanmitra-message kisanmitra-bot-message">Typing...</div>}
        </div>

        {/* INPUT AREA */}
        <div className="kisanmitra-chat-input">
          <input
            type="text"
            value={input}
            placeholder={loading ? "Wait..." : "Ask about crops, weather..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className={`kisanmitra-round-btn kisanmitra-mic-btn ${listening ? "listening" : ""}`}
            onClick={toggleMic}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2v-3z" />
            </svg>
          </button>
          <button
            className="kisanmitra-round-btn kisanmitra-send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            <svg viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
