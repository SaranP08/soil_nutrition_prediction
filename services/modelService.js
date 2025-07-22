/**
 * Runs the appropriate prediction model for a given nutrient.
 * This function is designed to be asynchronous to accommodate model loading.
 *
 * @param nutrient The nutrient to predict.
 * @param data The input data containing all required features.
 * @returns A promise that resolves to the predicted value.
 */
export async function runPrediction(nutrients, data) {
  console.log(`Running prediction for: ${nutrients.join(", ")}`);

  try {
    const response = await fetch(
      "https://saran08-soil-nutrition-prediction.hf.space/predict_nutrients",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nutrients, data }),
      }
    );

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const result = await response.json(); // returns { N: val1, P: val2, ... }
    return result;
  } catch (e) {
    console.error(`Failed to fetch prediction:`, e);
    throw e;
  }
}
