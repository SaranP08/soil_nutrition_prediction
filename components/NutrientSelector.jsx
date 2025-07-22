import React from 'react';
import { AVAILABLE_NUTRIENTS, NUTRIENT_FULL_NAMES } from '../constants.js';

const NutrientSelector = ({ selectedNutrients, onToggle }) => {
    return (
        <div className="flex flex-wrap gap-3">
            {AVAILABLE_NUTRIENTS.map(nutrient => {
                const isSelected = selectedNutrients.includes(nutrient);
                return (
                    <button
                        key={nutrient}
                        onClick={() => onToggle(nutrient)}
                        className={`px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 text-sm sm:text-base
                            ${isSelected
                                ? 'bg-brand-blue-600 text-white border-brand-blue-600 shadow-md'
                                : 'bg-white text-gray-800 border-brand-blue-200 hover:border-brand-blue-600 hover:bg-brand-blue-100'
                            }`}
                    >
                        {NUTRIENT_FULL_NAMES[nutrient]}
                    </button>
                );
            })}
        </div>
    );
};

export default NutrientSelector;