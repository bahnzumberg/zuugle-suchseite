import type { TFunction } from "i18next";
import { assetUrl } from "../utils/assetUrl";

/** One day of the forecast strip, as returned by `/tours`. */
export interface TourWeatherDay {
  date: string; // "YYYY-MM-DD"
  icon: number | null; // 1..18, null where the weather import has no data
  score: number | null; // 0..100
}

/** One local hour of `/tours/:id/weather`. Sunshine and precipitation are sums from this hour to the next. */
export interface TourWeatherHour {
  hour: number; // local 0..23, Europe/Vienna
  icon: number | null;
  temp_high_c: number | null;
  temp_low_c: number | null;
  sunshine_h: number | null; // 0..1
  precipitation_mm: number | null;
  wind_speed_kmh: number | null;
  wind_direction_deg: number | null;
  thunderstorm_pct: number | null;
  freezing_level_m: number | null;
}

/** One day of `/tours/:id/weather`: the strip day plus local sun times and its hours. */
export interface TourWeatherDetailDay extends TourWeatherDay {
  sunrise: string | null; // "HH:MM", local
  sunset: string | null;
  hours: TourWeatherHour[];
}

export type WeatherGradeKey =
  | "excellent"
  | "very_good"
  | "good"
  | "moderate"
  | "poor"
  | "dangerous";

export type WeatherConditionKey =
  | "clear"
  | "cloudy"
  | "overcast"
  | "cloudy_rain"
  | "cloudy_snow"
  | "overcast_rain"
  | "overcast_snow"
  | "thunderstorm"
  | "extreme";

export interface WeatherIcon {
  file: string;
  grade: WeatherGradeKey;
  condition: WeatherConditionKey;
}

/**
 * The icon ids the weather import writes to `tour_weather_daily.tour_weather_icon`.
 *
 * Each id encodes the meteocons file *and* the grade tier.
 */
export const WEATHER_ICONS: Record<number, WeatherIcon> = {
  1: { file: "clear-day", grade: "excellent", condition: "clear" },
  2: { file: "clear-night", grade: "excellent", condition: "clear" },
  3: { file: "partly-cloudy-day", grade: "very_good", condition: "cloudy" },
  4: { file: "partly-cloudy-night", grade: "very_good", condition: "cloudy" },
  5: { file: "overcast-day", grade: "good", condition: "overcast" },
  6: { file: "overcast-night", grade: "good", condition: "overcast" },
  7: {
    file: "partly-cloudy-day-rain",
    grade: "moderate",
    condition: "cloudy_rain",
  },
  8: {
    file: "partly-cloudy-day-snow",
    grade: "moderate",
    condition: "cloudy_snow",
  },
  9: {
    file: "partly-cloudy-night-rain",
    grade: "moderate",
    condition: "cloudy_rain",
  },
  10: {
    file: "partly-cloudy-night-snow",
    grade: "moderate",
    condition: "cloudy_snow",
  },
  11: { file: "overcast-day-rain", grade: "poor", condition: "overcast_rain" },
  12: { file: "overcast-day-snow", grade: "poor", condition: "overcast_snow" },
  13: {
    file: "overcast-night-rain",
    grade: "poor",
    condition: "overcast_rain",
  },
  14: {
    file: "overcast-night-snow",
    grade: "poor",
    condition: "overcast_snow",
  },
  15: {
    file: "thunderstorms-day-rain",
    grade: "dangerous",
    condition: "thunderstorm",
  },
  16: { file: "extreme-day", grade: "dangerous", condition: "extreme" },
  17: {
    file: "thunderstorms-night-rain",
    grade: "dangerous",
    condition: "thunderstorm",
  },
  18: { file: "extreme-night", grade: "dangerous", condition: "extreme" },
};

/** How many days the strip shows at most — today plus three. */
export const WEATHER_STRIP_DAYS = 4;

export function weatherIconUrl(icon: WeatherIcon): string {
  return assetUrl(`icons/weather/${icon.file}.svg`);
}

/** Today in Europe/Vienna as "YYYY-MM-DD", matching `filterPastDays`. */
export function todayInVienna(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
}

/**
 * The days of a tour's forecast to render, still including the ones the weather
 * import has no data for.
 *
 * Those gaps deliberately keep their slot: the backend returns a fixed window
 * rather than "the next N days that have data", so every card puts the same date
 * in the same column. Collapsing a gap would shift the later days left and make
 * one card's columns disagree with its neighbours'. An icon id we do not know
 * (a new id from a future import) is treated as a gap rather than dropped, for
 * the same reason. Returns [] when nothing at all is renderable.
 *
 * Past days are dropped: RTK Query caches the tour list, so a tab left open
 * across midnight would otherwise keep labelling yesterday "Heute".
 */
export function visibleWeatherDays(
  days: TourWeatherDay[] | null | undefined,
): TourWeatherDay[] {
  if (!days) return [];

  const today = todayInVienna();
  const upcoming = days
    .filter((day) => day.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, WEATHER_STRIP_DAYS)
    .map((day) =>
      day.icon !== null && day.icon in WEATHER_ICONS
        ? day
        : { ...day, icon: null, score: null },
    );

  return upcoming.some((day) => day.icon !== null) ? upcoming : [];
}

/**
 * The column heading for one strip cell: "Heute" for today, otherwise a short
 * weekday.
 *
 * Deliberately shorter than `formatWeatherDayLabel` in `WeatherControls.tsx`,
 * which returns "Mi, 24.09." — that does not fit the ~50px cell the strip gets
 * at the `sm` breakpoint.
 */
export function formatWeatherWeekday(
  date: string,
  t: TFunction,
  locale: string = "de-AT",
): string {
  if (date === todayInVienna()) {
    return t("weather.today", { defaultValue: "Heute" });
  }
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
    weekday: "short",
    timeZone: "Europe/Vienna",
  });
}

/** "07:44" → 7.733… */
export function timeToHours(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
}

/** Used when a day lacks sunrise/sunset: a typical hiking day. */
const FALLBACK_WINDOW: [number, number] = [6, 20];

/**
 * The hours the detail table shows: from the hour before sunrise to the hour
 * after sunset, clamped to 5–22. That is ~6–20 in October, ~5–21 in summer
 * and ~7–17 in winter.
 */
export function hourWindow(day: TourWeatherDetailDay): [number, number] {
  if (!day.sunrise || !day.sunset) return FALLBACK_WINDOW;
  return [
    Math.max(5, Math.floor(timeToHours(day.sunrise)) - 1),
    Math.min(22, Math.ceil(timeToHours(day.sunset)) + 1),
  ];
}

/** The day's hours inside `hourWindow`; empty when the import has none there. */
export function hoursInWindow(day: TourWeatherDetailDay): TourWeatherHour[] {
  const [from, to] = hourWindow(day);
  return day.hours.filter((hour) => hour.hour >= from && hour.hour <= to);
}

/** Before sunrise or after sunset, judged at the full hour the column stands for. */
export function isNightHour(hour: number, day: TourWeatherDetailDay): boolean {
  if (!day.sunrise || !day.sunset) return false;
  return hour < timeToHours(day.sunrise) || hour > timeToHours(day.sunset);
}

/** Highest max / lowest min over the given hours, or null without values. */
export function tempRange(
  hours: TourWeatherHour[],
): { max: number; min: number } | null {
  const highs = hours.flatMap((hour) => hour.temp_high_c ?? []);
  const lows = hours.flatMap((hour) => hour.temp_low_c ?? []);
  if (highs.length === 0 || lows.length === 0) return null;
  return { max: Math.max(...highs), min: Math.min(...lows) };
}

export type CompassKey = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
const COMPASS: CompassKey[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

/** The 8-point sector wind comes from; the letters are translated (O/E, Z/V…). */
export function windCompassKey(degrees: number): CompassKey {
  return COMPASS[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
}
