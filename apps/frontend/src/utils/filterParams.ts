import { FilterObject } from "../models/Filter";
import { getDefaultFilterValues } from "../components/Filter/utils";

export const SCALAR_FILTER_KEYS = [
  "singleDayTour",
  "multipleDayTour",
  "summerSeason",
  "winterSeason",
  "traverse",
  "minAscent",
  "maxAscent",
  "minDescent",
  "maxDescent",
  "minTransportDuration",
  "maxTransportDuration",
  "minDistance",
  "maxDistance",
] as const;

export const ARRAY_FILTER_KEYS = [
  "ranges",
  "types",
  "languages",
  "difficulties",
  "providers",
  "countries",
] as const;

/**
 * Serialize the active (non-default) filter values into URL query params.
 * Values equal to the defaults are removed so the URL stays clean.
 * Shared by SearchParamSync (Redux → URL) and the landing → /search
 * navigation so filters survive the transition.
 */
export function writeFilterParams(
  params: URLSearchParams,
  filter: FilterObject,
) {
  const defaults = getDefaultFilterValues();
  for (const key of SCALAR_FILTER_KEYS) {
    const val = filter[key];
    if (val !== undefined && val !== defaults[key]) {
      params.set(key, String(val));
    } else {
      params.delete(key);
    }
  }
  for (const key of ARRAY_FILTER_KEYS) {
    const arr = filter[key];
    if (arr?.length) {
      params.set(key, arr.map(String).join("|"));
    } else {
      params.delete(key);
    }
  }
}
