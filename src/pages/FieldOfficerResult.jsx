import React, { useState } from "react";
import "../styles/FieldOfficerResult.css";

export default function FieldOfficerResult() {
  const [formData, setFormData] = useState({
    landSize: "",
    soilPH: "",
    region: "",
    season: "",
    waterAvailability: "",
    budgetLevel: "",
    pastCultivated: "",
    pastCropType: "",
    pastCropHistory: "",
    soilType: "",
    soilImage: null,
  });

  // case 2: no crop planted → 3 cards
  const [results, setResults] = useState([]);
  // case 1: crop already planted → detailed advisory object
  const [advisory, setAdvisory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, pastCultivated: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, soilImage: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.soilImage && !formData.soilType) {
      alert("Please either upload a soil image or select soil type.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResults([]);
      setAdvisory(null);

      const fd = new FormData();

      if (formData.soilImage) {
        fd.append("image", formData.soilImage);
      }
      if (formData.soilType) {
        fd.append("soil_type", formData.soilType);
      }

      fd.append("land_size", String(formData.landSize || 0));
      fd.append("soil_pH", String(formData.soilPH || 7));
      fd.append("water_availability", formData.waterAvailability);
      fd.append("season", formData.season);
      fd.append("region", formData.region);
      fd.append("budget_level", formData.budgetLevel);
      fd.append("past_crop_history", formData.pastCropHistory || "");
      fd.append("crop_planted", String(formData.pastCultivated === "yes"));

      if (formData.pastCultivated === "yes" && formData.pastCropType) {
        fd.append("planted_crop", formData.pastCropType);
      }

      const res = await fetch("http://localhost:8003/recommend-soil", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await res.json();
      console.log("advisor data:", data);

      if (formData.pastCultivated === "yes") {
        // planted crop → detailed advisory JSON
        setAdvisory(data);
      } else {
        // no crop planted → 3 recommendations
        setResults(data.recommendations || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-form-container">
      <h2 className="advisor-title">Enter Farm Details</h2>
      <p className="advisor-desc">
        Provide accurate information for personalized crop recommendations
      </p>

      {/* INPUT FORM */}
      <form className="advisor-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label>
              Land Size (hectare) <span className="required">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 5.5"
              value={formData.landSize}
              onChange={(e) => handleChange("landSize", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Region <span className="required">*</span>
            </label>
            <select
              value={formData.region}
              onChange={(e) => handleChange("region", e.target.value)}
              required
            >
              <option value="">Select region</option>
              <option value="punjab">Punjab</option>
              <option value="haryana">Haryana</option>
              {/* add more */}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>
              Season <span className="required">*</span>
            </label>
            <select
              value={formData.season}
              onChange={(e) => handleChange("season", e.target.value)}
              required
            >
              <option value="">Select season</option>
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="zaid">Zaid</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Water Availability <span className="required">*</span>
            </label>
            <select
              value={formData.waterAvailability}
              onChange={(e) =>
                handleChange("waterAvailability", e.target.value)
              }
              required
            >
              <option value="">Select water availability</option>
              <option value="rainfed">Rainfed</option>
              <option value="irrigation">Irrigation</option>
              <option value="mixed">medium</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>
              Soil pH <span className="required">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g., 6.5"
              value={formData.soilPH}
              onChange={(e) => handleChange("soilPH", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Budget Level <span className="required">*</span>
            </label>
            <select
              value={formData.budgetLevel}
              onChange={(e) => handleChange("budgetLevel", e.target.value)}
              required
            >
              <option value="">Select budget level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Past crop question */}
        <div className="form-group">
          <label>
            Have you cultivated any crop in the past on this land?{" "}
            <span className="required">*</span>
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="yes"
                checked={formData.pastCultivated === "yes"}
                onChange={() => handleRadioChange("yes")}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={formData.pastCultivated === "no"}
                onChange={() => handleRadioChange("no")}
                required
              />
              No
            </label>
          </div>
        </div>

        {formData.pastCultivated === "yes" && (
          <>
            <div className="form-group">
              <label>
                Past Crop Type <span className="required">*</span>
              </label>
              <select
                value={formData.pastCropType}
                onChange={(e) => handleChange("pastCropType", e.target.value)}
                required
              >
                <option value="">Select crop type</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="cotton">Cotton</option>
                <option value="sugarcane">Sugarcane</option>
                <option value="pulses">Pulses</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Past Crops Details{" "}
                <span className="optional-label">Optional</span>
              </label>
              <textarea
                rows={3}
                placeholder="Example: Last 3 years – wheat, rice, cotton..."
                value={formData.pastCropHistory}
                onChange={(e) =>
                  handleChange("pastCropHistory", e.target.value)
                }
              />
            </div>
          </>
        )}

        <div className="form-group section-label">
          <label>
            Soil type (choose one method){" "}
            <span className="optional-label">Optional</span>
          </label>
          <div className="dashed-box">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />
            <p>Upload soil image (optional)</p>
            <span className="file-hint">JPG, PNG up to 10MB</span>
          </div>
        </div>

        <div className="form-group">
          <label>
            Soil Type <span className="optional-label">Optional</span>
          </label>
          <select
            value={formData.soilType}
            onChange={(e) => handleChange("soilType", e.target.value)}
          >
            <option value="">Select soil type</option>
            <option value="alluvial">Alluvial</option>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="laterite">Laterite</option>
            <option value="desert">Desert</option>
            <option value="mountain">Mountain</option>
          </select>
        </div>

        <button className="get-recommendation-btn" type="submit">
          {loading ? "Generating..." : "Get Recommendation"}
        </button>
      </form>

      {error && <p style={{ marginTop: 16, color: "red" }}>{error}</p>}

      {/* Loading card while waiting for backend */}
      {loading && (
        <div className="advisor-results loading-card">
          <div className="loading-inner">
            <div className="loading-icon">✨</div>
            <h3 className="loading-title">Analyzing Your Farm Data...</h3>
            <p className="loading-subtitle">
              Processing soil conditions, climate data, and generating
              personalized recommendations.
            </p>
          </div>
        </div>
      )}

      {/* CASE 2: no crop planted → 3 recommendation cards */}
      {results.length > 0 && formData.pastCultivated === "no" && (
        <div className="advisor-results">
          <div className="results-badge">🌱 Recommendations Ready</div>
          <h3 className="results-title">Recommended Crops for Your Field</h3>
          <p className="results-subtitle">
            Top {results.length} crop recommendations based on your farm details
          </p>

          <div className="results-grid">
            {results.map((crop, idx) => (
              <div key={idx} className="crop-card">
                <div className="crop-card-header">
                  <div className="crop-icon">🌿</div>
                  <div className="crop-name">{crop.name}</div>
                </div>

                <p className="crop-desc">{crop.short_reason}</p>

                <div className="crop-row">
                  <span className="label">Estimated Cost:</span>
                  <span className="value">{crop.estimated_cost}</span>
                </div>
                <div className="crop-row">
                  <span className="label">Expected Yield:</span>
                  <span className="value">{crop.expected_yield}</span>
                </div>
                <div className="crop-row">
                  <span className="label">Expected Profit:</span>
                  <span className="value highlight">
                    {crop.expected_profit}
                  </span>
                </div>
                <div className="crop-row">
                  <span className="label">Risk Level:</span>
                  <span
                    className={
                      "pill " +
                      (crop.risk_level?.toLowerCase().includes("low")
                        ? "pill-low"
                        : "pill-medium")
                    }
                  >
                    {crop.risk_level}
                  </span>
                </div>
                <div className="crop-row">
                  <span className="label">Sowing Window:</span>
                  <span className="value">{crop.sowing_window}</span>
                </div>
                <div className="crop-row">
                  <span className="label">Fertilizer Plan:</span>
                  <span className="value">{crop.fertilizer_plan}</span>
                </div>
                <div className="crop-row">
                  <span className="label">Pests & Diseases:</span>
                  <span className="value">{crop.pest_disease_risk}</span>
                </div>
                <div className="crop-row">
                  <span className="label">Pesticides & Dosage:</span>
                  <span className="value">{crop.recommended_pesticides}</span>
                </div>
                <div className="crop-row">
                  <span className="label">IPM Practices:</span>
                  <span className="value">{crop.ipm_practices}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CASE 1: crop already planted → detailed advisory */}
      {advisory && formData.pastCultivated === "yes" && (
        <div className="advisor-results planted-advisory">
          <div className="advisory-header-card">
            <h3 className="adv-title">
              {advisory.summary_title || advisory.crop_name}
            </h3>
            <p className="adv-summary-line">{advisory.summary_line}</p>
          </div>

          <div className="adv-stats-row">
            <div className="adv-stat-card">
              <div className="adv-stat-label">Expected Yield</div>
              <div className="adv-stat-value">{advisory.expected_yield}</div>
            </div>
            <div className="adv-stat-card">
              <div className="adv-stat-label">Market Price</div>
              <div className="adv-stat-value">{advisory.market_price}</div>
            </div>
          </div>

          {/* Fertilizer plan */}
          <section className="adv-section adv-fert">
            <h4>{advisory.fertilizer_plan?.basal_title}</h4>
            <ul>
              {advisory.fertilizer_plan?.basal_points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <h4 style={{ marginTop: 16 }}>
              {advisory.fertilizer_plan?.topdressing_title}
            </h4>
            <ul>
              {advisory.fertilizer_plan?.topdressing_points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>

          {/* Irrigation schedule */}
          <section className="adv-section adv-irrigation">
            <h4>{advisory.irrigation_schedule?.title}</h4>
            <ul>
              {advisory.irrigation_schedule?.points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>

          {/* Major risks */}
          <section className="adv-section adv-risks">
            <h4>{advisory.major_risks?.title}</h4>
            <ul>
              {advisory.major_risks?.points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>

          {/* Preventive steps */}
          <section className="adv-section adv-preventive">
            <h4>{advisory.preventive_steps?.title}</h4>
            <ul>
              {advisory.preventive_steps?.points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>

          {/* Warnings / advice */}
          <section className="adv-section adv-warning">
            <h4>{advisory.warnings_advice?.title}</h4>
            <ul>
              {advisory.warnings_advice?.points?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
