import React, { useEffect, useState } from "react";
import PredictionCard from "./PredictionCard.jsx";
import { MapPinIcon, ArrowPathIcon } from "./Icons.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// This function geocodes coordinates to a city/country name for display
const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "soil-nutrient-app/1.0", // Simple user agent is fine
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

const ReportCard = ({
  location,
  predictions,
  ndviData,
  isProcessing,
  error,
}) => {
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
      {/* The header no longer needs justify-between since the button is gone */}
      <div className="flex mb-4 items-center">
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
        {/* The Download PDF button has been removed from here */}
      </div>

      <div>
        {/* The ref for the PDF download has been removed from this div */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-md my-4">
            <ArrowPathIcon className="h-8 w-8 text-brand-blue-500 animate-spin mb-3" />
            <p className="text-lg font-semibold text-brand-blue-700">
              Analyzing Soil Data...
            </p>
            <p className="text-gray-600">
              Please wait, predictions are being generated.
            </p>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4"
            role="alert"
          >
            <p className="font-bold">An error occurred:</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {predictions.map((result) => (
                <PredictionCard key={result.nutrient} result={result} />
              ))}
            </div>

            {ndviData?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-bold text-gray-700 mb-2">
                  📈 NDVI Trend Over Time
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ndviData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="ndvi"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
