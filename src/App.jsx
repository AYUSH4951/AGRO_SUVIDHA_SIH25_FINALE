// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import GoogleTranslate from "./GoogleTranslate";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "../components/ProtectedRoute";

import Home from "./pages/Home";
import LanguageSelect from "./pages/LanguageSelect";
import Login from "./pages/Login";
import LoginOfficer from "./pages/LoginOfficer";
import RoleSelect from "./pages/RoleSelect";
import FarmerSignup from "./pages/FarmerSignup";
import FieldOfficerSignup from "./pages/FieldOfficerSignup";
import MainDashboard from "./pages/MainDashboard";
import CropManager from "./pages/CropManager";
import AboutUs from "./pages/AboutUs";
import Forecast from "./pages/Forecast";
import DiseaseSolution from "./pages/DiseaseSolution";
import MandiPrice from "./pages/MandiPrice";
import SoilAnalyser from "./pages/SoilAnalyser";
import KisanMitra from "./pages/KisanMitra";
import FieldOfficerResult from "./pages/FieldOfficerResult";
import ForgotPassword from "./pages/ForgotPassword";
import FieldOfficerDashboard from "./pages/FieldOfficerDashboard";
import ImageScanner from "./pages/ImageScanner";
import CombinedResult from "./pages/CombinedResult";
import Profile from "./pages/FarmerProfile";
import Settings_language from "./pages/Settings_language";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <header>
            <GoogleTranslate />
          </header>

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/language" element={<LanguageSelect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginofficer" element={<LoginOfficer />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/signup" element={<FarmerSignup />} />
            <Route path="/signupofficer" element={<FieldOfficerSignup />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/weather" element={<Forecast />} />
            <Route path="/mandi" element={<MandiPrice />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/setlanguage" element={<Settings_language />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<Help />} />
            <Route path="/get-started" element={<Navigate to="/role-select" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Farmer protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <CropManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solution"
              element={
                <ProtectedRoute>
                  <DiseaseSolution />
                </ProtectedRoute>
              }
            />
            <Route
              path="/soil"
              element={
                <ProtectedRoute>
                  <SoilAnalyser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedRoute>
                  <KisanMitra />
                </ProtectedRoute>
              }
            />

            {/* Field officer protected routes 
            <Route
              path="/field-officer/dashboard"
              element={
                <ProtectedRoute>
                  <FieldOfficerDashboard />
                </ProtectedRoute>
              }
            />*/}
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <ImageScanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan-result"
              element={
                <ProtectedRoute>
                  <CombinedResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/field-officer/advisor"
              element={
                <ProtectedRoute>
                  <FieldOfficerResult />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;