import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, User, Edit2, Check, X, Loader } from "lucide-react";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "../styles/FieldOfficerProfile.css";

function FieldOfficerProfile() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    location: "",
    latitude: null,
    longitude: null,
  });

  const [editMode, setEditMode] = useState({ name: false, location: false });
  const [tempData, setTempData] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        name: (userProfile && userProfile.displayName) || currentUser.displayName || "",
        email: (userProfile && userProfile.email) || currentUser.email || "",
      }));

      detectLocation();
    } else {
      navigate("/loginofficer");
    }
  }, [currentUser, userProfile, navigate]);

  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await getLocationViaWeatherAPIOrNominatim(latitude, longitude);
            setProfileData((prev) => ({
              ...prev,
              location: address,
              latitude,
              longitude,
            }));
          } catch (err) {
            console.error("Error getting address:", err);
            setProfileData((prev) => ({
              ...prev,
              location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
              latitude,
              longitude,
            }));
          }
          setLocationLoading(false);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
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

  const getLocationViaWeatherAPIOrNominatim = async (lat, lon) => {
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
      console.warn("WeatherAPI location lookup failed:", e);
    }

    // fallback to Nominatim
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
      throw err;
    }
  };

  const handleEditName = () => {
    setEditMode({ ...editMode, name: true });
    setTempData({ ...tempData, name: profileData.name });
  };

  // Persist and emit profile updates so settings preview updates instantly
  const emitProfileUpdate = (newProfile) => {
    try {
      const stored = {
        fullName: newProfile.name || "",
        email: profileData.email || "",
        location: newProfile.location || profileData.location || "",
        role: "field_officer",
      };
      localStorage.setItem("farmerProfile", JSON.stringify(stored));
      localStorage.setItem("userProfile", JSON.stringify(stored));
      localStorage.setItem("agroUser", JSON.stringify(stored));
      localStorage.setItem("displayName", stored.fullName);
      localStorage.setItem("userName", stored.fullName);
      localStorage.setItem("userEmail", stored.email);
      window.dispatchEvent(new CustomEvent("agroProfileUpdated", { detail: stored }));
    } catch (e) {
      console.warn("Could not persist officer profile update:", e);
    }
  };

  const handleSaveName = async () => {
    if (!tempData.name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (tempData.name === profileData.name) {
      setEditMode({ ...editMode, name: false });
      return;
    }

    try {
      await updateProfile(currentUser, { displayName: tempData.name });

      try {
        await setDoc(doc(db, "users", currentUser.uid), {
          displayName: tempData.name,
          email: currentUser.email,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn("Could not update Firestore:", firestoreErr);
      }

      setProfileData((prev) => ({ ...prev, name: tempData.name }));
      // persist and notify other parts of the app
      emitProfileUpdate({ ...profileData, name: tempData.name });
      setEditMode({ ...editMode, name: false });
      setSuccess("Name updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating name:", err);
      setError("Failed to update name. Please try again.");
    }
  };

  const handleCancelNameEdit = () => {
    setEditMode({ ...editMode, name: false });
    setTempData({ ...tempData, name: "" });
  };

  const handleEditLocation = () => {
    setEditMode({ ...editMode, location: true });
    setTempData({ ...tempData, location: profileData.location });
  };

  const handleSaveLocation = async () => {
    if (!tempData.location.trim()) {
      setError("Location cannot be empty");
      return;
    }

    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        location: tempData.location,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn("Could not save location to Firestore:", e);
    }

    setProfileData((prev) => ({ ...prev, location: tempData.location }));
    setEditMode({ ...editMode, location: false });
    setSuccess("Location updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCancelLocationEdit = () => {
    setEditMode({ ...editMode, location: false });
    setTempData({ ...tempData, location: "" });
  };

  const handleChangeLocation = () => {
    setLocationLoading(true);
    detectLocation();
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
      <div className="officer-profile-container">
        <div className="officer-profile-loading">
          <Loader className="spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Determine badge text based on user role
  let badgeText = "Field Officer Profile";
  if (userProfile?.role === "farmer" ) {
    badgeText = "Farmer Profile";
  } else if (userProfile?.role === "farmer_officer" || userProfile?.role === "both") {
    badgeText = "Farmer & Field Officer Profile";
  }

  return (
    <div className="officer-profile-page officer-profile-bg">
      <div className="officer-profile-header">
        <div className="officer-profile-logo-wrap">
          <h2 className="officer-profile-title">Agro Suvidha</h2>
        </div>
        <span className="officer-profile-badge">{badgeText}</span>
      </div>

      <div className="officer-profile-body">
        <div className="officer-profile-container-main">
          <div className="officer-profile-card">
            <div className="officer-profile-header-section">
              <div className="officer-profile-avatar">
                <User className="officer-profile-avatar-icon" />
              </div>
              <h3 className="officer-profile-card-title">Your Profile</h3>
            </div>

            {error && (
              <div className="officer-profile-alert officer-error-alert">
                <span>{error}</span>
                <button onClick={() => setError("")}>×</button>
              </div>
            )}
            {success && (
              <div className="officer-profile-alert officer-success-alert">
                <span>{success}</span>
                <button onClick={() => setSuccess("")}>×</button>
              </div>
            )}

            <div className="officer-profile-field">
              <label className="officer-profile-label">
                <Mail className="officer-profile-field-icon" />
                Email Address
              </label>
              <div className="officer-profile-input-wrapper read-only">
                <input type="email" value={profileData.email} disabled className="officer-profile-input" />
              </div>
            </div>

            <div className="officer-profile-field">
              <label className="officer-profile-label">
                <User className="officer-profile-field-icon" />
                Full Name
              </label>
              <div className="officer-profile-input-wrapper">
                {editMode.name ? (
                  <>
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTempData({ ...tempData, name: v });
                        emitProfileUpdate({ ...profileData, name: v });
                      }}
                      className="officer-profile-input editing"
                      placeholder="Enter your name"
                    />
                    <div className="officer-profile-actions">
                      <button onClick={handleSaveName} className="officer-profile-btn officer-save-btn" title="Save">
                        <Check size={18} />
                      </button>
                      <button onClick={handleCancelNameEdit} className="officer-profile-btn officer-cancel-btn" title="Cancel">
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input type="text" value={profileData.name} disabled className="officer-profile-input" />
                    <button onClick={handleEditName} className="officer-profile-btn officer-edit-btn" title="Edit Name">
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="officer-profile-field">
              <label className="officer-profile-label">
                <MapPin className="officer-profile-field-icon" />
                Location
              </label>
              <div className="officer-profile-input-wrapper">
                {editMode.location ? (
                  <>
                    <input
                      type="text"
                      value={tempData.location}
                      onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                      className="officer-profile-input editing"
                      placeholder="Enter your location"
                    />
                    <div className="officer-profile-actions">
                      <button onClick={handleSaveLocation} className="officer-profile-btn officer-save-btn" title="Save">
                        <Check size={18} />
                      </button>
                      <button onClick={handleCancelLocationEdit} className="officer-profile-btn officer-cancel-btn" title="Cancel">
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input type="text" value={profileData.location} disabled className="officer-profile-input" />
                    <button onClick={handleEditLocation} className="officer-profile-btn officer-edit-btn" title="Edit Location">
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="officer-profile-location-actions">
              <button onClick={handleChangeLocation} disabled={locationLoading} className="officer-detect-location-btn">
                {locationLoading ? (
                  <>
                    <Loader size={18} className="spinner" />
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
              <div className="officer-profile-coordinates">
                <p>
                  <strong>Coordinates:</strong> {profileData.latitude.toFixed(4)}, {profileData.longitude.toFixed(4)}
                </p>
              </div>
            )}

            <div className="officer-profile-logout-section">
              <button onClick={handleLogout} className="officer-logout-btn">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldOfficerProfile;