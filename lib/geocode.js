export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "soil-nutrient-app/1.0 (your-email@example.com)", // Replace with your real email
      },
    });
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }
    const data = await response.json();
    const { city, town, village, state, country } = data.address;
    const place = city || town || village || state || "Unknown location";
    return `${place}, ${country}`;
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "Unknown location";
  }
}
