// src/components/PredictionCard.jsx

import React from "react";
import { NUTRIENT_DETAILS } from "../constants.jsx";

// Helper function to get styling based on the nutrient status
const getStatusStyles = (status) => {
  switch (status) {
    case "low":
      return {
        badge: "bg-red-100 text-red-800",
        border: "border-red-300",
        text: "text-red-600",
      };
    case "optimal":
      return {
        badge: "bg-green-100 text-green-800",
        border: "border-green-300",
        text: "text-green-600",
      };
    case "high":
      return {
        badge: "bg-yellow-100 text-yellow-800",
        border: "border-yellow-300",
        text: "text-yellow-600",
      };
    default:
      return {
        badge: "bg-gray-100 text-gray-800",
        border: "border-gray-300",
        text: "text-gray-600",
      };
  }
};

const PredictionCard = ({ result }) => {
  const { nutrient, value, status } = result;
  const details = NUTRIENT_DETAILS[nutrient];

  // If nutrient details are not found, don't render the card
  if (!details) {
    return null;
  }

  const styles = getStatusStyles(status);

  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-md border-l-4 transition-transform hover:scale-105 ${styles.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-800 text-lg">{details.label}</h4>
        {details.icon && (
          <div className="text-gray-400">{details.icon("h-6 w-6")}</div>
        )}
      </div>
      <div className="text-center my-4">
        <p className="text-4xl font-bold text-brand-blue-900">
          {value.toFixed(2)}
          <span className="text-lg font-normal text-gray-500 ml-1">
            {details.unit}
          </span>
        </p>
      </div>
      <div className="text-center">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.badge}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default PredictionCard;
