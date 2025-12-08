import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/FarmerSignup.css";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/leaflogo.png";
import heroImg from "../assets/login_crop.jpg";

const signupTexts = {
  en: {
    appName: "Agro Suvidha",
    welcome: "Namaste!",
    subtitle: "Create your account to continue",
    signupTitle: "Sign Up",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    confirmPassword: "Confirm Password",
    enterPassword: "Create a password",
    enterConfirmPassword: "Re-enter your password",
    alreadyAccount: "Already have an account?",
    login: "Login",
    signup: "Sign Up",
    loadingText: "Creating account...",
    errors: {
      fillAll: "Please fill all fields",
      invalidPhone: "Phone signup is not implemented. Please use Email.",
      passwordMismatch: "Passwords do not match.",
    },
    genericError: "Failed to create account.",
  },
  hi: {
    appName: "एग्रो सुविधा",
    welcome: "नमस्ते किसान!",
    subtitle: "जारी रखने के लिए खाता बनाएं",
    signupTitle: "साइन अप",
    name: "पूरा नाम",
    email: "ईमेल",
    phone: "फ़ोन",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    enterPassword: "पासवर्ड बनाएं",
    enterConfirmPassword: "पासवर्ड दोबारा दर्ज करें",
    alreadyAccount: "पहले से खाता है?",
    login: "लॉगिन",
    signup: "साइन अप",
    loadingText: "खाता बन रहा है...",
    errors: {
      fillAll: "कृपया सभी जानकारी भरें",
      invalidPhone: "फ़ोन साइन अप अभी उपलब्ध नहीं, कृपया ईमेल उपयोग करें।",
      passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    },
    genericError: "खाता नहीं बन पाया।",
  },
  bn: {
    appName: "এগ্রো সুবিধা",
    welcome: "নমস্কার কৃষক!",
    subtitle: "চালিয়ে যেতে অ্যাকাউন্ট তৈরি করুন",
    signupTitle: "সাইন আপ",
    name: "পুরো নাম",
    email: "ইমেল",
    phone: "ফোন",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    enterPassword: "পাসওয়ার্ড তৈরি করুন",
    enterConfirmPassword: "আবার পাসওয়ার্ড লিখুন",
    alreadyAccount: "ইতিমধ্যেই অ্যাকাউন্ট আছে?",
    login: "লগইন",
    signup: "সাইন আপ",
    loadingText: "অ্যাকাউন্ট তৈরি হচ্ছে...",
    errors: {
      fillAll: "দয়া করে সব ঘর পূরণ করুন",
      invalidPhone: "ফোন সাইন আপ এখনও নেই, দয়া করে ইমেল ব্যবহার করুন।",
      passwordMismatch: "পাসওয়ার্ড মিলছে না।",
    },
    genericError: "অ্যাকাউন্ট তৈরি করা যায়নি।",
  },
  pa: {
    appName: "ਐਗਰੋ ਸੁਵਿਧਾ",
    welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ!",
    subtitle: "ਅੱਗੇ ਵੱਧਣ ਲਈ ਖਾਤਾ ਬਣਾਓ",
    signupTitle: "ਸਾਇਨ ਅੱਪ",
    name: "ਪੂਰਾ ਨਾਮ",
    email: "ਈਮੇਲ",
    phone: "ਫੋਨ",
    password: "ਪਾਸਵਰਡ",
    confirmPassword: "ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ",
    enterPassword: "ਪਾਸਵਰਡ ਬਣਾਓ",
    enterConfirmPassword: "ਪਾਸਵਰਡ ਦੁਬਾਰਾ ਦਰਜ ਕਰੋ",
    alreadyAccount: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?",
    login: "ਲਾਗਿਨ",
    signup: "ਸਾਇਨ ਅੱਪ",
    loadingText: "ਖਾਤਾ ਬਣ ਰਿਹਾ ਹੈ...",
    errors: {
      fillAll: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ",
      invalidPhone: "ਫੋਨ ਸਾਇਨਅੱਪ ਅਜੇ ਨਹੀਂ, ਕਿਰਪਾ ਕਰਕੇ ਈਮੇਲ ਵਰਤੋ।",
      passwordMismatch: "ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ।",
    },
    genericError: "ਖਾਤਾ ਨਹੀਂ ਬਣ ਸਕਿਆ।",
  },
};

function FarmerSignup() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { signup } = useAuth();
  const text = signupTexts[language] || signupTexts.en;

  const [isEmail, setIsEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!form.name || !form.emailOrPhone || !form.password || !form.confirmPassword) {
      setError(text.errors.fillAll);
      return;
    }

    if (!isEmail) {
      setError(text.errors.invalidPhone);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(text.errors.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      await signup(form.emailOrPhone, form.password, form.name);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      const message = err?.message ? err.message : text.genericError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Farmsign-container">

      <div className="farmsign-header">
        <div className="farmsign-logo">
          <img src={logo} alt="logo" />
          <h1>{text.appName}</h1>
        </div>
      </div>

      <div className="farmsign-hero">
        <img src={heroImg} alt="Smart Farming" />
        <div className="farmsign-hero-overlay">
          <div>
            <h1>{text.welcome}</h1>
            <p>{text.subtitle}</p>
          </div>
        </div>
      </div>

      <form className="farmsign-card" onSubmit={handleSignup}>
        <div className="farmsign-toggle-buttons">
          <button
            type="button"
            className={isEmail ? "active" : ""}
            onClick={() => setIsEmail(true)}
          >
            {text.email}
          </button>

          <button
            type="button"
            className={!isEmail ? "active" : ""}
            onClick={() => setIsEmail(false)}
          >
            {text.phone}
          </button>
        </div>

        <h3>{text.signupTitle}</h3>

        {error && <div className="farmsign-error">{error}</div>}

        <div className="farmsign-form-group">
          <label>{text.name}</label>
          <input
            type="text"
            name="name"
            placeholder="Farmer Name"
            value={form.name}
            onChange={handleInput}
            required
          />
        </div>

        <div className="farmsign-form-group">
          <label>{isEmail ? text.email : text.phone}</label>
          <input
            type={isEmail ? "email" : "tel"}
            name="emailOrPhone"
            placeholder={isEmail ? "farmer@example.com" : "+91 98765 43210"}
            value={form.emailOrPhone}
            onChange={handleInput}
            required
          />
        </div>

        <div className="farmsign-form-group">
          <label>{text.password}</label>
          <div className="farmsign-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={text.enterPassword}
              value={form.password}
              onChange={handleInput}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="farmsign-form-group">
          <label>{text.confirmPassword}</label>
          <div className="farmsign-password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder={text.enterConfirmPassword}
              value={form.confirmPassword}
              onChange={handleInput}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="password-toggle-btn"
            >
              {showConfirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button className="farmsign-btn" disabled={loading} type="submit">
          {loading ? text.loadingText : text.signup}
        </button>

        <div className="farmsign-signup">
          <span>{text.alreadyAccount}</span>
          <Link to="/login">{text.login}</Link>
        </div>
      </form>
    </div>
  );
}

export default FarmerSignup;
