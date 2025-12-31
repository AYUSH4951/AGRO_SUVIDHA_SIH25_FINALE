// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/leaflogo.png";
import heroImg from "../assets/login_crop.jpg";

const loginTexts = {
  en: {
    appName: "Agro Suvidha",
    welcome: "Namaste!",
    subtitle: "Please login to continue",
    loginTitle: "Login",
    email: "Email",
    phone: "Phone",
    password: "Password",
    enterPassword: "Enter your password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    login: "Login",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    loadingText: "Signing in...",
    errors: {
      fillAll: "Please fill all fields",
      invalidPhone: "Phone login is not implemented. Please use Email.",
    },
    genericError: "Failed to sign in.",
    userNotFound: "No user found with this email.",
    wrongPassword: "Incorrect password.",
  },
  hi: {
    appName: "एग्रो सुविधा",
    welcome: "नमस्ते किसान!",
    subtitle: "जारी रखने के लिए लॉगिन करें",
    loginTitle: "लॉगिन",
    email: "ईमेल",
    phone: "फ़ोन",
    password: "पासवर्ड",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    login: "लॉगिन",
    noAccount: "कोई खाता नहीं है?",
    signUp: "साइन अप करें",
    loadingText: "लॉगिन हो रहा है...",
    errors: {
      fillAll: "कृपया सभी जानकारी भरें",
      invalidPhone: "फ़ोन लॉगिन अभी उपलब्ध नहीं है, कृपया ईमेल का उपयोग करें।",
    },
    genericError: "लॉगिन नहीं हो पाया।",
    userNotFound: "इस ईमेल से कोई उपयोगकर्ता नहीं मिला।",
    wrongPassword: "गलत पासवर्ड।",
  },
  bn: {
    appName: "এগ্রো সুবিধা",
    welcome: "নমস্কার কৃষক!",
    subtitle: "চালিয়ে যেতে লগইন করুন",
    loginTitle: "লগইন",
    email: "ইমেল",
    phone: "ফোন",
    password: "পাসওয়ার্ড",
    enterPassword: "আপনার পাসওয়ার্ড লিখুন",
    rememberMe: "আমাকে মনে রাখুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    login: "লগইন",
    noAccount: "অ্যাকাউন্ট নেই?",
    signUp: "সাইন আপ করুন",
    loadingText: "লগইন হচ্ছে...",
    errors: {
      fillAll: "দয়া করে সব ঘর পূরণ করুন",
      invalidPhone: "ফোন লগইন এখনও নেই, দয়া করে ইমেল ব্যবহার করুন।",
    },
    genericError: "লগইন করা যায়নি।",
    userNotFound: "এই ইমেল দিয়ে কোনো ব্যবহারকারী পাওয়া যায়নি।",
    wrongPassword: "ভুল পাসওয়ার্ড।",
  },
  pa: {
    appName: "ਐਗਰੋ ਸੁਵਿਧਾ",
    welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ!",
    subtitle: "ਅੱਗੇ ਵੱਧਣ ਲਈ ਲਾਗਿਨ ਕਰੋ",
    loginTitle: "ਲਾਗਿਨ",
    email: "ਈਮੇਲ",
    phone: "ਫੋਨ",
    password: "ਪਾਸਵਰਡ",
    enterPassword: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ",
    rememberMe: "ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ",
    forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    login: "ਲਾਗਿਨ",
    noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    signUp: "ਸਾਇਨ ਅੱਪ ਕਰੋ",
    loadingText: "ਲਾਗਿਨ ਹੋ ਰਿਹਾ ਹੈ...",
    errors: {
      fillAll: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ",
      invalidPhone: "ਫੋਨ ਲਾਗਿਨ ਅਜੇ ਨਹੀਂ, ਕਿਰਪਾ ਕਰਕੇ ਈਮੇਲ ਵਰਤੋ।",
    },
    genericError: "ਲਾਗਿਨ ਨਹੀਂ ਹੋ ਸਕਿਆ।",
    userNotFound: "ਇਸ ਈਮੇਲ ਨਾਲ ਕੋਈ ਵਰਤੋਂਕਾਰ ਨਹੀਂ ਮਿਲਿਆ।",
    wrongPassword: "ਗਲਤ ਪਾਸਵਰਡ।",
  },
};

function Login() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login, setPersistenceForRemember, getCurrentUserToken } = useAuth();

  const text = loginTexts[language] || loginTexts.en;

  const [isEmail, setIsEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!form.emailOrPhone || !form.password) {
      setError(text.errors.fillAll);
      return;
    }

    if (!isEmail) {
      setError(text.errors.invalidPhone);
      return;
    }

    setLoading(true);
    try {
      try {
        await setPersistenceForRemember(remember);
      } catch (persistErr) {
        console.warn("Could not set persistence:", persistErr);
      }

      // Sign in first (token available only after auth)
      const cred = await login(form.emailOrPhone, form.password);

      // Generate Firebase ID token and verify with backend
      const token = await getCurrentUserToken();
      console.log("Obtained user token:", token);
      const verifyResp = await fetch("https://auth-backend-285018970008.asia-south1.run.app/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!verifyResp.ok) {
        throw new Error("Token verification failed. Please try again.");
      }


      // Push basic user data to backend
      try {
        await fetch("https://auth-backend-285018970008.asia-south1.run.app/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              name:
                (cred?.user && (cred.user.displayName || localStorage.getItem("displayName"))) ||
                "Farmer",
              email: cred?.user?.email || form.emailOrPhone,
              phone: "",
              address: "",
              preferences: {
                theme: "light",
                notifications: true,
              },
            },
            collection: "user_data",
          }),
        });
      } catch (pushErr) {
        console.warn("Could not push user data to backend:", pushErr);
      }

      // Persist farmer profile with role flag for routing
      try {
        const user = cred && cred.user ? cred.user : null;
        const stored = {
          fullName: (user && (user.displayName || localStorage.getItem("displayName"))) || "Farmer",
          email: (user && user.email) || form.emailOrPhone,
          role: "farmer",
        };
        localStorage.setItem("userProfile", JSON.stringify(stored));
        localStorage.setItem("farmerProfile", JSON.stringify(stored));
        localStorage.setItem("agroUser", JSON.stringify(stored));
        localStorage.setItem("displayName", stored.fullName);
        localStorage.setItem("userName", stored.fullName);
        localStorage.setItem("userEmail", stored.email || "");
        window.dispatchEvent(new CustomEvent("agroProfileUpdated", { detail: stored }));
      } catch (e) {
        console.warn("Could not persist farmer profile to localStorage:", e);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      let message = text.genericError;
      if (err?.code === "auth/user-not-found") message = text.userNotFound;
      else if (err?.code === "auth/wrong-password") message = text.wrongPassword;
      else if (err?.message) message = err.message;
      // More friendly message for invalid credential
      if (err?.code === "auth/invalid-credential") {
        message = "Invalid credentials. Please check your email and password.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* HEADER SECTION */}
      <div className="login-header">
        <div className="login-logo">
          <img src={logo} alt="logo" />
          <h1>{text.appName}</h1>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="login-hero">
        <img src={heroImg} alt="Smart Farming" />
        <div className="login-hero-overlay">
          <div>
            <h1>{text.welcome}</h1>
            <p>{text.subtitle}</p>
          </div>
        </div>
      </div>

      {/* LOGIN CARD */}
      <form className="login-card" onSubmit={handleLogin}>
        <h3>{text.loginTitle}</h3>

        {error && (
          <div className="login-error modern-alert error">
            <div className="alert-title">Sign-in failed</div>
            <div className="alert-body">{error}</div>
          </div>
        )}


        {/* TOGGLE EMAIL / PHONE */}
        <div className="login-toggle-buttons">
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

        {/* INPUT FIELD */}
        <div className="login-form-group">
          <label>{isEmail ? text.email : text.phone}</label>
          <input
            type={isEmail ? "email" : "tel"}
            name="emailOrPhone"
            placeholder={isEmail ? "farmer@example.com" : "+91 98765 43210"}
            value={form.emailOrPhone}
            onChange={handleInput}
            autoComplete={isEmail ? "email" : "tel"}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="login-form-group">
          <label>{text.password}</label>

          <div className="login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={text.enterPassword}
              value={form.password}
              onChange={handleInput}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>{text.rememberMe}</span>
          </label>

          <Link to="/forgot-password">{text.forgotPassword}</Link>
        </div>

        {/* LOGIN BUTTON */}
        <button className="login-btn" disabled={loading} type="submit">
          {loading ? text.loadingText : text.login}
        </button>

        {/* SIGNUP */}
        <div className="login-signup">
          <span>{text.noAccount}</span>
          <Link to="/signup">{text.signUp}</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
