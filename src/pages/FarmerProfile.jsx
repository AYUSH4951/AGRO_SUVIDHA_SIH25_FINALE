import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, User, Edit2, Check, X, Loader } from "lucide-react";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "../styles/FarmerProfile.css";

function FarmerProfile() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    location: "",
    latitude: null,
    longitude: null,
    landSize: "",
    soilType: "",
    crops: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    location: false,
    farm: false,
  });

  const [tempData, setTempData] = useState({
    name: "",
    location: "",
    landSize: "",
    soilType: "",
    crops: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (currentUser) {
      // seed from local userProfile if available
      setProfileData((prev) => ({
        ...prev,
        name: (userProfile && (userProfile.displayName || userProfile.fullName)) || currentUser.displayName || prev.name,
        email: (userProfile && userProfile.email) || currentUser.email || prev.email,
        location: (userProfile && userProfile.location) || prev.location,
        landSize: (userProfile && userProfile.landSize) || prev.landSize,
        soilType: (userProfile && userProfile.soilType) || prev.soilType,
        crops: (userProfile && userProfile.crops) || prev.crops,
        phone: (userProfile && userProfile.phone) || prev.phone,
      }));

      // fetch authoritative data from Firestore
      (async () => {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap && snap.exists()) {
            const data = snap.data() || {};
            setProfileData((prev) => ({
              ...prev,
              name: data.displayName || prev.name,
              email: data.email || prev.email,
              location: data.location || prev.location,
              landSize: data.landSize ?? prev.landSize,
              soilType: data.soilType ?? prev.soilType,
              crops: data.crops ?? prev.crops,
              phone: data.phone ?? prev.phone,
              latitude: data.latitude ?? prev.latitude,
              longitude: data.longitude ?? prev.longitude,
            }));
          }
        } catch (e) {
          console.warn("Failed to load farmer profile from Firestore:", e);
        } finally {
          // try auto-detect location if not present
          if (!profileData.location) detectLocation();
          setLoading(false);
        }
      })();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await getAddressFromCoordinates(latitude, longitude);
            setProfileData((prev) => ({
              ...prev,
              location: address,
              latitude,
              longitude,
            }));
          } catch {
            setProfileData((prev) => ({
              ...prev,
              location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
              latitude,
              longitude,
            }));
          } finally {
            setLocationLoading(false);
            setLoading(false);
          }
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setError("Could not access your location. Please enable location permissions.");
          setLocationLoading(false);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const key = import.meta.env.VITE_WEATHERAPI_KEY;
      if (key) {
        const q = `${lat},${lon}`;
        const url = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(
          key
        )}&q=${encodeURIComponent(q)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json && json.location && json.location.name) {
          return `${json.location.name}${json.location.region ? ", " + json.location.region : ""}`;
        }
      }
    } catch (e) {
      console.warn("WeatherAPI lookup failed:", e);
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return (
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        `${data.address?.country || "Unknown Location"}`
      );
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      throw err;
    }
  };

  // Persist lightweight profile to localStorage and emit event
  const emitProfileUpdate = (newProfile) => {
    try {
      const stored = {
        fullName: newProfile.name || newProfile.displayName || "",
        email: newProfile.email || "",
        location: newProfile.location || "",
        landSize: newProfile.landSize || "",
        soilType: newProfile.soilType || "",
        crops: newProfile.crops || "",
        phone: newProfile.phone || "",
        role: "farmer",
      };
      localStorage.setItem("farmerProfile", JSON.stringify(stored));
      localStorage.setItem("userProfile", JSON.stringify(stored));
      localStorage.setItem("agroUser", JSON.stringify(stored));
      localStorage.setItem("displayName", stored.fullName || "");
      localStorage.setItem("userName", stored.fullName || "");
      localStorage.setItem("userEmail", stored.email || "");
      window.dispatchEvent(new CustomEvent("agroProfileUpdated", { detail: stored }));
    } catch (e) {
      console.warn("Could not persist profile update:", e);
    }
  };

  // NAME editing
  const handleEditName = () => {
    setEditMode((m) => ({ ...m, name: true }));
    setTempData((t) => ({ ...t, name: profileData.name || "" }));
  };

  const handleSaveName = async () => {
    if (!tempData.name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, { displayName: tempData.name });
      // merge to Firestore
      await setDoc(doc(db, "users", currentUser.uid), {
        displayName: tempData.name,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      const updated = { ...profileData, name: tempData.name };
      setProfileData(updated);
      setEditMode((m) => ({ ...m, name: false }));
      emitProfileUpdate(updated);
      setSuccess("Name updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating name:", err);
      setError("Failed to update name. Try again.");
    }
  };

  const handleCancelNameEdit = () => {
    setEditMode((m) => ({ ...m, name: false }));
    setTempData((t) => ({ ...t, name: "" }));
  };

  // LOCATION editing
  const handleEditLocation = () => {
    setEditMode((m) => ({ ...m, location: true }));
    setTempData((t) => ({ ...t, location: profileData.location || "" }));
  };

  const handleSaveLocation = async () => {
    if (!tempData.location.trim()) {
      setError("Location cannot be empty");
      return;
    }
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        location: tempData.location,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      const updated = { ...profileData, location: tempData.location };
      setProfileData(updated);
      setEditMode((m) => ({ ...m, location: false }));
      emitProfileUpdate(updated);
      setSuccess("Location updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving location:", err);
      setError("Failed to save location.");
    }
  };

  const handleCancelLocationEdit = () => {
    setEditMode((m) => ({ ...m, location: false }));
    setTempData((t) => ({ ...t, location: "" }));
  };

  const handleChangeLocation = () => {
    setLocationLoading(true);
    detectLocation();
  };

  // FARM details editing (landSize, soilType, crops)
  const handleEditFarm = () => {
    setEditMode((m) => ({ ...m, farm: true }));
    setTempData((t) => ({
      ...t,
      landSize: profileData.landSize || "",
      soilType: profileData.soilType || "",
      crops: profileData.crops || "",
      phone: profileData.phone || "",
    }));
  };

  const handleSaveFarm = async () => {
    if (!currentUser) return;
    // optional: basic validation
    const payload = {
      landSize: tempData.landSize || "",
      soilType: tempData.soilType || "",
      crops: tempData.crops || "",
      phone: tempData.phone || "",
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, "users", currentUser.uid), payload, { merge: true });
      const updated = { ...profileData, ...payload };
      setProfileData(updated);
      setEditMode((m) => ({ ...m, farm: false }));
      emitProfileUpdate(updated);
      setSuccess("Farm details updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving farm details:", err);
      setError("Failed to save farm details.");
    }
  };

  const handleCancelFarmEdit = () => {
    setEditMode((m) => ({ ...m, farm: false }));
    setTempData((t) => ({ ...t, landSize: "", soilType: "", crops: "", phone: "" }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("Logout failed:", err);
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    navigate("/");
  };

  if (loading) {
    return (
      <div className="farmer-profile-container">
        <div className="farmer-profile-loading">
          <Loader className="spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  let badgeText = "Farmer Profile";
  if (userProfile?.role === "field_officer" || userProfile?.role === "officer") {
    badgeText = "Field Officer Profile";
  } else if (userProfile?.role === "farmer_officer" || userProfile?.role === "both") {
    badgeText = "Farmer & Field Officer Profile";
  }

  return (
    <div className="farmer-profile-page farmer-profile-bg">
      <div className="farmer-profile-header">
        <div className="farmer-profile-logo-wrap">
          <h2 className="farmer-profile-title">Agro Suvidha</h2>
        </div>
        <span className="farmer-profile-badge">{badgeText}</span>
      </div>

      <div className="farmer-profile-body">
        <div className="farmer-profile-container-main">
          <div className="farmer-profile-card">
            <div className="farmer-profile-header-section">
              <div className="farmer-profile-avatar">
                <User className="farmer-profile-avatar-icon" />
              </div>
              <h3 className="farmer-profile-card-title">Your Profile</h3>
            </div>

            {error && (
              <div className="farmer-profile-alert error-alert">
                <span>{error}</span>
                <button onClick={() => setError("")}>×</button>
              </div>
            )}
            {success && (
              <div className="farmer-profile-alert success-alert">
                <span>{success}</span>
                <button onClick={() => setSuccess("")}>×</button>
              </div>
            )}

            {/* Email (readonly) */}
            <div className="farmer-profile-field">
              <label className="farmer-profile-label">
                <Mail className="farmer-profile-field-icon" />
                Email Address
              </label>
              <div className="farmer-profile-input-wrapper read-only">
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="farmer-profile-input"
                />
              </div>
            </div>

            {/* Name */}
            <div className="farmer-profile-field">
              <label className="farmer-profile-label">
                <User className="farmer-profile-field-icon" />
                Full Name
              </label>
              <div className="farmer-profile-input-wrapper">
                {editMode.name ? (
                  <>
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                      className="farmer-profile-input editing"
                      placeholder="Enter your name"
                    />
                    <div className="farmer-profile-actions">
                      <button onClick={handleSaveName} className="farmer-profile-btn save-btn" title="Save">
                        <Check size={18} />
                      </button>
                      <button onClick={handleCancelNameEdit} className="farmer-profile-btn cancel-btn" title="Cancel">
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input type="text" value={profileData.name} disabled className="farmer-profile-input" />
                    <button onClick={handleEditName} className="farmer-profile-btn edit-btn" title="Edit Name">
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="farmer-profile-field">
              <label className="farmer-profile-label">
                <MapPin className="farmer-profile-field-icon" />
                Location
              </label>
              <div className="farmer-profile-input-wrapper">
                {editMode.location ? (
                  <>
                    <input
                      type="text"
                      value={tempData.location}
                      onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                      className="farmer-profile-input editing"
                      placeholder="Enter your location"
                    />
                    <div className="farmer-profile-actions">
                      <button onClick={handleSaveLocation} className="farmer-profile-btn save-btn" title="Save">
                        <Check size={18} />
                      </button>
                      <button onClick={handleCancelLocationEdit} className="farmer-profile-btn cancel-btn" title="Cancel">
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input type="text" value={profileData.location} disabled className="farmer-profile-input" />
                    <button onClick={handleEditLocation} className="farmer-profile-btn edit-btn" title="Edit Location">
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="farmer-profile-location-actions">
              <button onClick={handleChangeLocation} disabled={locationLoading} className="farmer-profile-btn detect-location-btn">
                {locationLoading ? (
                  <>
                    <Loader size={18} className="spinner-icon" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <MapPin size={18} />
                    Re-detect Current Location
                  </>
                )}
              </button>
            </div>

            {profileData.latitude && profileData.longitude && (
              <div className="farmer-profile-coordinates">
                <p>
                  <strong>Coordinates:</strong> {profileData.latitude.toFixed(4)}, {profileData.longitude.toFixed(4)}
                </p>
              </div>
            )}

            {/* Farm Details (landSize, soilType, crops, phone) */}
            <div className="farmer-profile-farm-section">
              <div className="farm-section-header">
                <h4>Farm Details</h4>
                {!editMode.farm ? (
                  <button className="farmer-profile-btn edit-btn" onClick={handleEditFarm} title="Edit Farm Details">
                    <Edit2 size={16} />
                  </button>
                ) : null}
              </div>

              <div className="farmer-profile-field">
                <label className="farmer-profile-label">Land Size (acres)</label>
                <div className="farmer-profile-input-wrapper">
                  <input
                    type="number"
                    value={editMode.farm ? tempData.landSize : profileData.landSize}
                    disabled={!editMode.farm}
                    onChange={(e) => setTempData({ ...tempData, landSize: e.target.value })}
                    className="farmer-profile-input"
                    placeholder="Enter land size"
                  />
                </div>
              </div>

              <div className="farmer-profile-field">
                <label className="farmer-profile-label">Soil Type</label>
                <div className="farmer-profile-input-wrapper">
                  <input
                    type="text"
                    value={editMode.farm ? tempData.soilType : profileData.soilType}
                    disabled={!editMode.farm}
                    onChange={(e) => setTempData({ ...tempData, soilType: e.target.value })}
                    className="farmer-profile-input"
                    placeholder="e.g., Loamy, Sandy, Clay"
                  />
                </div>
              </div>

              <div className="farmer-profile-field">
                <label className="farmer-profile-label">Preferred Crops</label>
                <div className="farmer-profile-input-wrapper">
                  <input
                    type="text"
                    value={editMode.farm ? tempData.crops : profileData.crops}
                    disabled={!editMode.farm}
                    onChange={(e) => setTempData({ ...tempData, crops: e.target.value })}
                    className="farmer-profile-input"
                    placeholder="e.g., Wheat, Rice, Mustard"
                  />
                </div>
              </div>

              <div className="farmer-profile-field">
                <label className="farmer-profile-label">Phone</label>
                <div className="farmer-profile-input-wrapper">
                  <input
                    type="tel"
                    value={editMode.farm ? tempData.phone : profileData.phone}
                    disabled={!editMode.farm}
                    onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                    className="farmer-profile-input"
                    placeholder="Mobile number"
                  />
                </div>
              </div>

              {editMode.farm && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={handleSaveFarm} className="farmer-profile-btn save-btn">
                    <Check size={16} /> Save
                  </button>
                  <button onClick={handleCancelFarmEdit} className="farmer-profile-btn cancel-btn">
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="farmer-profile-logout-section" style={{ marginTop: 16 }}>
              <button onClick={handleLogout} className="farmer-profile-btn logout-btn">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerProfile;