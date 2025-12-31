import React, { useState } from "react";
import {
  Mail,
  Smartphone,
  User,
  MapPin,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import "../styles/FarmerSignup.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/leaflogo.png"; // ✔ IMPORT LOGO

function FarmerSignup() {
  const [signupType, setSignupType] = useState("email");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { signup, setPersistenceForRemember, getCurrentUserToken } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="signup-page farmer-bg">
      {/* HEADER */}
      <div className="signup-header">
        <div className="signup-logo-wrap">

          {/* ✔ USE LOGO */}
          <div className="signup-logo-image-wrapper">
            <img src={logo} alt="Agro Suvidha Logo" className="signup-app-logo" />
          </div>

          <h2 className="signup-app-title farmer-text">Agro Suvidha</h2>
        </div>

        <span className="signup-badge farmer-badge">
          Farmer Registration
        </span>
      </div>

      {/* CONTENT */}
      <div className="signup-body">
        <div className="signup-container">

          {/* HERO IMAGE */}
          <div className="signup-hero-card">
            <img
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1080&q=80"
              className="signup-hero-img"
              alt="Farmer"
            />
            <div className="signup-hero-overlay farmer-overlay"></div>
            <div className="signup-hero-text">
              <h1>Create New Account</h1>
              <p>Farmer Registration</p>
            </div>
          </div>

          {/* SIGNUP CARD */}
          <div className="signup-card farmer-border">

            <h3 className="signup-title farmer-text">Sign Up</h3>

            {/* SIGNUP TYPE TOGGLE */}
            <div className="signup-toggle-box">
              <button
                onClick={() => setSignupType("email")}
                className={`signup-toggle-btn ${signupType === "email" ? "farmer-active" : ""}`}
              >
                <Mail className="signup-toggle-icon" />
                Email Address
              </button>

              <button
                onClick={() => setSignupType("phone")}
                className={`signup-toggle-btn ${signupType === "phone" ? "farmer-active" : ""}`}
              >
                <Smartphone className="signup-toggle-icon" />
                Phone Number
              </button>
            </div>

            {/* NAME */}
            <div className="signup-field">
              <label>Full Name</label>
              <div className="signup-field-wrap">
                <User className="signup-field-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>

            {/* EMAIL / PHONE */}
            <div className="signup-field">
              <label>{signupType === "email" ? "Email Address" : "Phone Number"}</label>
              <div className="signup-field-wrap">
                {signupType === "email" ? (
                  <Mail className="signup-field-icon" />
                ) : (
                  <Smartphone className="signup-field-icon" />
                )}
                <input
                  type={signupType === "email" ? "email" : "tel"}
                  name="emailOrPhone"
                  placeholder={signupType === "email" ? "farmer@example.com" : "+91 98765 43210"}
                  value={form.emailOrPhone}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="signup-field">
              <label>Password</label>
              <div className="signup-field-wrap">
                <Lock className="signup-field-icon" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleInput}
                />
                <button
                  type="button"
                  className="signup-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="signup-field">
              <label>Confirm Password</label>
              <div className="signup-field-wrap">
                <Lock className="signup-field-icon" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleInput}
                />
                <button
                  type="button"
                  className="signup-eye-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="signup-terms-row">
              <input
                type="checkbox"
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label>I accept the terms and conditions</label>
            </div>

            {/* show error */}
            {error && <div className="signup-error">{error}</div>}

            {/* SIGNUP */}
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                setError("");

                // basic validation
                if (!acceptTerms) {
                  setError("Please accept the terms and conditions.");
                  return;
                }

                if (signupType !== "email") {
                  setError("Phone signup is not implemented. Please use Email.");
                  return;
                }

                if (!form.fullName || !form.emailOrPhone || !form.password || !form.confirmPassword) {
                  setError("Please fill all fields.");
                  return;
                }

                if (form.password !== form.confirmPassword) {
                  setError("Passwords do not match.");
                  return;
                }

                setLoading(true);
                try {
                  try {
                    await setPersistenceForRemember(true);
                  } catch (persErr) {
                    console.warn("Could not set persistence:", persErr);
                  }

                  // perform signup (signup returns a Firebase UserCredential)
                  const cred = await signup(form.emailOrPhone, form.password, form.fullName);

                  // Generate Firebase ID token and verify with backend
                  const token = await getCurrentUserToken();
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
                  alert("User verified!");

                  // Push signup data to backend
                  try {
                    await fetch("https://auth-backend-285018970008.asia-south1.run.app/data", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        data: {
                          name: form.fullName,
                          email: form.emailOrPhone,
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
                    console.warn("Could not push signup data to backend:", pushErr);
                  }

                  // Try to set displayName on the auth user if possible (Firebase UserCredential.user.updateProfile)
                  try {
                    if (cred?.user && typeof cred.user.updateProfile === "function") {
                      await cred.user.updateProfile({ displayName: form.fullName });
                    }
                  } catch (uErr) {
                    console.warn("Could not set auth user displayName:", uErr);
                  }

                  // Persist the farmer profile locally so profile pages can show actual provided name/email
                  const profile = {
                    fullName: form.fullName,
                    email: form.emailOrPhone,
                    role: "farmer",
                    createdAt: Date.now()
                  };
                  try {
                    // save under multiple common keys so other parts of the app find it
                    localStorage.setItem("farmerProfile", JSON.stringify(profile));
                    localStorage.setItem("userProfile", JSON.stringify(profile));
                    localStorage.setItem("agroUser", JSON.stringify(profile));
                    localStorage.setItem("displayName", form.fullName);
                    localStorage.setItem("userName", form.fullName);
                    localStorage.setItem("userEmail", form.emailOrPhone);
                    // emit a custom event so UI in same tab can react immediately
                    window.dispatchEvent(new CustomEvent("agroProfileUpdated", { detail: profile }));
                  } catch (lsErr) {
                    console.warn("Could not save farmerProfile to localStorage:", lsErr);
                  }

                  // on success navigate
                  navigate("/dashboard");
                } catch (err) {
                  console.error("Signup error:", err);
                  let msg = "Failed to create account.";
                  if (err?.code === "auth/email-already-in-use") msg = "Email already in use.";
                  else if (err?.code === "auth/weak-password") msg = "Password is too weak.";
                  else if (err?.message) msg = err.message;
                  setError(msg);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={!acceptTerms || loading}
              className={`signup-btn farmer-btn ${!acceptTerms ? "disabled" : ""}`}
            >
              <User className="signup-btn-icon" />
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {/* FORGOT PASSWORD LINK */}
            <div className="signup-forgot-password-row">
              <Link to="/forgot-password" className="farmer-forgot-link">Forgot Password?</Link>
            </div>


            {/* SIGN IN LINK */}
            <div className="officersignup-signin-row">
              <span>Already have an account?</span>
              <Link to="/loginofficer" className="officer-link">Sign In</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerSignup;
