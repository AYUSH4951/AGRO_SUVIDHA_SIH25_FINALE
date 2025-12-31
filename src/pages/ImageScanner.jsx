// src/pages/ImageScanner.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const scannerTexts = {
  en: {
    title: "Scan Leaf or Soil",
    subtitle: "Use your camera to capture a clear photo of the leaf or soil.",
    openCamera: "Open Camera",
    analyzingTitle: "Analyzing Your Image",
    step1: "Processing image...",
    step2: "Detecting features...",
    step3: "Generating recommendations...",
    waitText: "Please wait while we analyze your sample",
  },
  hi: {
    title: "पत्ता या मिट्टी स्कैन करें",
    subtitle: "पत्ते या मिट्टी की साफ़ तस्वीर लेने के लिए कैमरा उपयोग करें।",
    openCamera: "कैमरा खोलें",
    analyzingTitle: "आपकी छवि का विश्लेषण हो रहा है",
    step1: "छवि संसाधित की जा रही है...",
    step2: "विशेषताएँ पहचानी जा रही हैं...",
    step3: "सिफारिशें तैयार की जा रही हैं...",
    waitText: "कृपया प्रतीक्षा करें, आपका नमूना विश्लेषित हो रहा है",
  },
  bn: {
    title: "পাতা বা মাটি স্ক্যান করুন",
    subtitle: "পাতা বা মাটির পরিষ্কার ছবি তুলতে ক্যামেরা ব্যবহার করুন।",
    openCamera: "ক্যামেরা খুলুন",
    analyzingTitle: "আপনার ছবিটি বিশ্লেষণ করা হচ্ছে",
    step1: "ছবি প্রক্রিয়াকরণ হচ্ছে...",
    step2: "বৈশিষ্ট্য শনাক্ত করা হচ্ছে...",
    step3: "পরামর্শ তৈরি করা হচ্ছে...",
    waitText: "দয়া করে অপেক্ষা করুন, আমরা আপনার নমুনা বিশ্লেষণ করছি",
  },
  pa: {
    title: "ਪੱਤਾ ਜਾਂ ਮਿੱਟੀ ਸਕੈਨ ਕਰੋ",
    subtitle: "ਪੱਤੇ ਜਾਂ ਮਿੱਟੀ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਲਈ ਕੈਮਰਾ ਵਰਤੋ।",
    openCamera: "ਕੈਮਰਾ ਖੋਲ੍ਹੋ",
    analyzingTitle: "ਤੁਹਾਡੀ ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ",
    step1: "ਤਸਵੀਰ ਪ੍ਰੋਸੈਸ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    step2: "ਖਾਸ ਲੱਛਣ ਪਛਾਣੇ ਜਾ ਰਹੇ ਹਨ...",
    step3: "ਸਿਫਾਰਸ਼ਾਂ ਤਿਆਰ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...",
    waitText: "ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ, ਅਸੀਂ ਤੁਹਾਡਾ ਨਮੂਨਾ ਜਾਂਚ ਰਹੇ ਹਾਂ",
  },
};

function ImageScanner() {
  const fileInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = scannerTexts[language] || scannerTexts.en;

  useEffect(() => {
    if (!isAnalyzing) return;

    // reset to first step when analysis starts
    setStep(1);

    const id = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 2000); // move every 2s

    return () => clearInterval(id);
  }, [isAnalyzing]);

  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // pass language to backend as query param
      const res = await fetch(
        `https://unified-agro-api-hhpok5caua-uc.a.run.app/analyze?lang=${encodeURIComponent(language)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();

      // go to result page and pass data via state
      navigate("/scan-result", { state: { result: data } });
    } catch (err) {
      console.error(err);
      alert("Could not analyze the image. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="scanner-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {!isAnalyzing && (
        <div className="scanner-content">
          <h2>{text.title}</h2>
          <p>{text.subtitle}</p>
          <button className="scanner-btn" onClick={handleOpenCamera}>
            {text.openCamera}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="analyzing-card">
          <h3>{text.analyzingTitle}</h3>
          <div className="analyzing-steps">
            <div className={`step-item ${step >= 1 ? "active" : ""}`}>
              {text.step1}
            </div>
            <div className={`step-item ${step >= 2 ? "active" : ""}`}>
              {text.step2}
            </div>
            <div className={`step-item ${step >= 3 ? "active" : ""}`}>
              {text.step3}
            </div>
          </div>
          <div className="dot-loader">
            <span />
            <span />
            <span />
          </div>
          <p className="analyzing-text">{text.waitText}</p>
        </div>
      )}
    </div>
  );
}

export default ImageScanner;
