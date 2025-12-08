// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GoogleTranslate from "./GoogleTranslate";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "../components/ProtectedRoute";

import Home from "./pages/Home";
import LanguageSelect from "./pages/LanguageSelect";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import LoginOfficer from "./pages/LoginOfficer";
import RoleSelect from "./pages/RoleSelect";
import FarmerSignup from "./pages/FarmerSignup";
import FieldOfficerSignup from "./pages/FieldOfficerSignup";
import MainDashboard from "./pages/MainDashboard";
import FarmerProfile from "./pages/FarmerProfile";
import FieldOfficerProfile from "./pages/FieldOfficerProfile";
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
            <Route path="/get-started" element={<GetStarted />} />

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

            {/* Farmer profile */}
            <Route
              path="/farmer-profile"
              element={
                <ProtectedRoute>
                  <FarmerProfile />
                </ProtectedRoute>
              }
            />

            {/* Field officer protected routes */}
            <Route
              path="/field-officer-profile"
              element={
                <ProtectedRoute>
                  <FieldOfficerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/field-officer/dashboard"
              element={
                <ProtectedRoute>
                  <FieldOfficerDashboard />
                </ProtectedRoute>
              }
            />
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
