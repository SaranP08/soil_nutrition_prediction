import React, { useEffect, useRef, useState } from "react";
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
import html2pdf from "html2pdf.js";

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

const ReportCard = ({
  location,
  predictions,
  ndviData,
  isProcessing,
  error,
}) => {
  const [locationName, setLocationName] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      reverseGeocode(location.latitude, location.longitude).then(
        setLocationName
      );
    }
  }, [location]);

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `Soil_Report_${locationName || "location"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(reportRef.current)
        .save();
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/80 p-6">
      <div className="flex justify-between mb-4 items-center">
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
        <button
          onClick={handleDownloadPDF}
          className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-brand-blue-700"
        >
          Download PDF
        </button>
      </div>

      {isProcessing && (
        <div className="flex items-center gap-2 text-brand-blue-600 mb-4">
          <ArrowPathIcon className="h-5 w-5 animate-spin" />
          <span className="font-semibold text-sm">Processing...</span>
        </div>
      )}

      <div ref={reportRef}>
        {error ? (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4"
            role="alert"
          >
            <p className="font-bold">An error occurred:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {predictions.map((result) => (
              <PredictionCard key={result.nutrient} result={result} />
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default ReportCard;
