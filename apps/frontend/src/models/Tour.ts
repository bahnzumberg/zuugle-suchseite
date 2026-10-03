import type { TourWeatherDay } from "./tourWeather";

export interface Tour {
  id: number;
  provider: string;
  hashed_url: string;
  url: string;
  title: string;
  image_url: string;
  type: string;
  country: string;
  state: string;
  range_slug: string;
  range: string;
  text_lang: string;
  difficulty_orig: string;
  season: string;
  max_ele: number;
  connection_arrival_stop_lon: string;
  connection_arrival_stop_lat: string;
  start_stop_lon: number;
  start_stop_lat: number;
  end_stop_lon: number;
  end_stop_lat: number;
  min_connection_duration: number;
  min_connection_no_of_transfers: number;
  avg_total_tour_duration: string;
  ascent: number;
  descent: number;
  difficulty: string;
  duration: string;
  distance: string;
  number_of_days: number;
  traverse: number;
  quality_rating: number;
  month_order: number;
  gpx_file: string;
  provider_name: string;
  valid_tour?: number;
  description?: string;
  /**
   * Today and the next three days, ascending, in Europe/Vienna. Null when the
   * weather import has no forecast for this tour; absent on the endpoints that
   * do not return a weather strip at all.
   */
  weather?: TourWeatherDay[] | null;
  canonical: Canonical[];
}

export interface Canonical {
  city_slug: string;
  canonical_yn: string;
  zuugle_url: string;
  href_lang: string;
}
