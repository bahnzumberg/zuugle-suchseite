import { upcomingDays } from "./tourWeather";

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
 * Returns a copy of the metadata with any days before today (Europe/Vienna)
 * removed. If all days are in the past the returned `days` array will be empty.
 */
export function filterPastDays(meta: WeatherMetadata): WeatherMetadata {
  return { ...meta, days: upcomingDays(meta.days) };
}
