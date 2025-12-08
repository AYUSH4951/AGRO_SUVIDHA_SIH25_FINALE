// src/pages/ScanResult.jsx
import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const scannerResultTexts = {
  en: {
    noResult: "No result found. Please scan again.",
    backToScan: "Go back to Scan",
    analysisComplete: "Analysis Complete",
    listenTitle: "Listen to Results",
    listenSub:
      "Audio will start automatically. Use the buttons to stop or play again.",
    stopAudio: "Stop audio",
    playAgain: "Play again",
    pestDetected: "Pest Detected",
    requiresAttention: "Requires immediate attention",
    expertAdvice: "Expert Advice",
    noAdvice: "No advice available.",
    recPesticides: "Recommended Pesticides",
    recFertilizers: "Recommended Fertilizers",
    dosageTitle: "Application Dosage",
    defaultDosage: "Follow label instructions.",
  },
  hi: {
    noResult: "कोई परिणाम नहीं मिला। कृपया दोबारा स्कैन करें।",
    backToScan: "स्कैन पर वापस जाएँ",
    analysisComplete: "विश्लेषण पूर्ण हुआ",
    listenTitle: "परिणाम सुनें",
    listenSub:
      "ऑडियो अपने आप शुरू हो जाएगा। रोकने या दोबारा चलाने के लिए बटन का उपयोग करें।",
    stopAudio: "ऑडियो रोकें",
    playAgain: "फिर से चलाएँ",
    pestDetected: "कीट मिला",
    requiresAttention: "तुरंत ध्यान देने की आवश्यकता है",
    expertAdvice: "विशेषज्ञ सलाह",
    noAdvice: "कोई सलाह उपलब्ध नहीं है।",
    recPesticides: "अनुशंसित कीटनाशक",
    recFertilizers: "अनुशंसित उर्वरक",
    dosageTitle: "प्रयोग मात्रा",
    defaultDosage: "लेबल पर दिए गए निर्देशों का पालन करें।",
  },
  bn: {
    noResult: "কোন ফলাফল পাওয়া যায়নি। দয়া করে আবার স্ক্যান করুন।",
    backToScan: "স্ক্যানে ফিরে যান",
    analysisComplete: "বিশ্লেষণ সম্পন্ন",
    listenTitle: "ফলাফল শুনুন",
    listenSub:
      "অডিও নিজে থেকে শুরু হবে। বন্ধ বা আবার চালাতে বোতাম ব্যবহার করুন।",
    stopAudio: "অডিও বন্ধ করুন",
    playAgain: "আবার চালান",
    pestDetected: "পোকা শনাক্ত হয়েছে",
    requiresAttention: "তৎক্ষণাৎ নজর দেওয়া প্রয়োজন",
    expertAdvice: "বিশেষজ্ঞ পরামর্শ",
    noAdvice: "কোনো পরামর্শ পাওয়া যায়নি।",
    recPesticides: "প্রস্তাবিত কীটনাশক",
    recFertilizers: "প্রস্তাবিত সার",
    dosageTitle: "প্রয়োগের মাত্রা",
    defaultDosage: "লেবেলে দেওয়া নির্দেশনা অনুসরণ করুন।",
  },
  pa: {
    noResult: "ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਸਕੈਨ ਕਰੋ।",
    backToScan: "ਸਕੈਨ ‘ਤੇ ਵਾਪਸ ਜਾਓ",
    analysisComplete: "ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋ ਗਿਆ",
    listenTitle: "ਨਤੀਜੇ ਸੁਣੋ",
    listenSub:
      "ਆਡੀਓ ਆਪਣੇ ਆਪ ਚੱਲੇਗੀ। ਰੋਕਣ ਜਾਂ ਦੁਬਾਰਾ ਚਲਾਉਣ ਲਈ ਬਟਨ ਵਰਤੋ।",
    stopAudio: "ਆਡੀਓ ਰੋਕੋ",
    playAgain: "ਫਿਰ ਚਲਾਓ",
    pestDetected: "ਕੀਟ ਪਛਾਣਿਆ ਗਿਆ",
    requiresAttention: "ਤੁਰੰਤ ਧਿਆਨ ਦੀ ਲੋੜ ਹੈ",
    expertAdvice: "ਵਿਸ਼ੇਸ਼ਗਿਆਰ ਸਲਾਹ",
    noAdvice: "ਕੋਈ ਸਲਾਹ ਉਪਲਬਧ ਨਹੀਂ।",
    recPesticides: "ਸੁਝਾਏ ਗਏ ਕੀਟਨਾਸ਼ਕ",
    recFertilizers: "ਸੁਝਾਏ ਗਏ ਖਾਦ",
    dosageTitle: "ਲਾਗੂ ਕਰਨ ਦੀ ਖੁਰਾਕ",
    defaultDosage: "ਲੇਬਲ ‘ਤੇ ਦਿੱਤੇ ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।",
  },
};

function ScanResult() {
  const audioRef = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = scannerResultTexts[language] || scannerResultTexts.en;

  const result = state?.result;

  if (!result) {
    return (
      <div className="scanner-page">
        <div className="scanner-content">
          <p>{text.noResult}</p>
          <button className="scanner-btn" onClick={() => navigate("/scan")}>
            {text.backToScan}
          </button>
        </div>
      </div>
    );
  }

  const { predicted_class, confidence, tts_audio_url, recommendation } = result;

  const audioUrl = tts_audio_url
    ? `http://localhost:8002${tts_audio_url}`
    : null;

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      const p = audioRef.current.play();
      if (p && p.catch) {
        p.catch(() => {
          // autoplay blocked; user can press Play again
        });
      }
    }
  }, [audioUrl]);

  const confidencePercent =
    typeof confidence === "number" ? Math.round(confidence * 100) : 94;

  return (
    <div className="scanner-page">
      <div className="result-stack">
        {/* Top green bar */}
        <section className="card card-main">
          <div className="card-main-header">
            <div className="card-main-left">
              <div className="card-main-icon">✅</div>
              <div>
                <p className="card-main-label">{text.analysisComplete}</p>
                <h2 className="card-main-title">
                  {predicted_class} ({confidencePercent}%)
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Audio summary */}
        {audioUrl && (
          <section className="card card-audio">
            <div className="card-row-head">
              <span className="card-icon purple">🔊</span>
              <div>
                <p className="card-title">{text.listenTitle}</p>
                <p className="card-sub">{text.listenSub}</p>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl}
              style={{ width: "100%", marginTop: "10px", display: "none" }}
            />

            <div className="audio-custom-controls">
              <button
                type="button"
                className="audio-btn stop"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                }}
              >
                ⏹ {text.stopAudio}
              </button>

              <button
                type="button"
                className="audio-btn play"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                  }
                }}
              >
                🔁 {text.playAgain}
              </button>
            </div>
          </section>
        )}

        {/* Pest Detected */}
        <section className="card card-alert">
          <div className="card-row-head">
            <span className="card-icon red">🐛</span>
            <div>
              <p className="card-title">{text.pestDetected}</p>
              <p className="card-sub">{predicted_class}</p>
            </div>
          </div>
          <p className="card-badge-danger">{text.requiresAttention}</p>
        </section>

        {/* Expert Advice */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon yellow">💡</span>
            <div>
              <p className="card-title">{text.expertAdvice}</p>
              <p className="card-sub">
                {recommendation?.advice || text.noAdvice}
              </p>
            </div>
          </div>
        </section>

        {/* Recommended Pesticides */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon blue">🧪</span>
            <div>
              <p className="card-title">{text.recPesticides}</p>
              {recommendation?.pesticides?.map((p) => (
                <p key={p} className="card-pill">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Fertilizers */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon green">🌱</span>
            <div>
              <p className="card-title">{text.recFertilizers}</p>
              {recommendation?.fertilizers?.map((f) => (
                <p key={f} className="card-pill green-pill">
                  {f}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Application Dosage */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon orange">📏</span>
            <div>
              <p className="card-title">{text.dosageTitle}</p>
              <p className="card-sub">
                {recommendation?.dosage || text.defaultDosage}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ScanResult;
