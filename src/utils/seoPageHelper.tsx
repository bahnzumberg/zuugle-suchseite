import * as React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { CityObject } from "../features/searchSlice";

export interface DirectLink {
  header: string;
  description: string;
}

export const getPageHeader = (directLink: DirectLink) => {
  if (directLink?.header) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>{directLink.header}</title>
          <meta name="og:title" content={directLink.header} />
          <meta name="og:description" content={directLink.description} />
        </Helmet>
      </HelmetProvider>
    );
  }
  return (
    <HelmetProvider>
      <Helmet>
        <title>Zuugle</title>
        <meta
          name="title"
          content="Zuugle - die Suchmaschine für Öffi-Bergtouren"
        />
        <meta
          name="description"
          content="Zuugle zeigt dir geprüfte Verbindungen mit Bahn und Bus zu Bergtouren, Wanderungen, Skitouren, Schneeschuhwanderungen, etc. von deinem Wohnort aus an."
        />
      </Helmet>
    </HelmetProvider>
  );
};

export const extractCityFromLocation = (
  location: Location,
  cities: CityObject[],
) => {
  //searching for the case: "/cityslug" in location.pathname, in that case we check if it is a valid city,
  if (location?.pathname?.startsWith("/")) {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => !!segment);

    if (pathSegments.length === 1 && pathSegments[0] === "search") {
      return null;
    } else if (pathSegments.length === 1) {
      const citySlug = pathSegments[0];
      // Check if citySlug exists in the cities array
      const matchingCity = cities.find((city) => city.value === citySlug);
      if (matchingCity) {
        return matchingCity; // Set the city parameter to the label of the matching city
      }
    }
  }
  return null; // Return null if city param is not search or if the path doesn't match the pattern
};

export const getTranslatedCountryName = () => {
  const host = window.location.host;

  if (host.indexOf("zuugle.ch") >= 0) {
    return "start.schweiz";
  } else if (host.indexOf("zuugle.de") >= 0) {
    return "start.deutschland";
  } else if (host.indexOf("zuugle.it") >= 0) {
    return "start.italien";
  } else if (host.indexOf("zuugle.li") >= 0) {
    return "start.liechtenstein";
  } else if (host.indexOf("zuugle.fr") >= 0) {
    return "start.frankreich";
  } else if (host.indexOf("zuugle.si") >= 0) {
    return "start.slowenien";
  } else {
    return "start.oesterreich";
  }
};
