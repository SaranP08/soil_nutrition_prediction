import { fetchSentinel2Data } from "./earthEngineService.js";

/**
 * Compute NDVI time series using weekly intervals over the past 1 year.
 * Calls fetchSentinel2Data() for each weekly date.
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date | string} refDate - Reference date (end of range)
 * @returns {Promise<Array<{ date: string, ndvi: number }>>}
 */
export async function computeNdviForDateRange(lat, lon, refDate) {
  const end = new Date(refDate);
  const start = new Date(end);
  start.setFullYear(end.getFullYear() - 1);

  const ndviSeries = [];

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 7) // weekly intervals
  ) {
    try {
      const result = await fetchSentinel2Data(lat, lon, new Date(d));
      const ndvi =
        Array.isArray(result.ndviData) && result.ndviData.length > 0
          ? result.ndviData[0].ndvi // assuming you return [{date, ndvi}]
          : null;

      if (ndvi !== null && ndvi !== undefined) {
        ndviSeries.push({
          date: d.toISOString().split("T")[0],
          ndvi: Number(ndvi),
        });
      }
    } catch (err) {
      console.warn(
        `Failed to fetch NDVI for ${d.toISOString().split("T")[0]}:`,
        err.message
      );
    }
  }

  return ndviSeries;
}

/**
 * Convenience wrapper for App.jsx to get time series.
 */
export async function fetchNdviTimeSeries(lat, lon, refDate) {
  return await computeNdviForDateRange(lat, lon, refDate);
}
