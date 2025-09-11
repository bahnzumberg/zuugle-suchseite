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
  totour_gpx_file: string;
  fromtour_gpx_file: string;
  provider_name: string;
  valid_tour?: number;
  description?: string;
  canonical: Canonical[];
}

export interface Canonical {
  city_slug: string;
  canonical_yn: string;
  zuugle_url: string;
  href_lang: string;
}
