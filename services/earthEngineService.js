const randomBand = (min, max) => Math.random() * (max - min) + min;

export async function fetchSentinel2Data(latitude, longitude, date) {
  try {
    const response = await fetch(
      "https://saran08-soil-nutrition-prediction.hf.space/extract_features",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          date: new Date(date).toISOString().split("T")[0], // ensures YYYY-MM-DD
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch satellite data:", err);
    throw err;
  }
}
