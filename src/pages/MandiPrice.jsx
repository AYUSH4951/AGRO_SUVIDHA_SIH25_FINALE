// src/pages/MandiPrice.jsx
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  IndianRupee,
  Wheat,
  MapPin,
  BarChart3,
  Navigation,
  Target,
  TrendingUp,
  Calculator,
} from "lucide-react";
import "../styles/MandiPrice.css";

export default function MandiPrice() {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [locationVisible, setLocationVisible] = useState(false);
  const [priceBtnEnabled, setPriceBtnEnabled] = useState(false);
  const [crop, setCrop] = useState("wheat");
  const [quantity, setQuantity] = useState(10);
  const [transportCost, setTransportCost] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {}, []);

  function detectLocation() {
    setLocationVisible(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLatitude(pos.coords.latitude);
        setUserLongitude(pos.coords.longitude);
        setPriceBtnEnabled(true);
      },
      () => {
        setError("Location detection failed. Please allow location access.");
      }
    );
  }

  async function getPrices() {
    setError(null);

    if (!userLatitude || !userLongitude) {
      setError("Please detect your location first.");
      return;
    }
    if (!crop.trim()) {
      setError("Enter a crop name.");
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }
    if (isNaN(transportCost) || transportCost < 0) {
      setError("Transport cost cannot be negative.");
      return;
    }

    setLoading(true);
    setResults(null);

    const payload = {
      crop,
      quantity_quintal: quantity,
      transport_cost_per_km: transportCost,
      latitude: userLatitude,
      longitude: userLongitude,
      state: "",
    };

    try {
      const res = await fetch(
        "https://mandi-price-backend.onrender.com/price-lookup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let err = `Server returned ${res.status}`;
        try {
          const json = await res.json();
          if (json.detail) err = json.detail;
        } catch {}
        throw new Error(err);
      }

      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError("Error fetching prices: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mandi-root">
      {/* HEADER */}
      <header className="mandi-header">
        <a href="/dashboard" className="mandi-back" aria-label="back">
          <ArrowLeft />
        </a>

        <div className="mandi-rupee">
          <IndianRupee />
        </div>

        <div>
          <h1>Smart Crop Advisory - Live Data</h1>
          <p>Real-time mandi prices and profit analysis</p>
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="mandi-main">
        {/* LEFT BLOCK */}
        <div className="mandi-left">
          <div className="mandi-card">
            <h2>
              <Wheat /> Market Price Calculator
            </h2>

            <div className="grid grid-3" style={{ marginTop: 8 }}>
              <div>
                <label htmlFor="crop">Crop</label>
                <select
                  id="crop"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                >
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity">Quantity (quintals)</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(parseFloat(e.target.value || "0"))}
                />
              </div>

              <div>
                <label htmlFor="transport">Transport cost per km (₹)</label>
                <input
                  id="transport"
                  type="number"
                  value={transportCost}
                  min="0"
                  onChange={(e) =>
                    setTransportCost(parseFloat(e.target.value || "0"))
                  }
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="mandi-btn-voice" onClick={detectLocation}>
                <MapPin /> Select My Location
              </button>

              {locationVisible && (
                <div className="mandi-location-box">
                  <p>
                    <Navigation /> <strong>Location detected:</strong>
                  </p>
                  <p>
                    {userLatitude
                      ? `Latitude ${userLatitude.toFixed(4)}, Longitude ${userLongitude.toFixed(
                          4
                        )}`
                      : "Detecting..."}
                  </p>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <button
                  className="mandi-btn-primary"
                  onClick={getPrices}
                  disabled={!priceBtnEnabled || loading}
                >
                  <BarChart3 /> {loading ? "Fetching..." : "Get Mandi Prices"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BLOCK */}
        <div className="mandi-right">

         {/* {/* Placeholder Panel 
          {!results && !error && (
            <div className="mandi-card info-panel">
              Detect location and click "Get Mandi Prices" to see results.
            </div>
          )}*/}

          {/* ERROR */}
          {error && (
            <div className="mandi-card error-panel">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* RESULTS */}
          {results && (
            <div className="mandi-card">

              {/* Nearest Mandi */}
              <h2>
                <Target /> Nearest Mandi
              </h2>
              <div className="mandi-item">
                <strong>{results.nearest_mandi.mandi_name}</strong>
                <div>Price per quintal: ₹{results.nearest_mandi.price_per_quintal}</div>
                <div>Distance: {results.nearest_mandi.distance_km} km</div>
              </div>

              {/* Highest Profit */}
              <h2 style={{ marginTop: 12 }}>
                <TrendingUp /> Highest Profit Mandi
              </h2>
              <div className="mandi-item">
                <strong>{results.highest_profit_mandi.mandi_name}</strong>
                <div>Price per quintal: ₹{results.highest_profit_mandi.price_per_quintal}</div>
                <div>Distance: {results.highest_profit_mandi.distance_km} km</div>
              </div>

              {/* All Mandis */}
              <h2 style={{ marginTop: 12 }}>
                <Calculator /> All Mandis (Top {results.all_mandis.length})
              </h2>
              {results.all_mandis.map((m, i) => (
                <div className="mandi-item" key={i}>
                  <strong>{i + 1}. {m.mandi_name}</strong>
                  <div>Price: ₹{m.price_per_quintal}</div>
                  <div>Distance: {m.distance_km} km</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
