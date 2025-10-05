import { NasaExoplanet } from '../types';

const CSV_API_URL_KEPLER = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=csv&where=pl_kepflag=1 and pl_rade is not null and st_dist is not null and pl_insol is not null";

// Simple CSV parser
const parseCSV = (csvText: string): Record<string, any>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    // Filter out comment lines that start with #
    const dataLines = lines.filter(line => !line.startsWith('#'));
    if(dataLines.length < 2) return [];

    const headers = dataLines[0].split(',');
    const data = [];

    for (let i = 1; i < dataLines.length; i++) {
        const values = dataLines[i].split(',');
        if (values.length === headers.length) {
            const entry: Record<string, any> = {};
            for (let j = 0; j < headers.length; j++) {
                const header = headers[j].trim();
                const value = values[j].trim();
                // Try to convert to number if it's a valid-looking number string
                entry[header] = !isNaN(parseFloat(value)) && isFinite(value as any) && value !== '' ? parseFloat(value) : value;
            }
            data.push(entry);
        }
    }
    return data;
};


export const fetchKeplerExoplanets = async (): Promise<NasaExoplanet[]> => {
    try {
        const response = await fetch(CSV_API_URL_KEPLER);
        if (!response.ok) {
            throw new Error(`NASA API request failed with status: ${response.status}`);
        }
        const csvData = await response.text();
        return parseCSV(csvData) as NasaExoplanet[];
    } catch (error) {
        console.error("Failed to fetch Kepler exoplanets:", error);
        return []; // Return empty array on failure
    }
};