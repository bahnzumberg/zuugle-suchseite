import { FilterObject } from "../../models/Filter";

export function getDefaultFilterValues(
  fetchedFilter: FilterObject | undefined,
): FilterObject {
  return {
    singleDayTour: true,
    multipleDayTour: true,
    summerSeason: true,
    winterSeason: true,
    traverse: false,
    minAscent: fetchedFilter?.minAscent ?? 0,
    maxAscent: fetchedFilter?.maxAscent ?? 3000,
    minDescent: fetchedFilter?.minDescent ?? 0,
    maxDescent: fetchedFilter?.maxDescent ?? 3000,
    minTransportDuration: fetchedFilter?.minTransportDuration ?? 0,
    maxTransportDuration: fetchedFilter?.maxTransportDuration ?? 50,
    minDistance: fetchedFilter?.minDistance ?? 0,
    maxDistance: fetchedFilter?.maxDistance ?? 80,
    ranges: fetchedFilter?.ranges ?? [],
    types: fetchedFilter?.types ?? [],
    languages: fetchedFilter?.languages ?? [],
    difficulties: fetchedFilter?.difficulties ?? [1, 2, 3],
    providers: fetchedFilter?.providers ?? [],
    countries: fetchedFilter?.countries ?? [],
  };
}
