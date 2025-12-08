// src/pages/SoilAnalyser.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  FlaskConical,
  Mic,
  Camera,
  BarChart3,
} from "lucide-react";
import "../styles/SoilAnalyser.css";

export default function SoilAnalyser() {
  const [crop, setCrop] = useState("");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileName, setFileName] = useState("File shown here");
  const [analyzing, setAnalyzing] = useState(false);
  const [resultsText, setResultsText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [language, setLanguage] = useState("en");

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang");
    if (lang) setLanguage(lang);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, []);

  function previewFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    setFileName(file.name);
    setShowResults(false);
  }

  function startVoice() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition not supported");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();

    rec.lang = language;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    recognitionRef.current = rec;

    rec.start();

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCrop(transcript);
    };
    rec.onerror = (e) => alert("Voice error: " + e.error);
    rec.onend = () => (recognitionRef.current = null);
  }

  async function analyzeSoil() {
    const selectedFile = fileInputRef.current?.files?.[0];

    // ❌ Removed crop name requirement (optional now)
    if (!selectedFile) return alert("Please select a soil image!");

    setAnalyzing(true);
    setShowResults(false);
    setResultsText("");

    try {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          resolve(dataUrl.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch("http://localhost:8001/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          crop_name: crop || null, // ✅ CROP OPTIONAL HERE
          soil_image_base64: base64Image,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      const data = await res.json();
      setResultsText(data.text || JSON.stringify(data, null, 2));
      setShowResults(true);

      if (data.audio_file) {
        setAudioUrl(`http://localhost:8001/audio/${data.audio_file}`);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }

    setAnalyzing(false);
  }

  return (
    <div className="analyser-root">
      {/* HEADER */}
      <header className="analyser-header">
        <a href="/dashboard" className="analyser-back">
          <ArrowLeft />
        </a>

        <div className="analyser-icon-bg">
          <FlaskConical />
        </div>

        <div>
          <h1>Soil Moisture Fertilizer</h1>
          <h2>Recommendation</h2>
          <p>AI-powered soil analysis and recommendations</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="analyser-container">
        <div className="analyser-card">
          <label>Crop Name (Optional):</label>
          <input
            type="text"
            placeholder="Enter crop name (optional)"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          />

          <button className="analyser-btn-blue" onClick={startVoice}>
            <Mic /> Voice Input
          </button>

          <label style={{ marginTop: 15 }}>Upload Soil Image:</label>

          <div className="analyser-file-row">
            <button
              className="analyser-btn-outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>
            <span className="analyser-file-name">{fileName}</span>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="analyser-hidden"
            onChange={(e) => previewFile(e.target.files[0])}
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            className="analyser-hidden"
            onChange={(e) => previewFile(e.target.files[0])}
          />

          {previewSrc && (
            <div className="analyser-preview">
              <img src={previewSrc} alt="Preview" />
            </div>
          )}

          <button
            className="analyser-btn-capture"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={18} /> Capture Photo
          </button>

          <button
            className="analyser-btn-green"
            onClick={analyzeSoil}
            disabled={analyzing}
          >
            <BarChart3 />
            {analyzing ? "Analyzing..." : "Analyze Soil Quality"}
          </button>
        </div>

        {showResults && (
          <div className="analyser-card">
            <h3>Analysis Results</h3>

            <pre className="analyser-results-box">{resultsText}</pre>

            {audioUrl && (
              <audio controls style={{ marginTop: 10, width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
