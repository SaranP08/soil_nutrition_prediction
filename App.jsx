import React, { useState, useCallback } from "react";
import { AVAILABLE_NUTRIENTS, Nutrient } from "./constants.jsx";
import { runPrediction } from "./services/modelService.js";
import { getStatusForValue, parseCsv } from "./lib/utils.js";
import { fetchSentinel2Data } from "./services/earthEngineService.js";
import NutrientSelector from "./components/NutrientSelector.jsx";
import ReportCard from "./components/ReportCard.jsx";
import TabButton from "./components/TabButton.jsx";
import FileUpload from "./components/FileUpload.jsx";
import { LeafIcon, LightBulbIcon, ArrowPathIcon } from "./components/Icons.jsx";
import { fetchNdviTimeSeries } from "./services/ndviTimeSeries.js";

const App = () => {
  const [activeTab, setActiveTab] = useState("predict");
  const [selectedNutrients, setSelectedNutrients] = useState([Nutrient.pH]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [inputMethod, setInputMethod] = useState("upload");
  const [manualLocation, setManualLocation] = useState({
    latitude: "",
    longitude: "",
    date: "",
  });
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNutrientToggle = (nutrient) => {
    setSelectedNutrients((prev) =>
      prev.includes(nutrient)
        ? prev.filter((n) => n !== nutrient)
        : [...prev, nutrient]
    );
  };

  // --- NEW HELPER FUNCTION TO CONTAIN THE LOOP ---
  // This function will run after the initial loading state has been rendered.
  const processReports = async (parsedData) => {
    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      try {
        const lat = parseFloat(row.latitude);
        const lon = parseFloat(row.longitude);
        if (isNaN(lat) || isNaN(lon) || !row.date) {
          throw new Error(
            `Invalid data in row ${i + 1}: Check latitude, longitude, and date.`
          );
        }

        const featureData = await fetchSentinel2Data(
          lat,
          lon,
          new Date(row.date)
        );
        const ndviData = await fetchNdviTimeSeries(
          lat,
          lon,
          new Date(row.date)
        );
        const values = await runPrediction(selectedNutrients, featureData);
        const predictions = selectedNutrients.map((nutrient) => {
          const value = values[nutrient];
          const status = getStatusForValue(nutrient, value);
          return { nutrient, value, status };
        });

        setReports((prev) =>
          prev.map((r, idx) =>
            i === idx
              ? {
                  ...r,
                  predictions: predictions,
                  isProcessing: false,
                  ndviData: ndviData,
                }
              : r
          )
        );
      } catch (innerError) {
        console.error(`Error processing row ${i + 1}:`, innerError.message);
        setReports((prev) =>
          prev.map((r, idx) =>
            i === idx
              ? {
                  ...r,
                  predictions: [],
                  isProcessing: false,
                  error: innerError.message,
                }
              : r
          )
        );
      }
    }
    // Set the global loading state to false after all reports are processed.
    setIsLoading(false);
  };

  const handlePredict = useCallback(async () => {
    if (inputMethod === "upload" && !uploadedFile) {
      setError("Please upload a CSV file.");
      return;
    }
    if (selectedNutrients.length === 0) {
      setError("Please select at least one nutrient.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReports([]);

    try {
      let parsedData = [];
      if (inputMethod === "upload") {
        parsedData = await parseCsv(uploadedFile);
      } else {
        const { latitude, longitude, date } = manualLocation;
        if (!latitude || !longitude || !date) {
          throw new Error("Please fill in latitude, longitude, and date.");
        }
        parsedData = [{ latitude, longitude, date }];
      }

      if (!parsedData || parsedData.length === 0) {
        throw new Error("No valid data found.");
      }

      const initialReports = parsedData.map((row) => ({
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          date: row.date,
        },
        predictions: [],
        isProcessing: true,
        error: null,
      }));

      // --- KEY CHANGE ---
      // 1. Set the initial loading state for all reports.
      setReports(initialReports);
      setActiveTab("report");

      // 2. Call the processing function. We DON'T await it here.
      // This lets React render the UI with the loading state first.
      processReports(parsedData);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Prediction failed:", errorMessage);
      setError(errorMessage);
      setIsLoading(false); // Make sure to stop loading on initial error
      setActiveTab("predict");
    }
    // The finally block is removed from here because setIsLoading(false) is now inside processReports
  }, [selectedNutrients, uploadedFile, inputMethod, manualLocation]);

  const renderTabContent = () => {
    // ... This function remains exactly the same
    switch (activeTab) {
      case "predict":
        return (
          // This part remains unchanged
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-brand-blue-800 mb-3 flex items-center gap-2">
                    <span className="bg-brand-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                      1
                    </span>
                    Select Nutrients
                  </h2>
                  <NutrientSelector
                    selectedNutrients={selectedNutrients}
                    onToggle={handleNutrientToggle}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-brand-blue-800 mb-3 flex items-center gap-2">
                    <span className="bg-brand-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                      2
                    </span>
                    Provide Location
                  </h2>
                  <div className="mb-4 flex gap-4">
                    <button
                      className={`px-4 py-2 rounded-md border ${
                        inputMethod === "upload"
                          ? "bg-brand-blue-600 text-white"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => setInputMethod("upload")}
                    >
                      Upload CSV
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md border ${
                        inputMethod === "auto"
                          ? "bg-brand-blue-600 text-white"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={async () => {
                        setInputMethod("auto");
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              const now = new Date()
                                .toISOString()
                                .split("T")[0];
                              setManualLocation({
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude,
                                date: now,
                              });
                            },
                            () => alert("Failed to get current location.")
                          );
                        } else {
                          alert("Geolocation not supported by this browser.");
                        }
                      }}
                    >
                      Use My Location
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md border ${
                        inputMethod === "manual"
                          ? "bg-brand-blue-600 text-white"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => setInputMethod("manual")}
                    >
                      Manual Entry
                    </button>
                  </div>

                  {inputMethod === "upload" && (
                    <FileUpload onFileSelect={setUploadedFile} />
                  )}

                  {inputMethod !== "upload" && (
                    <div className="space-y-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={manualLocation.latitude}
                        onChange={(e) =>
                          setManualLocation({
                            ...manualLocation,
                            latitude: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded-md"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={manualLocation.longitude}
                        onChange={(e) =>
                          setManualLocation({
                            ...manualLocation,
                            longitude: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded-md"
                      />
                      <input
                        type="date"
                        value={manualLocation.date}
                        onChange={(e) =>
                          setManualLocation({
                            ...manualLocation,
                            date: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-brand-blue-50 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-brand-blue-800">
                    Ready to Analyze?
                  </h2>
                  <p className="text-gray-700">
                    Once your nutrients and location data are set, click the
                    button below.
                  </p>
                  <button
                    onClick={handlePredict}
                    disabled={
                      isLoading ||
                      (inputMethod === "upload" && !uploadedFile) ||
                      selectedNutrients.length === 0
                    }
                    className="w-full bg-brand-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-brand-blue-700 disabled:bg-brand-blue-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <ArrowPathIcon className="h-6 w-6 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "🔍 Predict & Advise"
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div
                className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </>
        );
      case "report":
        return (
          <div>
            {reports.length > 0 ? (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-brand-blue-800 mb-4">
                  Your Soil Report
                </h2>
                {reports.map((report, index) => (
                  <ReportCard
                    key={index}
                    location={report.location}
                    predictions={report.predictions}
                    isProcessing={report.isProcessing} // Pass the flag
                    error={report.error} // Pass the error
                    ndviData={report.ndviData}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center bg-white/50 rounded-lg p-8 border-2 border-dashed border-brand-blue-200">
                <LightBulbIcon className="h-16 w-16 mx-auto text-brand-blue-400 mb-4" />
                <h3 className="text-2xl font-semibold text-brand-blue-800">
                  Your results will appear here.
                </h3>
                <p className="text-gray-700 mt-2">
                  Go to the 'Predict Nutrients' tab to get started.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // ... This part remains exactly the same
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-50 via-brand-blue-100 to-white text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <LeafIcon className="h-12 w-12 text-brand-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-blue-800 tracking-tight">
              Soil Nutrient Advisor
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a CSV or provide your location to get instant predictions and
            AI-powered recommendations for a healthier harvest.
          </p>
        </header>

        <main className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="border-b border-brand-blue-200/50">
            <nav className="flex space-x-2 px-4 sm:px-6" aria-label="Tabs">
              <TabButton
                label="Predict Nutrients"
                isActive={activeTab === "predict"}
                onClick={() => setActiveTab("predict")}
              />
              <TabButton
                label="Soil Report"
                isActive={activeTab === "report"}
                onClick={() => setActiveTab("report")}
                disabled={reports.length === 0 && !isLoading}
              />
            </nav>
          </div>

          <div className="p-6 md:p-8">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default App;
