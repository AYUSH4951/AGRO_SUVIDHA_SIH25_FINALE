import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { auth } from "../../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      setEmail("");
      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      let message = "Failed to send reset email.";
      if (err?.code === "auth/user-not-found") {
        message = "No user found with this email address.";
      } else if (err?.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* HEADER */}
      <div className="forgot-password-header">
        <Link to="/login" className="forgot-password-back">
          <ArrowLeft size={20} />
          Back to Login
        </Link>
      </div>

      {/* CONTENT */}
      <div className="forgot-password-body">
        <div className="forgot-password-container">
          {/* CARD */}
          <div className="forgot-password-card">
            <div className="forgot-password-icon">
              <Mail size={48} />
            </div>

            <h2 className="forgot-password-title">Forgot Your Password?</h2>
            <p className="forgot-password-subtitle">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Error Message */}
            {error && <div className="forgot-password-error">{error}</div>}

            {/* Success Message */}
            {success && <div className="forgot-password-success">{success}</div>}

            {/* Form */}
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <div className="forgot-password-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="forgot-password-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Additional Links */}
            <div className="forgot-password-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="forgot-password-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
