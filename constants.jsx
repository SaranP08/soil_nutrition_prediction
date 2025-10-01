// src/constants.jsx
import React from "react";

// --- Single Source of Truth for Nutrients ---

export const Nutrient = {
  pH: "pH",
  N: "N",
  P: "P",
  K: "K",
  OC: "OC",
};

export const AVAILABLE_NUTRIENTS = Object.values(Nutrient);

// This is now the ONLY object you need for nutrient metadata.
// It contains everything: labels, units, icons, and thresholds for status calculation.
export const NUTRIENT_DETAILS = {
  [Nutrient.pH]: {
    label: "Soil pH",
    unit: "",
    icon: (className) => <span className={className}>🌡️</span>,
    thresholds: { low: 6.0, high: 7.5 }, // Status: low if < 6.0, high if > 7.5
  },
  [Nutrient.N]: {
    label: "Nitrogen (N)",
    unit: "kg/ha",
    icon: (className) => <span className={className}>🌿</span>,
    thresholds: { low: 280, high: 560 },
  },
  [Nutrient.P]: {
    label: "Phosphorus (P)",
    unit: "kg/ha",
    icon: (className) => <span className={className}>💡</span>,
    thresholds: { low: 25, high: 50 },
  },
  [Nutrient.K]: {
    label: "Potassium (K)",
    unit: "kg/ha",
    icon: (className) => <span className={className}>🍌</span>,
    thresholds: { low: 180, high: 360 },
  },
  [Nutrient.OC]: {
    label: "Organic Carbon (OC)",
    unit: "%",
    icon: (className) => <span className={className}>⚫</span>,
    thresholds: { low: 0.5, high: 0.75 },
  },
};

// --- Model-Related Constants (can stay as is) ---

const ALL_FEATURES = [
  "B8",
  "B4",
  "B5",
  "B11",
  "B9",
  "B1",
  "SR_n2",
  "SR_N",
  "TBVI1",
  "NDWI",
  "NDVI_G",
  "PSRI",
  "NDVIRE1n",
  "NDVIRE2n",
  "NDVIRE3n",
  "BI",
  "CI",
  "SI",
  "latitude",
  "longitude",
  "B8_minus_B4",
  "NDVI_G_times_PSRI",
];

export const TARGET_FEATURE_MAP = {
  [Nutrient.N]: ALL_FEATURES,
  [Nutrient.P]: ALL_FEATURES,
  [Nutrient.K]: ALL_FEATURES,
  [Nutrient.OC]: ALL_FEATURES,
  [Nutrient.pH]: ALL_FEATURES,
};
