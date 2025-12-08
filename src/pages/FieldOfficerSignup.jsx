import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Mail,
  Smartphone,
  User,
  MapPin,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import "../styles/FieldOfficerSignup.css";
import { Link } from "react-router-dom";
import logo from "../assets/bluelogo.png";

function FieldOfficerSignup() {
  const [signupType, setSignupType] = useState("email");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (signupType !== "email") {
      setError("Only email signup is supported currently.");
      return;
    }
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Signup successful! You can now log in.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="officersignup-page officer-bg">
      {/* HEADER */}
      <div className="officersignup-header">
        <div className="officersignup-logo-wrap">

          {/* LOGO */}
          <div className="officersignup-logo-image-wrapper">
            <img src={logo} alt="Agro Suvidha Logo" className="officersignup-app-logo" />
          </div>

          <h2 className="officersignup-app-title officer-text">Agro Suvidha</h2>
        </div>

        <span className="officersignup-badge officer-badge">
          Field Officer Registration
        </span>
      </div>

      {/* CONTENT */}
      <div className="officersignup-body">
        <div className="officersignup-container">

          {/* HERO IMAGE */}
          <div className="officersignup-hero-card">
            <div className="officersignup-hero-overlay officer-overlay"></div>
            <div className="officersignup-hero-text">
              <h1>Create New Account</h1>
              <p>Field Officer Registration</p>
            </div>
          </div>

          {/* SIGNUP CARD */}
          <div className="officersignup-card officer-border">

            <h3 className="officersignup-title officer-text">Sign Up</h3>

            {/* SIGNUP TYPE TOGGLE */}
            <div className="officersignup-toggle-box">
              <button
                onClick={() => setSignupType("email")}
                className={`officersignup-toggle-btn ${signupType === "email" ? "officer-active" : ""}`}
              >
                <Mail className="officersignup-toggle-icon" />
                Email Address
              </button>

              <button
                onClick={() => setSignupType("phone")}
                className={`officersignup-toggle-btn ${signupType === "phone" ? "officer-active" : ""}`}
              >
                <Smartphone className="officersignup-toggle-icon" />
                Phone Number
              </button>
            </div>

            {/* NAME */}
            <div className="officersignup-field">
              <label>Full Name</label>
              <div className="officersignup-field-wrap">
                <User className="officersignup-field-icon" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* EMAIL / PHONE */}
            <div className="officersignup-field">
              <label>{signupType === "email" ? "Email Address" : "Phone Number"}</label>
              <div className="officersignup-field-wrap">
                {signupType === "email" ? (
                  <Mail className="officersignup-field-icon" />
                ) : (
                  <Smartphone className="officersignup-field-icon" />
                )}
                <input
                  type={signupType === "email" ? "email" : "tel"}
                  placeholder={signupType === "email" ? "officer@example.com" : "+91 98765 43210"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={signupType !== "email"}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="officersignup-field">
              <label>Password</label>
              <div className="officersignup-field-wrap">
                <Lock className="officersignup-field-icon" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="officersignup-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="officersignup-field">
              <label>Confirm Password</label>
              <div className="officersignup-field-wrap">
                <Lock className="officersignup-field-icon" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="officersignup-eye-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="officersignup-terms-row">
              <input
                type="checkbox"
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label>I accept the terms and conditions</label>
            </div>

            {/* SIGNUP BUTTON */}

            {/* Error/Success Message */}
            {error && <div className="officersignup-error">{error}</div>}
            {success && <div className="officersignup-success">{success}</div>}

            <button
              disabled={!acceptTerms}
              className={`officersignup-btn officer-btn ${!acceptTerms ? "disabled" : ""}`}
              onClick={handleSignup}
            >
              <User className="officersignup-btn-icon" />
              Sign Up
            </button>

            {/* FORGOT PASSWORD LINK */}
            <div className="officersignup-forgot-password-row">
              <Link to="/forgot-password" className="officer-forgot-link">Forgot Password?</Link>
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

export default FieldOfficerSignup;
