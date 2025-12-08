// src/pages/SoilResult.jsx
import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const soilResultTexts = {
  en: {
    noResult: "No result found. Please scan again.",
    backToScan: "Go back to Scan",
    analysisComplete: "Soil Analysis Complete",
    listenTitle: "Listen to Soil Report",
    listenSub:
      "Audio will start automatically. Use the buttons to stop or play again.",
    stopAudio: "Stop audio",
    playAgain: "Play again",
    summary: "Summary",
    irrigationAdvice: "Irrigation Advice",
    soilQuality: "Soil Quality",
    suitabilityFor: "Suitability for",
    recommendedCrops: "Recommended Crops",
    fertilizerPlan: "Fertilizer Plan",
    howToUse: "How to Use This Fertilizer",
    tips: "Tips to Improve Yield",
  },
  hi: {
    noResult: "कोई परिणाम नहीं मिला। कृपया दोबारा स्कैन करें।",
    backToScan: "स्कैन पर वापस जाएँ",
    analysisComplete: "मिट्टी विश्लेषण पूर्ण हुआ",
    listenTitle: "मिट्टी की रिपोर्ट सुनें",
    listenSub:
      "ऑडियो अपने आप शुरू हो जाएगा। रोकने या फिर से चलाने के लिए बटन का उपयोग करें।",
    stopAudio: "ऑडियो रोकें",
    playAgain: "फिर से चलाएँ",
    summary: "सारांश",
    irrigationAdvice: "सिंचाई संबंधी सलाह",
    soilQuality: "मिट्टी की गुणवत्ता",
    suitabilityFor: "के लिए उपयुक्तता",
    recommendedCrops: "अनुशंसित फसलें",
    fertilizerPlan: "उर्वरक योजना",
    howToUse: "इस उर्वरक का उपयोग कैसे करें",
    tips: "उपज बढ़ाने के सुझाव",
  },
  bn: {
    noResult: "কোন ফলাফল পাওয়া যায়নি। দয়া করে আবার স্ক্যান করুন।",
    backToScan: "স্ক্যানে ফিরে যান",
    analysisComplete: "মাটি বিশ্লেষণ সম্পন্ন",
    listenTitle: "মাটির রিপোর্ট শুনুন",
    listenSub:
      "অডিও নিজে থেকে শুরু হবে। বন্ধ বা আবার চালাতে বোতাম ব্যবহার করুন।",
    stopAudio: "অডিও বন্ধ করুন",
    playAgain: "আবার চালান",
    summary: "সারাংশ",
    irrigationAdvice: "সেচের পরামর্শ",
    soilQuality: "মাটির গুণমান",
    suitabilityFor: "জন্য উপযোগিতা",
    recommendedCrops: "প্রস্তাবিত ফসল",
    fertilizerPlan: "সারের পরিকল্পনা",
    howToUse: "এই সার কীভাবে ব্যবহার করবেন",
    tips: "উৎপাদন বাড়ানোর টিপস",
  },
  pa: {
    noResult: "ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਸਕੈਨ ਕਰੋ।",
    backToScan: "ਸਕੈਨ ‘ਤੇ ਵਾਪਸ ਜਾਓ",
    analysisComplete: "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋਇਆ",
    listenTitle: "ਮਿੱਟੀ ਦੀ ਰਿਪੋਰਟ ਸੁਣੋ",
    listenSub:
      "ਆਡੀਓ ਆਪਣੇ ਆਪ ਚੱਲੇਗੀ। ਰੋਕਣ ਜਾਂ ਦੁਬਾਰਾ ਚਲਾਉਣ ਲਈ ਬਟਨ ਵਰਤੋ।",
    stopAudio: "ਆਡੀਓ ਰੋਕੋ",
    playAgain: "ਫਿਰ ਚਲਾਓ",
    summary: "ਸਾਰ",
    irrigationAdvice: "ਸਿੰਚਾਈ ਸੰਬੰਧੀ ਸਲਾਹ",
    soilQuality: "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ",
    suitabilityFor: "ਲਈ ਉਚਿਤਤਾ",
    recommendedCrops: "ਸੁਝਾਈਆਂ ਗਈਆਂ ਫਸਲਾਂ",
    fertilizerPlan: "ਖਾਦ ਯੋਜਨਾ",
    howToUse: "ਇਸ ਖਾਦ ਨੂੰ ਕਿਵੇਂ ਵਰਤਣਾ ਹੈ",
    tips: "ਉਪਜ ਵਧਾਉਣ ਲਈ ਟਿੱਪਸ",
  },
};

function SoilResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const hasAutoplayedRef = useRef(false);

  const { language } = useLanguage();
  const text = soilResultTexts[language] || soilResultTexts.en;

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

  const {
    soil_type,
    soil_moisture,
    crop_name,
    summary,
    moisture_advice,
    soil_quality,
    recommended_crops,
    crop_suitability,
    better_crops_line,
    fertilizer_line,
    how_to_use,
    extra_tips,
    tts_audio_url,
  } = result;

  const audioUrl = tts_audio_url
    ? `http://localhost:8001${tts_audio_url}`
    : null;

  useEffect(() => {
    if (!audioUrl) return;
    if (!audioRef.current) return;
    if (hasAutoplayedRef.current) return;

    hasAutoplayedRef.current = true;
    audioRef.current.currentTime = 0;
    const p = audioRef.current.play();
    if (p && p.catch) {
      p.catch(() => {
        // autoplay blocked
      });
    }
  }, [audioUrl]);

  return (
    <div className="scanner-page">
      <div className="result-stack">
        {/* Top soil analysis bar */}
        <section className="card card-main">
          <div className="card-main-header">
            <div className="card-main-left">
              <div className="card-main-icon">🧪</div>
              <div>
                <p className="card-main-label">{text.analysisComplete}</p>
                <h2 className="card-main-title">
                  {soil_type} · {soil_moisture}
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

        {/* Summary */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon blue">📋</span>
            <div>
              <p className="card-title">{text.summary}</p>
              <p className="card-sub">{summary}</p>
            </div>
          </div>
        </section>

        {/* Irrigation advice */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon green">💧</span>
            <div>
              <p className="card-title">{text.irrigationAdvice}</p>
              <p className="card-sub">{moisture_advice}</p>
            </div>
          </div>
        </section>

        {/* Soil quality */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon yellow">🌱</span>
            <div>
              <p className="card-title">{text.soilQuality}</p>
              <p className="card-sub">{soil_quality}</p>
            </div>
          </div>
        </section>

        {/* Crop suitability */}
        {crop_name && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon orange">🌾</span>
              <div>
                <p className="card-title">
                  {text.suitabilityFor} {crop_name}
                </p>
                <p className="card-sub">{crop_suitability}</p>
                {better_crops_line && (
                  <p className="card-sub" style={{ marginTop: "4px" }}>
                    {better_crops_line}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Recommended crops if no crop given */}
        {!crop_name && recommended_crops && recommended_crops.length > 0 && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon blue">🧾</span>
              <div>
                <p className="card-title">{text.recommendedCrops}</p>
                <p className="card-sub">{recommended_crops.join(", ")}</p>
              </div>
            </div>
          </section>
        )}

        {/* Fertilizer plan */}
        {fertilizer_line && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon green">🧴</span>
              <div>
                <p className="card-title">{text.fertilizerPlan}</p>
                <p className="card-sub">{fertilizer_line}</p>
              </div>
            </div>
          </section>
        )}

        {/* How to use */}
        {how_to_use && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon orange">🧯</span>
              <div>
                <p className="card-title">{text.howToUse}</p>
                <p className="card-sub">{how_to_use}</p>
              </div>
            </div>
          </section>
        )}

        {/* Extra tips */}
        {extra_tips && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon blue">💡</span>
              <div>
                <p className="card-title">{text.tips}</p>
                <p className="card-sub">{extra_tips}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default SoilResult;
