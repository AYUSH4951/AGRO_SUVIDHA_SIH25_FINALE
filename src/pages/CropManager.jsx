import React, { useState, useMemo, useEffect } from "react";
import "../styles/CropManager.css";
import "../styles/Weather.css";
import { HomeIcon, Sprout, Sun, Settings, Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

/* -------------------------
   Translations & helpers
   ------------------------- */
const translations = {
  en: {
    crops: {
      title: "Crops",
      addNewCrop: "Add New Crop",
      cropName: "Crop Name",
      variety: "Variety",
      field: "Field",
      area: "Area",
      plantingDate: "Planting Date",
      expectedHarvest: "Expected Harvest",
      growthStage: "Growth Stage",
      addCrop: "Add Crop",
      viewDetails: "View Details",
      wateringSchedule: "Watering Schedule",
      lastWatered: "Last watered",
    },
    common: { select: "Select", cancel: "Cancel", update: "Update" },
    cropNames: {
      tomatoes: "Tomatoes",
      corn: "Corn",
      wheat: "Wheat",
      soybeans: "Soybeans",
    },
    fieldNames: {
      northField: "North Field",
      southField: "South Field",
      eastField: "East Field",
      westField: "West Field",
    },
    growthStages: {
      germination: "Germination",
      growing: "Growing",
      flowering: "Flowering",
      ready: "Ready",
    },
    healthStatus: {
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
    },
    timeLabels: { daysAgo: "days ago" },
    subtitle: "Monitor and manage all your crops in one place",
    brandTitle: "AgroSubhidha",
    brandSubtitle: "Farmer's Digital Companion",
    navHome: "Home",
    navCrops: "Crops",
    navWeather: "Weather",
    navSettings: "Settings",
    navLanguage: "Language",
    navAbout: "About Us",
    areaUnit: "(acres)",
    areaPlaceholder: "2.5",
  },
  hi: {
    crops: {
      title: "फसलें",
      addNewCrop: "नई फसल जोड़ें",
      cropName: "फसल का नाम",
      variety: "किस्म",
      field: "खेत",
      area: "क्षेत्र",
      plantingDate: "रोपण तिथि",
      expectedHarvest: "कटाई की तिथि",
      growthStage: "विकास चरण",
      addCrop: "फसल जोड़ें",
      viewDetails: "विवरण देखें",
      wateringSchedule: "सिंचाई अनुसूची",
      lastWatered: "अंतिम सिंचाई",
    },
    common: { select: "चुनें", cancel: "रद्द करें", update: "अपडेट" },
    cropNames: {
      tomatoes: "टमाटर",
      corn: "मक्का",
      wheat: "गेहूं",
      soybeans: "सोयाबीन",
    },
    fieldNames: {
      northField: "उत्तरी खेत",
      southField: "दक्षिणी खेत",
      eastField: "पूर्वी खेत",
      westField: "पश्चिमी खेत",
    },
    growthStages: {
      germination: "अंकुरण",
      growing: "वृद्धि",
      flowering: "फूल आना",
      ready: "तैयार",
    },
    healthStatus: {
      excellent: "उत्तम",
      good: "अच्छा",
      fair: "ठीक",
      poor: "खराब",
    },
    timeLabels: { daysAgo: "दिन पहले" },
    subtitle: "अपनी सभी फसलों को एक ही जगह पर मॉनिटर और प्रबंधित करें",
    brandTitle: "एग्रो सुविधा",
    brandSubtitle: "किसान का डिजिटल साथी",
    navHome: "होम",
    navCrops: "फसलें",
    navWeather: "मौसम",
    navSettings: "सेटिंग्स",
    navLanguage: "भाषा",
    navAbout: "हमारे बारे में",
    areaUnit: "(एकड़)",
    areaPlaceholder: "2.5",
  },
  bn: {
    crops: {
      title: "ফসল",
      addNewCrop: "নতুন ফসল যোগ করুন",
      cropName: "ফসলের নাম",
      variety: "জাত",
      field: "ক্ষেত",
      area: "এলাকা",
      plantingDate: "রোপণের তারিখ",
      expectedHarvest: "ফসল কাটার তারিখ",
      growthStage: "বৃদ্ধি পর্যায়",
      addCrop: "ফসল যোগ করুন",
      viewDetails: "বিস্তারিত দেখুন",
      wateringSchedule: "সেচের সময়সূচি",
      lastWatered: "শেষ সেচ",
    },
    common: { select: "নির্বাচন", cancel: "বাতিল", update: "আপডেট" },
    cropNames: {
      tomatoes: "টমেটো",
      corn: "ভুট্টা",
      wheat: "গম",
      soybeans: "সয়াবিন",
    },
    fieldNames: {
      northField: "উত্তর ক্ষেত্র",
      southField: "দক্ষিণ ক্ষেত্র",
      eastField: "পূর্ব ক্ষেত্র",
      westField: "পশ্চিম ক্ষেত্র",
    },
    growthStages: {
      germination: "অঙ্কুরোদগম",
      growing: "বৃদ্ধি",
      flowering: "ফুল ফোটা",
      ready: "প্রস্তুত",
    },
    healthStatus: {
      excellent: "অসাধারণ",
      good: "ভাল",
      fair: "মোটামুটি",
      poor: "খারাপ",
    },
    timeLabels: { daysAgo: "দিন আগে" },
    subtitle: "এক জায়গায় আপনার সব ফসল পর্যবেক্ষণ ও পরিচালনা করুন",
    brandTitle: "এগ্রো সুবিধা",
    brandSubtitle: "কৃষকের ডিজিটাল সঙ্গী",
    navHome: "হোম",
    navCrops: "ফসল",
    navWeather: "আবহাওয়া",
    navSettings: "সেটিংস",
    navLanguage: "ভাষা",
    navAbout: "আমাদের সম্পর্কে",
    areaUnit: "(একর)",
    areaPlaceholder: "2.5",
  },
  pa: {
    crops: {
      title: "ਫਸਲਾਂ",
      addNewCrop: "ਨਵੀਂ ਫਸਲ ਜੋੜੋ",
      cropName: "ਫਸਲ ਦਾ ਨਾਮ",
      variety: "ਕਿਸਮ",
      field: "ਖੇਤ",
      area: "ਖੇਤਰ",
      plantingDate: "ਬੀਜਣ ਦੀ ਤਾਰੀਖ",
      expectedHarvest: "ਕਟਾਈ ਦੀ ਤਾਰੀਖ",
      growthStage: "ਵਿਕਾਸ ਅਵਸਥਾ",
      addCrop: "ਫਸਲ ਜੋੜੋ",
      viewDetails: "ਵੇਰਵੇ ਦੇਖੋ",
      wateringSchedule: "ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ",
      lastWatered: "ਆਖਰੀ ਸਿੰਚਾਈ",
    },
    common: { select: "ਚੁਣੋ", cancel: "ਰੱਦ ਕਰੋ", update: "ਅਪਡੇਟ" },
    cropNames: {
      tomatoes: "ਟਮਾਟਰ",
      corn: "ਮੱਕੀ",
      wheat: "ਗੰਦਮ",
      soybeans: "ਸੋਯਾਬੀਨ",
    },
    fieldNames: {
      northField: "ਉੱਤਰੀ ਖੇਤ",
      southField: "ਦੱਖਣੀ ਖੇਤ",
      eastField: "ਪੂਰਬੀ ਖੇਤ",
      westField: "ਪੱਛਮੀ ਖੇਤ",
    },
    growthStages: {
      germination: "ਅੰਕੁਰਣ",
      growing: "ਵਿਕਾਸ",
      flowering: "ਫੁੱਲਣਾ",
      ready: "ਤਿਆਰ",
    },
    healthStatus: {
      excellent: "ਸ਼ਾਨਦਾਰ",
      good: "ਚੰਗਾ",
      fair: "ਠੀਕ",
      poor: "ਖਰਾਬ",
    },
    timeLabels: { daysAgo: "ਦਿਨ ਪਹਿਲਾਂ" },
    subtitle: "ਇੱਕ ਹੀ ਥਾਂ ਤੇ ਆਪਣੀਆਂ ਸਾਰੀਆਂ ਫਸਲਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ",
    brandTitle: "ਐਗਰੋ ਸੁਵਿਧਾ",
    brandSubtitle: "ਕਿਸਾਨ ਦਾ ਡਿਜ਼ਿਟਲ ਸਾਥੀ",
    navHome: "ਘਰ",
    navCrops: "ਫਸਲਾਂ",
    navWeather: "ਮੌਸਮ",
    navSettings: "ਸੈਟਿੰਗਜ਼",
    navLanguage: "ਭਾਸ਼ਾ",
    navAbout: "ਸਾਡੇ ਬਾਰੇ",
    areaUnit: "(ਐਕੜ)",
    areaPlaceholder: "2.5",
  },
};

const stageClass = (stage, t) => {
  const s = stage.toLowerCase();
  if (s === t.growthStages.germination.toLowerCase())
    return "crop-stage-germination";
  if (s === t.growthStages.growing.toLowerCase()) return "crop-stage-growing";
  if (s === t.growthStages.flowering.toLowerCase())
    return "crop-stage-flowering";
  if (s === t.growthStages.ready.toLowerCase()) return "crop-stage-ready";
  return "";
};

const healthClass = (health, t) => {
  const h = health.toLowerCase();
  if (h === t.healthStatus.excellent.toLowerCase())
    return "crop-health-excellent";
  if (h === t.healthStatus.good.toLowerCase()) return "crop-health-good";
  if (h === t.healthStatus.fair.toLowerCase()) return "crop-health-fair";
  if (h === t.healthStatus.poor.toLowerCase()) return "crop-health-poor";
  return "";
};

/* -------------------------
   Inline SVG icons
   ------------------------- */
const Icon = ({ name }) => {
  switch (name) {
    case "sprout":
      return (
        <span className="crop-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 20s5-3 5-9V7a5 5 0 0 0-5-5c0 2.5 1.5 5 5 5" />
            <path d="M12 13c0-6 5-9 5-9a5 5 0 0 1 5 5c-2.5 0-5-1.5-5-5" />
            <path d="M12 20v-7" />
          </svg>
        </span>
      );
    case "calendar":
      return (
        <span className="crop-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      );
    case "ruler":
      return (
        <span className="crop-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 2l6 6L8 22l-6-6L16 2z" />
            <path d="M7 13l3 3" />
            <path d="M10 10l3 3" />
            <path d="M13 7l3 3" />
          </svg>
        </span>
      );
    case "sun":
      return (
        <span className="crop-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5L19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5L19 5" />
          </svg>
        </span>
      );
    case "droplet":
      return (
        <span className="crop-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
          </svg>
        </span>
      );
    default:
      return null;
  }
};

/* -------------------------
   Sample crops generator
   ------------------------- */
const getSampleCrops = (t) => [
  {
    id: 1,
    name: t.cropNames.tomatoes,
    variety: "Cherokee Purple",
    field: t.fieldNames.northField,
    plantedDate: "2024-03-15",
    expectedHarvest: "2024-06-15",
    stage: t.growthStages.flowering,
    health: t.healthStatus.excellent,
    progress: 65,
    area: "2.5 acres",
    estimatedYield: "15,000 lbs",
    wateringSchedule: "Daily",
    lastWatered: "Today",
    notes: "Plants are responding well to recent fertilization",
  },
  {
    id: 2,
    name: t.cropNames.corn,
    variety: "Sweet Corn",
    field: t.fieldNames.westField,
    plantedDate: "2024-04-01",
    expectedHarvest: "2024-07-15",
    stage: t.growthStages.growing,
    health: t.healthStatus.good,
    progress: 45,
    area: "5.0 acres",
    estimatedYield: "25,000 ears",
    wateringSchedule: "Every 2 days",
    lastWatered: "Yesterday",
    notes: "Some pest activity detected, monitoring closely",
  },
  {
    id: 3,
    name: t.cropNames.wheat,
    variety: "Hard Red Winter",
    field: t.fieldNames.southField,
    plantedDate: "2023-10-15",
    expectedHarvest: "2024-07-01",
    stage: t.growthStages.ready,
    health: t.healthStatus.good,
    progress: 95,
    area: "10.0 acres",
    estimatedYield: "400 bushels",
    wateringSchedule: "Rain dependent",
    lastWatered: `3 ${t.timeLabels.daysAgo}`,
    notes: "Weather conditions ideal for harvest",
  },
  {
    id: 4,
    name: t.cropNames.soybeans,
    variety: "Roundup Ready",
    field: t.fieldNames.eastField,
    plantedDate: "2024-05-01",
    expectedHarvest: "2024-09-15",
    stage: t.growthStages.germination,
    health: t.healthStatus.fair,
    progress: 15,
    area: "7.5 acres",
    estimatedYield: "300 bushels",
    wateringSchedule: "Weekly",
    lastWatered: `2 ${t.timeLabels.daysAgo}`,
    notes:
      "Lower germination rate than expected, investigating soil conditions",
  },
];

/* -------------------------
   Crop Card Component
   ------------------------- */
function CropCard({ crop, t }) {
  return (
    <div className="crop-card">
      <div className="crop-card-header">
        <h3 className="crop-card-title">
          <Icon name="sprout" /> {crop.name}
        </h3>
        <div className="crop-card-sub">
          <span className="crop-badge">{crop.field}</span>
          <span className="crop-badge">{crop.variety}</span>
          <span
            className={`crop-badge crop-badge-soft ${healthClass(
              crop.health,
              t
            )}`}
          >
            {crop.health}
          </span>
          <span
            className={`crop-badge crop-badge-soft ${stageClass(
              crop.stage,
              t
            )}`}
          >
            {crop.stage}
          </span>
        </div>
      </div>

      <div className="crop-card-content">
        <div>
          <div className="crop-row">
            <span>{t.crops.growthStage}</span>
            <span style={{ color: "var(--crop-primary)", fontWeight: 700 }}>
              {crop.progress}%
            </span>
          </div>
          <div className="crop-progress">
            <div
              className="crop-progress-bar"
              style={{ width: `${crop.progress}%` }}
            />
          </div>
        </div>

        <div className="crop-two-col">
          <div style={{ display: "grid", gap: "10px" }}>
            <div className="crop-row">
              <span>
                <Icon name="calendar" /> {t.crops.plantingDate}
              </span>
              <span style={{ color: "var(--crop-primary)" }}>
                {new Date(crop.plantedDate).toLocaleDateString()}
              </span>
            </div>

            <div className="crop-row">
              <span>
                <Icon name="ruler" /> {t.crops.area}
              </span>
              <span style={{ color: "var(--crop-primary)" }}>{crop.area}</span>
            </div>

            <div className="crop-row">
              <span>
                <Icon name="sun" /> Est. Yield
              </span>
              <span style={{ color: "var(--crop-primary)" }}>
                {crop.estimatedYield}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            <div className="crop-row">
              <span>
                <Icon name="calendar" /> {t.crops.expectedHarvest}
              </span>
              <span style={{ color: "var(--crop-primary)" }}>
                {new Date(crop.expectedHarvest).toLocaleDateString()}
              </span>
            </div>

            <div className="crop-row">
              <span>
                <Icon name="droplet" /> {t.crops.wateringSchedule}
              </span>
              <span style={{ color: "var(--crop-primary)" }}>
                {crop.wateringSchedule}
              </span>
            </div>

            <div className="crop-row">
              <span>
                <Icon name="droplet" /> {t.crops.lastWatered}
              </span>
              <span style={{ color: "var(--crop-primary)" }}>
                {crop.lastWatered}
              </span>
            </div>
          </div>
        </div>

        {crop.notes && <div className="crop-note">{crop.notes}</div>}

        <div className="crop-card-actions">
          <button className="crop-btn crop-btn-outline">
            {t.common.update}
          </button>
          <button className="crop-btn crop-btn-outline">
            {t.crops.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Main Component
   ------------------------- */
function CropManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage(); // "en" | "hi" | "bn" | "pa"
  const t = translations[language] || translations.en;

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

  const sampleCrops = useMemo(() => getSampleCrops(t), [t]);
  const [userCrops, setUserCrops] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    cropName: "",
    variety: "",
    field: "",
    area: "",
    planted: "",
    harvest: "",
  });

  const allCrops = [...sampleCrops, ...userCrops];

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.webkitTapHighlightColor = "transparent";
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setForm({
      cropName: "",
      variety: "",
      field: "",
      area: "",
      planted: "",
      harvest: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveCrop = () => {
    if (!form.cropName.trim()) {
      closeModal();
      return;
    }

    const newCrop = {
      id: Date.now(),
      name: form.cropName.trim(),
      variety: form.variety.trim() || "-",
      field: form.field || t.fieldNames.northField,
      plantedDate: form.planted || new Date().toISOString().slice(0, 10),
      expectedHarvest:
        form.harvest || form.planted || new Date().toISOString().slice(0, 10),
      stage: t.growthStages.germination,
      health: t.healthStatus.good,
      progress: 10,
      area: form.area ? `${form.area} acres` : "1.0 acres",
      estimatedYield: "—",
      wateringSchedule: t.crops.wateringSchedule,
      lastWatered: "Today",
      notes: "",
    };

    setUserCrops((prev) => [...prev, newCrop]);
    closeModal();
  };

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div className="brand-text">
            <div className="brand-title">{t.brandTitle}</div>
            <div className="brand-subtitle">{t.brandSubtitle}</div>
          </div>
        </div>

        <div className="nav-pill">
          <button
            className={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            <HomeIcon />
            <span className="nav-label">{t.navHome}</span>
          </button>
          <button
            className={isActive("/manager")}
            onClick={() => navigate("/manager")}
          >
            <Sprout />
            <span className="nav-label">{t.navCrops}</span>
          </button>
          <button
            className={isActive("/weather")}
            onClick={() => navigate("/weather")}
          >
            <Sun />
            <span className="nav-label">{t.navWeather}</span>
          </button>
          <button
            className={isActive("/settings")}
            onClick={() => navigate("/settings")}
          >
            <Settings />
            <span className="nav-label">{t.navSettings}</span>
          </button>

          <button
            className={isActive("/language")}
            onClick={() => navigate("/language")}
          >
            <Globe />
            <span className="nav-label">{t.navLanguage}</span>
          </button>
          <button
            className={isActive("/about")}
            onClick={() => navigate("/about")}
          >
            <Globe />
            <span className="nav-label">{t.navAbout}</span>
          </button>
        </div>
      </div>

      <div className="crop-container">
        <div className="crop-header">
          <div className="crop-header-row">
            <div>
              <h1 className="crop-title">{t.crops.title}</h1>
              <p className="crop-subtitle">{t.subtitle}</p>
            </div>

            <div className="crop-actions">
              {/* Language is controlled globally now, so this select can be removed,
                  or you can keep it and call your context setter instead. */}
              <button className="crop-btn crop-btn-primary" onClick={openModal}>
                + {t.crops.addNewCrop}
              </button>
            </div>
          </div>
        </div>

        <div className="crop-grid">
          {allCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} t={t} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="crop-modal crop-modal-open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="crop-modal-content">
            <h2 className="crop-modal-title">{t.crops.addNewCrop}</h2>

            <div className="crop-grid-2">
              <div className="crop-field">
                <label className="crop-label">{t.crops.cropName}</label>
                <input
                  name="cropName"
                  className="crop-input"
                  placeholder={`${t.common.select} ${t.crops.cropName.toLowerCase()}`}
                  value={form.cropName}
                  onChange={handleFormChange}
                />
              </div>

              <div className="crop-field">
                <label className="crop-label">{t.crops.variety}</label>
                <input
                  name="variety"
                  className="crop-input"
                  placeholder={t.crops.variety}
                  value={form.variety}
                  onChange={handleFormChange}
                />
              </div>

              <div className="crop-field">
                <label className="crop-label">{t.crops.field}</label>
                <select
                  name="field"
                  className="crop-select"
                  value={form.field}
                  onChange={handleFormChange}
                >
                  <option value="">{t.common.select}</option>
                  {[
                    t.fieldNames.northField,
                    t.fieldNames.southField,
                    t.fieldNames.eastField,
                    t.fieldNames.westField,
                  ].map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="crop-field">
                <label className="crop-label">
                  {t.crops.area} {t.areaUnit}
                </label>
                <input
                  name="area"
                  type="number"
                  className="crop-input"
                  placeholder={t.areaPlaceholder}
                  value={form.area}
                  onChange={handleFormChange}
                />
              </div>

              <div className="crop-field">
                <label className="crop-label">{t.crops.plantingDate}</label>
                <input
                  name="planted"
                  type="date"
                  className="crop-input"
                  value={form.planted}
                  onChange={handleFormChange}
                />
              </div>

              <div className="crop-field">
                <label className="crop-label">{t.crops.expectedHarvest}</label>
                <input
                  name="harvest"
                  type="date"
                  className="crop-input"
                  value={form.harvest}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="crop-modal-actions">
              <button className="crop-btn" onClick={closeModal}>
                {t.common.cancel}
              </button>
              <button className="crop-btn crop-btn-primary" onClick={saveCrop}>
                {t.crops.addCrop}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CropManager;
