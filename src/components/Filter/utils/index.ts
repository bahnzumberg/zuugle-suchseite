import { FilterObject, Provider } from "../../../models/Filter";

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

export function displayAsSelected<T extends keyof FilterObject>(
  arrayKey: T,
  value: number | string | Provider,
  tempFilter: FilterObject,
): boolean {
  const array = tempFilter[arrayKey];
  if (!Array.isArray(array)) {
    return true; // default
  }

  // @ts-ignore
  return array.includes(value);
}
