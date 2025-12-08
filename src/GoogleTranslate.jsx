import { useEffect } from "react";

// Helper function to trigger translation from your own buttons
export const translateTo = (langCode) => {
  const combo = document.querySelector("select.goog-te-combo");
  if (!combo) return console.warn("Google Translate not ready yet");

  combo.value = langCode;
  combo.dispatchEvent(new Event("change"));
};

const GoogleTranslate = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,gu,mr,ta,te,kn,bn,pa",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 👇 HIDE the Google dropdown widget (but still mount it so translation works)
  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
};

export default GoogleTranslate;