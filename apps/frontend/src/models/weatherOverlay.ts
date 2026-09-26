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
