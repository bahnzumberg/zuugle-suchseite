import { TFunction } from "i18next";
import { LocationWithRadius } from "../../features/searchSlice";
import { FilterObject } from "../../models/Filter";
import { areSetsEqual } from "../../utils/globals";

export function getLanguageTranslationMap(
  t: TFunction<"translation", undefined>,
): Record<string, string> {
  return {
    de: t("filter.deutsch"),
    en: t("filter.englisch"),
    fr: t("filter.franzoesisch"),
    sl: t("filter.slowenisch"),
    it: t("filter.italienisch"),
  }; // TODO: think about language 'XX'
}

//TODO: why I need to specify type here
export function getSportTypeTranslationMap(
  t: TFunction<"translation", undefined>,
): Record<string, string> {
  return {
    "Bike & Hike": t("filter.bike_hike"),
    Hochtour: t("filter.hochtour"),
    Klettern: t("filter.klettern"),
    Klettersteig: t("filter.klettersteig"),
    Langlaufen: t("filter.langlaufen"),
    Rodeln: t("filter.rodeln"),
    Schneeschuh: t("filter.schneeschuh"),
    Skitour: t("filter.skitour"),
    Wandern: t("filter.wandern"),
    Weitwandern: t("filter.weitwandern"),
  };
}

export function getCountryTranslationMap(
  t: TFunction<"translation", undefined>,
): Record<string, string> {
  return {
    Deutschland: t("filter.country_deutschland"),
    Österreich: t("filter.country_oesterreich"),
    Tschechien: t("filter.country_tschechien"),
    Ungarn: t("filter.country_ungarn"),
    Schweiz: t("filter.country_schweiz"),
    Italia: t("filter.country_italien"),
    Slovenija: t("filter.country_slowenien"),
  };
}

//TODO: fake type, object or array index is always string
export function getDifficultyTranslationMap(
  t: TFunction<"translation", undefined>,
): Record<number, string> {
  return {
    1: t("filter.easy"),
    2: t("filter.medium"),
    3: t("filter.hard"),
    0: t("filter.unknown"),
  };
}

interface GetTransformedFilterOptionsInput {
  list: string[];
  translationMap: Record<string, string>;
}
export function getTransformedFilterOptions({
  list,
  translationMap,
}: GetTransformedFilterOptionsInput) {
  return list.map((entry: string) => ({
    value: entry,
    label: translationMap[entry] ?? "",
  }));
}
/**
 * Count the number of fields in tempFilter which are different from default values.
 */
interface CountFilterActiveArgs {
  geolocation: LocationWithRadius | null;
  defaultFilterValues: FilterObject;
  tempFilter: FilterObject;
}

export function countFilterActive({
  geolocation,
  defaultFilterValues,
  tempFilter,
}: CountFilterActiveArgs) {
  const isGeolocationSearchActive = geolocation?.lat && geolocation?.lng;
  return (
    Object.values(getActiveFilterFields({ defaultFilterValues, tempFilter }))
      .length + (isGeolocationSearchActive ? 1 : 0)
  );
}
/**
 *
 * Assemble filter object with only values that differ from default.
 */

interface GetActiveFilterFieldsParams {
  defaultFilterValues: FilterObject;
  tempFilter: FilterObject;
}

export function getActiveFilterFields({
  defaultFilterValues,
  tempFilter,
}: GetActiveFilterFieldsParams) {
  return Object.entries(defaultFilterValues).reduce(
    (activeFilters, [key, defVal]) => {
      const curVal = tempFilter[key as keyof FilterObject];

      //TODO: remove ts-ignore
      if (Array.isArray(defVal) && Array.isArray(curVal)) {
        // @ts-ignore
        const equalSets = areSetsEqual(new Set(defVal), new Set(curVal));
        if (!equalSets) {
          // @ts-ignore
          activeFilters[key] = curVal;
        }
        return activeFilters;
      }

      if (defVal !== curVal) {
        // @ts-ignore
        activeFilters[key] = curVal;
      }
      return activeFilters;
    },
    {} as FilterObject,
  );
}

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
