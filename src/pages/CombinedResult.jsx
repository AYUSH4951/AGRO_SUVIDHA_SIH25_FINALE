// src/pages/CombinedResult.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import ScanResult from "./ScanResult";    // pest / leaf UI
import SoilResult from "./SoilResult";    // soil UI

function CombinedResult() {
  const { state } = useLocation();
  const result = state?.result;
  const routedTo = result?.routed_to;

  if (!result) {
    return <ScanResult />; // fallback
  }

  if (routedTo === "soil") {
    return <SoilResult />;
  }

  // default: leaf / pest
  return <ScanResult />;
}

export default CombinedResult;
