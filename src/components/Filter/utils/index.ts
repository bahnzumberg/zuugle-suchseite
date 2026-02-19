import { LocationWithRadius } from "../../../features/searchSlice";
import { FilterObject, Provider } from "../../../models/Filter";
import { areSetsEqual } from "../../../utils/globals";

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
