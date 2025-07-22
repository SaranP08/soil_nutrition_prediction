import React from 'react';

const TabButton = ({ label, isActive, onClick, disabled = false }) => {
    const baseClasses = "whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200";

    const activeClasses = 'border-brand-blue-600 text-brand-blue-600';
    const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    const disabledClasses = 'text-gray-300 cursor-not-allowed border-transparent';

    const getDynamicClasses = () => {
        if (disabled) return disabledClasses;
        if (isActive) return activeClasses;
        return inactiveClasses;
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${getDynamicClasses()}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {label}
        </button>
    );
};

export default TabButton;