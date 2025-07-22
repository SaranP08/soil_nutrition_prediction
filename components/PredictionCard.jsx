import React from 'react';
import { NUTRIENT_FULL_NAMES, RECOMMENDATION_RULES } from '../constants.js';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, CheckCircleIcon } from './Icons.jsx';

const statusStyles = {
    low: {
        icon: <ArrowTrendingDownIcon className="h-6 w-6" />,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        badgeColor: 'bg-orange-200 text-orange-800'
    },
    optimum: {
        icon: <CheckCircleIcon className="h-6 w-6" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        badgeColor: 'bg-green-200 text-green-800'
    },
    high: {
        icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        badgeColor: 'bg-blue-200 text-blue-800'
    }
};

const PredictionCard = ({ result }) => {
    const { nutrient, value, status, recommendation } = result;
    const style = statusStyles[status];
    const rules = RECOMMENDATION_RULES[nutrient];

    return (
        <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white border border-gray-200/50`}>
            <div className={`p-4 ${style.bgColor} ${style.textColor}`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{NUTRIENT_FULL_NAMES[nutrient]}</h3>
                    {style.icon}
                </div>
                <div className="flex items-baseline gap-4 mt-2">
                    <p className="text-4xl font-bold">{value.toFixed(2)}</p>
                    <p className="text-lg font-medium">{rules.optimum.unit || ''}</p>
                </div>
                 <div className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${style.badgeColor}`}>
                    {rules[status].message}
                </div>
            </div>

            <div className="p-5">
                <h4 className="font-semibold text-gray-800 mb-2">AI Recommendation:</h4>
                {recommendation ? (
                    <p className="text-gray-700 text-sm leading-relaxed">{recommendation}</p>
                ) : (
                   <div className="animate-pulse space-y-2">
                        <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionCard;