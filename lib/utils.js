import { RECOMMENDATION_RULES } from '../constants.js';

/**
 * Determines if a nutrient's value is low, optimum, or high based on predefined rules.
 */
export function getStatusForValue(nutrient, value) {
    const rules = RECOMMENDATION_RULES[nutrient];
    if (value >= rules.low.range[0] && value < rules.low.range[1]) {
        return 'low';
    }
    if (value >= rules.optimum.range[0] && value < rules.optimum.range[1]) {
        return 'optimum';
    }
    return 'high';
}

/**
 * Parses a CSV file into an array of objects.
 * @param file The CSV file to parse.
 * @returns A promise that resolves to an array of objects, where each object represents a row.
 */
export function parseCsv(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') {
                    resolve([]);
                    return;
                }
                const lines = text.split(/[\r\n]+/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                     resolve([]); // No data rows
                     return;
                }
                const headers = lines[0].split(',').map(h => h.trim());
                const data = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index]?.trim();
                    });
                    return row;
                });
                resolve(data);
            } catch (error) {
                reject(new Error("Failed to parse CSV file."));
            }
        };
        reader.onerror = () => {
            reject(new Error("Failed to read file."));
        };
        reader.readAsText(file);
    });
}