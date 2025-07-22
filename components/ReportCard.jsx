import React, { useEffect, useState } from "react";
import PredictionCard from "./PredictionCard.jsx";
import { MapPinIcon, ArrowPathIcon } from "./Icons.jsx";

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "soil-nutrient-app/1.0 (your-email@example.com)",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch location");
    const data = await response.json();
    const { city, town, village, state, country } = data.address;
    return `${city || town || village || state || "Unknown"}, ${country || ""}`;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const ReportCard = ({ report }) => {
  const { location, predictions, isProcessing, error } = report;
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      reverseGeocode(location.latitude, location.longitude).then(
        setLocationName
      );
    }
  }, [location]);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/80 p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <MapPinIcon className="h-8 w-8 text-brand-blue-600" />
          <div>
            <h3 className="font-bold text-lg text-brand-blue-800">
              Location Report
            </h3>
            <p className="text-sm text-gray-600">
              📍{" "}
              {locationName ||
                `Lat: ${Number(location.latitude).toFixed(4)}, Lon: ${Number(
                  location.longitude
                ).toFixed(4)}`}{" "}
              | Date: {location.date}
            </p>
          </div>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-2 text-brand-blue-600 mt-2 sm:mt-0">
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            <span className="font-semibold text-sm">Processing...</span>
          </div>
        )}
      </div>

      {error ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg"
          role="alert"
        >
          <p className="font-bold">An error occurred:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((result) => (
            <PredictionCard key={result.nutrient} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
