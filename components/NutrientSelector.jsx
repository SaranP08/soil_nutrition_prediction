import React from "react";
// 1. FIX THE IMPORT: We need NUTRIENT_DETAILS for the labels, not NUTRIENT_FULL_NAMES.
import { AVAILABLE_NUTRIENTS, NUTRIENT_DETAILS } from "../constants.jsx";

const NutrientSelector = ({ selectedNutrients, onToggle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {AVAILABLE_NUTRIENTS.map((nutrient) => {
        const isSelected = selectedNutrients.includes(nutrient);
        // 2. FIX THE LOGIC: Get the label from the NUTRIENT_DETAILS object.
        const details = NUTRIENT_DETAILS[nutrient];

        // Fallback in case a nutrient is in the list but has no details
        if (!details) return null;

        return (
          <button
            key={nutrient}
            onClick={() => onToggle(nutrient)}
            className={`
    p-3 rounded-lg border-2 text-center font-semibold transition-all duration-200
    flex flex-col items-center justify-center gap-2
    ${
      isSelected
        ? "bg-brand-blue-600 border-brand-blue-700 text-white shadow-lg"
        : "bg-white border-gray-300 text-gray-700 hover:border-brand-blue-500 hover:bg-brand-blue-50"
    }`}
          >
            {details.icon && (
              <div
                className={isSelected ? "text-white" : "text-brand-blue-600"}
              >
                {details.icon("h-6 w-6")}
              </div>
            )}
            <span>{details.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NutrientSelector;
