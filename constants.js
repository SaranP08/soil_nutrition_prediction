export const Nutrient = {
  pH: "pH",
  N: "N",
  P: "P",
  K: "K",
  OC: "OC",
};

export const AVAILABLE_NUTRIENTS = [Nutrient.pH, Nutrient.N, Nutrient.P, Nutrient.K, Nutrient.OC];

const ALL_FEATURES = ["B8", "B4", "B5", "B11", "B9", "B1", "SR_n2", "SR_N", "TBVI1", "NDWI", "NDVI_G", "PSRI","NDVIRE1n", "NDVIRE2n", "NDVIRE3n", "BI", "CI", "SI", "latitude", "longitude", "B8_minus_B4", "NDVI_G_times_PSRI"];

export const TARGET_FEATURE_MAP = {
    [Nutrient.N]: ALL_FEATURES,
    [Nutrient.P]: ALL_FEATURES,
    [Nutrient.K]: ALL_FEATURES,
    [Nutrient.OC]: ALL_FEATURES,
    [Nutrient.pH]: ALL_FEATURES
};

export const RECOMMENDATION_RULES = {
    [Nutrient.pH]: {
        low: { range: [0, 5.5], message: "Very Acidic" },
        optimum: { range: [5.5, 7.5], message: "Optimal" },
        high: { range: [7.5, 14], message: "Alkaline" }
    },
    [Nutrient.N]: {
        low: { range: [0, 280], message: "Low", unit: "kg/ha" },
        optimum: { range: [280, 560], message: "Adequate", unit: "kg/ha" },
        high: { range: [560, Infinity], message: "High", unit: "kg/ha" }
    },
    [Nutrient.P]: {
        low: { range: [0, 20], message: "Low", unit: "kg/ha" },
        optimum: { range: [20, 50], message: "Sufficient", unit: "kg/ha" },
        high: { range: [50, Infinity], message: "High", unit: "kg/ha" }
    },
    [Nutrient.K]: {
        low: { range: [0, 120], message: "Low", unit: "kg/ha" },
        optimum: { range: [120, 300], message: "Healthy", unit: "kg/ha" },
        high: { range: [300, Infinity], message: "High", unit: "kg/ha" }
    },
    [Nutrient.OC]: {
        low: { range: [0, 0.5], message: "Low", unit: "%" },
        optimum: { range: [0.5, 1.0], message: "Moderate", unit: "%" },
        high: { range: [1.0, Infinity], message: "High", unit: "%" }
    }
};

export const NUTRIENT_FULL_NAMES = {
    [Nutrient.pH]: "Soil pH",
    [Nutrient.N]: "Nitrogen (N)",
    [Nutrient.P]: "Phosphorus (P)",
    [Nutrient.K]: "Potassium (K)",
    [Nutrient.OC]: "Organic Carbon (OC)"
};