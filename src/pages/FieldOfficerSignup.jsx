import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/FieldOfficerSignup.css";
import { Link } from "react-router-dom";
import logo from "../assets/bluelogo.png";
import heroImg from "../assets/login_crop.jpg";

function FieldOfficerSignup() {
  const [isEmail, setIsEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName || !form.emailOrPhone || !form.password || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (!isEmail) {
      setError("Only email signup is supported currently.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, form.emailOrPhone, form.password);
      setSuccess("Signup successful! You can now log in.");
      setForm({
        fullName: "",
        emailOrPhone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="officersignup-container">
      <div className="officersignup-header">
        <div className="officersignup-logo">
          <img src={logo} alt="logo" />
          <h1>Agro Suvidha</h1>
        </div>
      </div>

      <div className="officersignup-hero">
        <img src={heroImg} alt="Smart Farming" />
        <div className="officersignup-hero-overlay">
          <div>
            <h1>Namaste!</h1>
            <p>Create your account to continue</p>
          </div>
        </div>
      </div>

      <form className="officersignup-card" onSubmit={handleSignup}>
        <div className="officersignup-toggle-buttons">
          <button
            type="button"
            className={isEmail ? "active" : ""}
            onClick={() => setIsEmail(true)}
          >
            Email
          </button>

          <button
            type="button"
            className={!isEmail ? "active" : ""}
            onClick={() => setIsEmail(false)}
          >
            Phone
          </button>
        </div>

        <h3>Sign Up</h3>

        {error && <div className="officersignup-error">{error}</div>}
        {success && <div className="officersignup-success">{success}</div>}

        <div className="officersignup-form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleInput}
            required
          />
        </div>

        <div className="officersignup-form-group">
          <label>{isEmail ? "Email Address" : "Phone Number"}</label>
          <input
            type={isEmail ? "email" : "tel"}
            name="emailOrPhone"
            placeholder={isEmail ? "officer@example.com" : "+91 98765 43210"}
            value={form.emailOrPhone}
            onChange={handleInput}
            required
          />
        </div>

        <div className="officersignup-form-group">
          <label>Password</label>
          <div className="officersignup-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
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

        <div className="officersignup-form-group">
          <label>Confirm Password</label>
          <div className="officersignup-password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
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

        <button className="officersignup-btn" disabled={loading} type="submit">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="officersignup-signin">
          <span>Already have an account?</span>
          <Link to="/loginofficer">Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default FieldOfficerSignup;
