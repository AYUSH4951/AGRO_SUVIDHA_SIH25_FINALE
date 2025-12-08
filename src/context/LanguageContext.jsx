// src/context/LanguageContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const TRANSLATIONS = {
  en: {
    appName: "Agro Suvidha",
    stepText: "Step 1 of 2",
    greeting: "Namaste",
    chooseLang: "Choose Your Language",
    chooseLangDesc: "Select your preferred language to continue",
    continueBtn: "Continue",
    helpText: "You can change this later in settings",
    footerText: "Smart Farming. Smarter Future.",
  },
  hi: {
    appName: "एग्रो सुविधा",
    stepText: "कदम 1 में से 2",
    greeting: "नमस्ते",
    chooseLang: "अपनी भाषा चुनें",
    chooseLangDesc: "जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",
    continueBtn: "आगे बढ़ें",
    helpText: "आप इसे बाद में सेटिंग्स में बदल सकते हैं",
    footerText: "स्मार्ट खेती। स्मार्ट भविष्य।",
  },
  bn: {
    appName: "এগ্রো সুবিধা",
    stepText: "পদক্ষেপ ১ এর মধ্যে ২",
    greeting: "নমস্কার",
    chooseLang: "আপনার ভাষা নির্বাচন করুন",
    chooseLangDesc: "চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন",
    continueBtn: "চালিয়ে যান",
    helpText: "আপনি পরে সেটিংসে এটি পরিবর্তন করতে পারবেন",
    footerText: "স্মার্ট চাষাবাদ। স্মার্ট ভবিষ্যৎ।",
  },
  pa: {
    appName: "ਐਗਰੋ ਸੁਵਿਧਾ",
    stepText: "ਕਦਮ 1 ਵਿਚੋਂ 2",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    chooseLang: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    chooseLangDesc: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਮਨਪਸੰਦ ਭਾਸ਼ਾ ਚੁਣੋ",
    continueBtn: "ਜਾਰੀ ਰੱਖੋ",
    helpText: "ਤੁਸੀਂ ਇਸਨੂੰ ਬਾਅਦ ਵਿੱਚ ਸੈਟਿੰਗਜ਼ ਵਿੱਚ ਬਦਲ ਸਕਦੇ ਹੋ",
    footerText: "ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ। ਸਮਾਰਟ ਭਵਿੱਖ।",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // default to English, or value from localStorage
    const saved = localStorage.getItem("agro_language");
    return saved || "en";
  });

  useEffect(() => {
    localStorage.setItem("agro_language", language);
  }, [language]);

  // helper to get translated text
  function t(key) {
    const pack = TRANSLATIONS[language] || TRANSLATIONS.en;
    return pack[key] ?? key;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,      // "en" | "hi" | "bn" | "pa"
        setLanguage,   // use setLanguage("hi") etc.
        t,
        translations: TRANSLATIONS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// custom hook
export function useLanguage() {
  return useContext(LanguageContext);
}
