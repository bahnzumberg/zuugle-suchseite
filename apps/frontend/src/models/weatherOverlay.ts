export interface WeatherDay {
  date: string;
  file: string;
}

export interface WeatherLegendItem {
  score: number;
  color: string;
  label: string;
}

export interface WeatherMetadata {
  version: string;
  generated_at: string;
  bounds: [[number, number], [number, number]];
  days: WeatherDay[];
  legend: WeatherLegendItem[];
}

/**
 * Returns a copy of the metadata with any days before today removed.
 * Comparison uses the Europe/Vienna timezone so the cutoff matches the
 * target audience regardless of the browser's local timezone.
 * If all days are in the past the returned `days` array will be empty.
 */
export function filterPastDays(meta: WeatherMetadata): WeatherMetadata {
  const todayStr = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Europe/Vienna",
  }); // "YYYY-MM-DD"
  return {
    ...meta,
    days: meta.days.filter((d) => d.date >= todayStr),
  };
}
