import * as React from "react";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { t } from "i18next";

export const getPageHeader = (directLink) => {
  
  if (!!directLink && !!directLink.header) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>{directLink.header}</title>
          <meta name="og:title" content={directLink.header} />
          <meta name="og:description" content={directLink.description} />
        </Helmet>
      </HelmetProvider>
    );
  } else {
    return (
      <HelmetProvider>
        <Helmet>
          {/* <title>start.helmet_title</title> */}
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
  }
};


export const extractCityFromLocation = (location, cities) => {
  //searching for the case: "/cityslug" in location.pathname, in that case we check if it is a valid city, 
  if (!!location && location.pathname.startsWith('/')) {
    const pathSegments = location.pathname.split('/').filter(segment => !!segment);
    
    if (pathSegments.length === 1 && pathSegments[0] === 'search') {
      if (!!location && !!location.search) {
        const searchParams = new URLSearchParams(location.search);
        const cityParam = searchParams.get("city");
        return cityParam;
      }
    } else if (pathSegments.length === 1) {
      const citySlug = pathSegments[0];

      // Check if citySlug exists in the cities array
      const matchingCity = cities.find(city => city.value === citySlug);
      
      if (matchingCity) {
        
        return matchingCity.value; // Set the city parameter to the label of the matching city
      }
    }
  }
  
  return null; // Return null if city param is not search or if the path doesn't match the pattern
};

export const getCityLabel = (location, cities) => {
  let citySlug = !!location ? extractCityFromLocation(location, cities) : null;
  if(!!cities && cities.length > 0){
    const found = cities.find(
      (city) => city.value == citySlug
    );
    if (!!found && !!found.label) {
      return found.label
      }else return "" ;
    }else{
      return "";
    }
}

export const checkIfSeoPageCity = (location, cities) => {

  let citySlug = extractCityFromLocation(location,cities); // this is the city extracted from city param and not from location.pathname
 
  if (!!location && !!location.pathname && location.pathname == "/search") {
    return null;
  } else if (!!location && !!location.pathname && cities.length > 0) {
    const found = cities.find(
      (city) => city.value == citySlug
    );
    return found;
  } else {
    return null;
  }
};

export const listAllCityLinks = (cities, searchParams = null) => {

  const country = translatedCountry();

  if (!!cities) {
    const entries = cities.map((city, index) => {
      let link = `${city.value}`;
      if (!!searchParams && !!searchParams.get("p")) { // redundant if we do not use provider anymore
        link = `${link}?p=${searchParams.get("p")}`;
      }
      return (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <a href={`/${link}`} className={"seo-city-link"}>
            {city.label}
          </a>
        </Grid>
      );
    });
    return (
      <Box sx={{ textAlign: "left" }}>
        <Typography variant={"h4"} sx={{ marginBottom: "20px" }}>
          <>{country}</>
        </Typography>
        <Grid container>{entries}</Grid>
      </Box>
    );
  }
};

export const listAllRangeLinks = (ranges, searchParams = null) => {

  const country = translatedCountry();

  if (!!ranges) {
    const entries = ranges.map((range, index) => {
      let city = "";
      let link = `${range.range}`;
      if (link == "null") {
        return [];
      }
      link = encodeURI(link);
      if (!!searchParams && !!searchParams.get("p")) {
        link = `${link}?p=${searchParams.get("p")}`;
      }
      if (!!searchParams && !!searchParams.get("city")) {
        city = searchParams.get("city");
      }
      return (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <a
            href={`/search?range=${link}${!!city ? "&city=" + city : ""}`}
            className={"seo-city-link"}
          >
            {range.range}
          </a>
        </Grid>
      );
    });

    return (
      <Box sx={{ textAlign: "left" }}>
        <Typography variant={"h4"} sx={{ marginBottom: "20px" }}>
          <> {country} </>
        </Typography>
        <Grid container>{entries}</Grid>
      </Box>
    );
  }
  return [];
};


export const getCountryName = () => {
  let host = window.location.host;

  if (host.indexOf("zuugle.ch") >= 0) {
    return t("start.schweiz");
  } else if (host.indexOf("zuugle.de") >= 0) {
    return t("start.deutschland");
  } else if (host.indexOf("zuugle.it") >= 0) {
    return t("start.italien");
  } else if (host.indexOf("zuugle.li") >= 0) {
    return t("start.liechtenstein");
  } else if (host.indexOf("zuugle.fr") >= 0) {
    return t("start.frankreich");
  } else if (host.indexOf("zuugle.si") >= 0) {
    return t("start.slowenien");
  } else {
    return t("start.oesterreich");
  }
};

export const getTranslatedCountryName = () => {
  let host = window.location.host;

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