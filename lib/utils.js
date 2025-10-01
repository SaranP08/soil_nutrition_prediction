// src/lib/utils.js

// 1. Ensure the import is for NUTRIENT_DETAILS
import { NUTRIENT_DETAILS } from "../constants.jsx";
import Papa from "papaparse";

// 2. Ensure the function logic uses the correct variable and structure
export const getStatusForValue = (nutrient, value) => {
  const details = NUTRIENT_DETAILS[nutrient];

  // If nutrient is not found in our details object, return a default status.
  if (!details || !details.thresholds) {
    console.warn(`No thresholds found for nutrient: ${nutrient}`);
    return "unknown";
  }

  const { low, high } = details.thresholds;

  if (value < low) {
    return "low";
  }
  if (value > high) {
    return "high";
  }
  return "optimal";
};

// This function can remain the same
export const parseCsv = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          reject(new Error("Error parsing CSV file."));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
