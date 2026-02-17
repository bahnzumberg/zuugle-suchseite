import { TFunction } from "i18next";

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

//   const translatedCountries = (fetchedFilter?.countries ?? []).map(
//     (entry: string) => ({
//       value: entry,
//       label: countriesMap[entry] ?? entry,
//     }),
//   );

//   const translatedLanguages = (fetchedFilter?.languages ?? [])
//     .map((entry: string) => ({
//       value: entry,
//       label: languageMap[entry] ?? "",
//     }))
//     .filter((l) => !!l.value && !!l.label);

//   const translatedSportTypes = (fetchedFilter?.types ?? []).map(
//     (entry: string) => ({
//       value: entry,
//       label: sportTypesMap[entry] ?? "",
//     }),
//   );

//   const translatedRanges = (fetchedFilter?.ranges ?? []).map(
//     (entry: string) => ({
//       value: entry,
//       label: entry,
//     }),
//   );

//   const translatedDifficulties = (fetchedFilter?.difficulties ?? [1, 2, 3]).map(
//     (entry: number) => ({
//       value: entry,
//       label: difficultiesMap[entry] ?? "",
//     }),
//   );

//   const translatedProviders = (fetchedFilter?.providers ?? []).map(
//     (entry: string) => ({
//       value: entry,
//       label:
//         fetchedProviders?.find((p) => p.provider === entry)?.provider_name ??
//         "",
//     }),
//   );
